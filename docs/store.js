/* Data layer. Two implementations with the same interface:
   - Local: demo mode, everything in localStorage on this device
   - Live:  Supabase (accounts, electricians, calls, reviews, photos, realtime)
   The UI never talks to localStorage or Supabase directly. */
window.LOGON_STORE=(function(){
  const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
  const uid=()=>'u'+Math.random().toString(36).slice(2)+Date.now().toString(36);
  const emailOf=phone=>`216${phone}@phone.logon.tn`;
  const blobToDataUrl=b=>new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});
  const EVENING_END=23, NOW_HOURS=4;
  function availabilityWindow(mode){
    const now=Date.now();
    if(mode==='now') return {since:now,until:now+NOW_HOURS*3600000};
    if(mode==='evening'){const e=new Date();e.setHours(EVENING_END,0,0,0);if(e.getTime()<now)e.setDate(e.getDate()+1);return {since:now,until:e.getTime()}}
    return {since:0,until:0};
  }
  const fromRow=r=>({id:r.id,name:r.name,phone:r.phone,zoneId:r.zone_id,lat:r.lat,lng:r.lng,radiusKm:r.radius_km,skills:r.skills||[],desc:r.description||'',photo:r.photo_url||'',workPhotos:r.work_photos||[],mode:r.mode,since:r.available_since?Date.parse(r.available_since):0,until:r.available_until?Date.parse(r.available_until):0,verified:!!r.verified,rating:+r.rating||0,count:r.rating_count||0,createdAt:r.created_at?Date.parse(r.created_at):0});
  const toRow=(e,id)=>({id,name:e.name,phone:e.phone,zone_id:e.zoneId,lat:e.lat,lng:e.lng,radius_km:e.radiusKm,skills:e.skills,description:e.desc||'',photo_url:e.photo||null,work_photos:e.workPhotos||[],mode:e.mode||'off',available_since:e.since?new Date(e.since).toISOString():null,available_until:e.until?new Date(e.until).toISOString():null});

  /* ---------------- demo / local ---------------- */
  const K={acc:'logon3.accounts',ses:'logon3.session',el:'logon3.electricians',rev:'logon3.reviews',calls:'logon3.calls'};
  const Local={
    mode:'demo',
    accounts(){return LS.get(K.acc,{})}, saveAccounts(a){LS.set(K.acc,a)},
    async init(){this.ses=LS.get(K.ses,null)},
    session(){
      const s=this.ses; if(!s) return null;
      if(s.anon) return {id:s.id,anonymous:true};
      const a=this.accounts()[s.phone]; if(!a) return null;
      return {id:a.id,phone:a.phone,name:a.name,role:a.role,createdAt:a.createdAt,anonymous:false,isAdmin:!!a.admin};
    },
    async ensureAnon(){if(!this.ses){this.ses={anon:true,id:uid()};LS.set(K.ses,this.ses)}},
    async signUp({phone,pin,name,role}){
      const acc=this.accounts(); if(acc[phone]) throw new Error('exists');
      const id=(this.ses&&this.ses.anon)?this.ses.id:uid();
      acc[phone]={id,phone,name,role,pin,createdAt:Date.now(),admin:Object.keys(acc).length===0}; // first account on this device = demo admin
      this.saveAccounts(acc); this.ses={phone}; LS.set(K.ses,this.ses); return this.session();
    },
    async signIn({phone,pin}){const a=this.accounts()[phone];if(!a||a.pin!==pin)throw new Error('wrong');this.ses={phone};LS.set(K.ses,this.ses);return this.session()},
    async signOut(){this.ses=null;LS.set(K.ses,null)},
    async updateProfile(p){const acc=this.accounts();Object.assign(acc[this.ses.phone],p);this.saveAccounts(acc)},
    async changePin(pin){const acc=this.accounts();acc[this.ses.phone].pin=pin;this.saveAccounts(acc)},
    async deleteAccount(){
      const u=this.session(); if(!u||u.anonymous) return;
      const acc=this.accounts(); delete acc[u.phone]; this.saveAccounts(acc);
      const el=LS.get(K.el,{}); delete el[u.id]; LS.set(K.el,el);
      LS.set(K.rev,LS.get(K.rev,[]).filter(r=>r.authorId!==u.id&&r.electricianId!==u.id));
      LS.set(K.calls,LS.get(K.calls,[]).filter(c=>c.callerId!==u.id&&c.electricianId!==u.id));
      await this.signOut();
    },
    async listElectricians(){
      const demo=(window.LOGON_DEMO||[]).map(d=>({...d,demo:true}));
      const mine=Object.values(LS.get(K.el,{}));
      const revs=LS.get(K.rev,[]);
      return [...demo,...mine].map(e=>{const extra=revs.filter(r=>r.electricianId===e.id);const base=(e.rating||0)*(e.count||0);const sum=extra.reduce((a,r)=>a+r.stars,0);const count=(e.count||0)+extra.length;return {...e,rating:count?(base+sum)/count:0,count}});
    },
    subscribe(){return ()=>{}},
    async getMyElectrician(){const u=this.session();if(!u||u.anonymous)return null;return LS.get(K.el,{})[u.id]||null},
    async saveMyElectrician(e){const u=this.session();const all=LS.get(K.el,{});const prev=all[u.id]||{};all[u.id]={...prev,...e,id:u.id,phone:u.phone,verified:!!prev.verified,createdAt:prev.createdAt||Date.now()};LS.set(K.el,all);return all[u.id]},
    async deleteMyElectrician(){const u=this.session();const all=LS.get(K.el,{});delete all[u.id];LS.set(K.el,all)},
    async setAvailability(mode){const e=await this.getMyElectrician();if(!e)return;Object.assign(e,{mode},availabilityWindow(mode));return this.saveMyElectrician(e)},
    async uploadPhoto(blob){return blobToDataUrl(blob)},
    async recordCall(electricianId,channel){await this.ensureAnon();const u=this.session();const calls=LS.get(K.calls,[]);calls.push({id:uid(),electricianId,callerId:u.id,channel,createdAt:Date.now()});LS.set(K.calls,calls.slice(-200))},
    async myCalls(){const u=this.session();if(!u)return[];return LS.get(K.calls,[]).filter(c=>c.callerId===u.id).sort((a,b)=>b.createdAt-a.createdAt)},
    async myCallsReceived(sinceMs){const u=this.session();if(!u)return 0;return LS.get(K.calls,[]).filter(c=>c.electricianId===u.id&&c.createdAt>=sinceMs).length},
    async listReviews(id){
      const demo=(window.LOGON_DEMO||[]).find(d=>d.id===id);
      const base=demo?demo.reviews.map((r,i)=>({id:id+'-'+i,who:r.who,stars:r.stars,text:r.text,date:r.date})):[];
      const local=LS.get(K.rev,[]).filter(r=>r.electricianId===id).sort((a,b)=>b.createdAt-a.createdAt);
      return [...local,...base];
    },
    async addReview(id,stars,text){
      const u=this.session(); if(!u||u.anonymous) throw new Error('auth');
      const revs=LS.get(K.rev,[]).filter(r=>!(r.electricianId===id&&r.authorId===u.id));
      revs.unshift({id:uid(),electricianId:id,authorId:u.id,who:u.name,stars,text,createdAt:Date.now()});LS.set(K.rev,revs);
    },
    async adminList(){
      const mine=Object.values(LS.get(K.el,{})), calls=LS.get(K.calls,[]), revs=LS.get(K.rev,[]);
      return mine.map(e=>({...e,callsCount:calls.filter(c=>c.electricianId===e.id).length,reviewsCount:revs.filter(r=>r.electricianId===e.id).length}));
    },
    async setVerified(id,v){const all=LS.get(K.el,{});if(all[id]){all[id].verified=v;LS.set(K.el,all)}},
  };

  /* ---------------- live / Supabase ---------------- */
  const mapErr=e=>{const m=(e&&e.message||'').toLowerCase();if(m.includes('already registered')||m.includes('already been registered'))return new Error('exists');if(m.includes('invalid login'))return new Error('wrong');if(m.includes('anonymous'))return new Error('anon');return e};
  const Live={
    mode:'live', sb:null, user:null, profile:null, admin:false,
    async init(cfg){
      this.sb=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
      const {data:{session}}=await this.sb.auth.getSession(); this.user=session?.user||null;
      await this.loadProfile();
    },
    async loadProfile(){
      this.profile=null;this.admin=false; if(!this.user||this.user.is_anonymous) return;
      const {data}=await this.sb.from('profiles').select('*').eq('id',this.user.id).maybeSingle(); this.profile=data||null;
      const {data:ad}=await this.sb.from('admins').select('user_id').eq('user_id',this.user.id).maybeSingle(); this.admin=!!ad;
    },
    session(){
      if(!this.user) return null;
      if(this.user.is_anonymous||!this.profile) return {id:this.user.id,anonymous:true};
      return {id:this.user.id,phone:this.profile.phone,name:this.profile.name,role:this.profile.role,createdAt:Date.parse(this.profile.created_at),anonymous:false,isAdmin:this.admin};
    },
    async ensureAnon(){if(this.user)return;const {data,error}=await this.sb.auth.signInAnonymously();if(error){console.warn('anonymous sign-in unavailable',error.message);return}this.user=data.user},
    async signUp({phone,pin,name,role}){
      const email=emailOf(phone);
      if(this.user&&this.user.is_anonymous){
        const {data,error}=await this.sb.auth.updateUser({email,password:pin}); if(error) throw mapErr(error);
        this.user=data.user; await this.sb.auth.refreshSession(); const {data:{session}}=await this.sb.auth.getSession(); if(session) this.user=session.user;
      }else{
        const {data,error}=await this.sb.auth.signUp({email,password:pin}); if(error) throw mapErr(error);
        if(!data.session) throw new Error('confirm'); this.user=data.user;
      }
      const {error:pe}=await this.sb.from('profiles').upsert({id:this.user.id,phone,name,role}); if(pe) throw pe;
      await this.loadProfile(); return this.session();
    },
    async signIn({phone,pin}){
      const {data,error}=await this.sb.auth.signInWithPassword({email:emailOf(phone),password:pin}); if(error) throw mapErr(error);
      this.user=data.user; await this.loadProfile();
      if(!this.profile){await this.sb.from('profiles').upsert({id:this.user.id,phone,name:'',role:'client'});await this.loadProfile()}
      return this.session();
    },
    async signOut(){await this.sb.auth.signOut();this.user=null;this.profile=null;this.admin=false},
    async updateProfile(p){const {error}=await this.sb.from('profiles').update(p).eq('id',this.user.id);if(error)throw error;await this.loadProfile()},
    async changePin(pin){const {error}=await this.sb.auth.updateUser({password:pin});if(error)throw error},
    async deleteAccount(){const {error}=await this.sb.rpc('delete_me');if(error)throw error;await this.signOut()},
    async listElectricians(){const {data,error}=await this.sb.from('electricians_public').select('*');if(error)throw error;return data.map(fromRow)},
    subscribe(cb){const ch=this.sb.channel('electricians-live').on('postgres_changes',{event:'*',schema:'public',table:'electricians'},()=>cb()).subscribe();return ()=>this.sb.removeChannel(ch)},
    async getMyElectrician(){if(!this.user||this.user.is_anonymous)return null;const {data}=await this.sb.from('electricians_public').select('*').eq('id',this.user.id).maybeSingle();return data?fromRow(data):null},
    async saveMyElectrician(e){const row=toRow({...e,phone:this.profile.phone},this.user.id);const {data,error}=await this.sb.from('electricians').upsert(row).select().single();if(error)throw error;const cur=await this.getMyElectrician();return cur||fromRow({...data,rating:0,rating_count:0})},
    async deleteMyElectrician(){const {error}=await this.sb.from('electricians').delete().eq('id',this.user.id);if(error)throw error},
    async setAvailability(mode){const w=availabilityWindow(mode);const {error}=await this.sb.from('electricians').update({mode,available_since:w.since?new Date(w.since).toISOString():null,available_until:w.until?new Date(w.until).toISOString():null}).eq('id',this.user.id);if(error)throw error;return this.getMyElectrician()},
    async uploadPhoto(blob,name){const path=`${this.user.id}/${name}-${Date.now()}.jpg`;const {error}=await this.sb.storage.from('photos').upload(path,blob,{contentType:'image/jpeg',upsert:true});if(error)throw error;return this.sb.storage.from('photos').getPublicUrl(path).data.publicUrl},
    async recordCall(electricianId,channel){await this.ensureAnon();if(!this.user)return;await this.sb.from('calls').insert({electrician_id:electricianId,caller_id:this.user.id,channel})},
    async myCalls(){if(!this.user)return[];const {data}=await this.sb.from('calls').select('*').eq('caller_id',this.user.id).order('created_at',{ascending:false}).limit(50);return (data||[]).map(c=>({id:c.id,electricianId:c.electrician_id,channel:c.channel,createdAt:Date.parse(c.created_at)}))},
    async myCallsReceived(sinceMs){if(!this.user)return 0;const {count}=await this.sb.from('calls').select('*',{count:'exact',head:true}).eq('electrician_id',this.user.id).gte('created_at',new Date(sinceMs).toISOString());return count||0},
    async listReviews(id){const {data}=await this.sb.from('reviews').select('*').eq('electrician_id',id).order('created_at',{ascending:false});return (data||[]).map(r=>({id:r.id,who:r.author_name,stars:r.stars,text:r.text,createdAt:Date.parse(r.created_at),authorId:r.author_id}))},
    async addReview(id,stars,text){const s=this.session();if(!s||s.anonymous)throw new Error('auth');const {error}=await this.sb.from('reviews').upsert({electrician_id:id,author_id:this.user.id,author_name:s.name,stars,text},{onConflict:'electrician_id,author_id'});if(error)throw error},
    async adminList(){const {data,error}=await this.sb.from('electricians_admin').select('*').order('created_at',{ascending:false});if(error)throw error;return data.map(r=>({...fromRow({...r,rating:0,rating_count:r.reviews_count}),callsCount:+r.calls_count,reviewsCount:+r.reviews_count}))},
    async setVerified(id,v){const {error}=await this.sb.from('electricians').update({verified:v}).eq('id',id);if(error)throw error},
  };

  const api={
    impl:null, mode:'demo', availabilityWindow,
    async init(){
      const cfg=window.LOGON_CONFIG||{};
      if(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase){this.impl=Live;try{await Live.init(cfg)}catch(e){console.error('backend init failed, falling back to demo',e);this.impl=Local;await Local.init()}}
      else{this.impl=Local;await Local.init()}
      this.mode=this.impl.mode;
    },
    // effective availability at a given moment
    effective(e,at=Date.now()){
      if(!e||!e.mode||e.mode==='off')return 'off';
      if(!e.until||e.until<at)return 'off';
      if(e.mode==='now')return 'now';
      return new Date(at).getHours()>=18?'now':'evening';
    },
  };
  ['session','ensureAnon','signUp','signIn','signOut','updateProfile','changePin','deleteAccount','listElectricians','subscribe','getMyElectrician','saveMyElectrician','deleteMyElectrician','setAvailability','uploadPhoto','recordCall','myCalls','myCallsReceived','listReviews','addReview','adminList','setVerified']
    .forEach(m=>{api[m]=function(...a){return this.impl[m](...a)}});
  return api;
})();
