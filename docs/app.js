/* Log-ON Électriciens — UI */
(function(){
const T=window.LOGON_I18N, SKILLS=window.LOGON_SKILLS, SKILL_AR=window.LOGON_SKILL_AR, CITIES=window.LOGON_CITIES, Store=window.LOGON_STORE;
const STORE_INFO={tel:'72 231 330',telE164:'+21672231330',wa:'21672231330',mail:'ste@log-on.tn',site:'log-on.tn',fb:'https://www.facebook.com/LOGONTN/',ig:'https://www.instagram.com/logontn/',maps:'https://maps.google.com/?q=Log-ON+Avenue+Hedi+Nouira+Nabeul'};
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const K={lang:'logon.lang',loc:'logon3.loc',dismiss:'logon3.dismissed',cache:'logon3.cache'};

/* ---------- i18n ---------- */
let lang=LS.get(K.lang,null)||((navigator.language||'').toLowerCase().startsWith('ar')?'ar':'fr');
{const q=new URLSearchParams(location.search).get('lang');if(q==='ar'||q==='fr'){lang=q;LS.set(K.lang,q)}}
const t=(k,v)=>{let s=(T[lang][k]??T.fr[k]??k);if(v)for(const key in v)s=s.split('{'+key+'}').join(v[key]);return s};
const L=v=>v&&typeof v==='object'?(v[lang]??v.fr):v;
const skill=k=>lang==='ar'?(SKILL_AR[k]||k):k;
function countElec(n){
  if(lang==='fr') return `<b>${n}</b> électricien${n>1?'s':''} disponible${n>1?'s':''}`;
  if(n===0) return `<b>0</b> كهربائي متاح`; if(n===1) return `<b>1</b> كهربائي متاح`; if(n===2) return `<b>2</b> كهربائيان متاحان`; if(n<=10) return `<b>${n}</b> كهربائيين متاحين`; return `<b>${n}</b> كهربائيًا متاحًا`;
}
function applyStatic(){
  document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.title=t('title');
  document.querySelectorAll('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  document.querySelectorAll('[data-th]').forEach(el=>el.innerHTML=t(el.dataset.th));
  document.querySelectorAll('[data-ta]').forEach(el=>{const [attr,key]=el.dataset.ta.split(':');el.setAttribute(attr,t(key))});
}
function setLang(l){lang=l;LS.set(K.lang,l);applyStatic();render()}

/* ---------- icons ---------- */
const I={
 pin:'<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
 phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
 star:'<path d="M12 2.5l2.9 6.2 6.8.8-5 4.6 1.3 6.7L12 17.4l-6 3.4 1.3-6.7-5-4.6 6.8-.8z"/>',
 bolt:'<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
 chev:'<path d="M6 9l6 6 6-6"/>',
 chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/>',
 check:'<path d="M5 12l5 5 9-11"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 edit:'<path d="M4 20h4l10-10-4-4L4 16z"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 bulb:'<path d="M12 2.5a6.5 6.5 0 0 0-3.9 11.7c.8.6 1.4 1.5 1.4 2.5V18h5v-1.3c0-1 .6-1.9 1.4-2.5A6.5 6.5 0 0 0 12 2.5z M9.5 21h5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 target:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
 tag:'<path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="8" cy="8" r="1.5"/>',
 box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z M3 7l9 4 9-4M12 11v10"/>',
 shield:'<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 store:'<path d="M3 9l1.5-5h15L21 9M3 9h18M3 9v11h18V9M9 20v-6h6v6"/>',
 gauge:'<path d="M4 14a8 8 0 1 1 16 0"/><path d="M12 14l4-4"/><circle cx="12" cy="14" r="1.5"/>',
 out:'<path d="M10 4H5v16h5M14 8l4 4-4 4M8 12h10"/>',
 lang:'<path d="M4 5h10M9 3v2c0 5-3 9-6 11M6 9c1 3 4 6 8 8M13 20l4-9 4 9M14.5 17h5"/>',
 key:'<circle cx="8" cy="14" r="4"/><path d="M11 11l9-9M16 6l3 3M13 9l3 3"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 map:'<path d="M9 4l6 2 6-2v14l-6 2-6-2-6 2V6z M9 4v14 M15 6v14"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5h.01"/>',
 doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
};
const ic=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

/* ---------- state ---------- */
const state={
  screen:'welcome',tab:'clients',mode:'now',skill:'Tous',urgent:false,editing:false,adminTab:'elec',promo:null,myDevis:[],adminDevis:[],adminElecs:[],
  origin:LS.get(K.loc,null)||{id:'nabeul',lat:CITIES[0].lat,lng:CITIES[0].lng},
  electricians:[],loaded:false,offline:false,myEl:null,myCalls:[],auth:null,unsub:null,pending:{avatar:null,work:[]},
};
const me=()=>Store.session();
const isPro=()=>{const m=me();return !!m&&!m.anonymous&&m.role==='pro'};
const isApproved=()=>!!state.myEl&&state.myEl.status==='approved';
const fmtDate=x=>new Date(x).toLocaleDateString(locale(),{day:'numeric',month:'short'});
const cityOf=id=>CITIES.find(c=>c.id===id)||CITIES[0];
const originLabel=()=>state.origin.id==='gps'?t('loc.mypos'):L(cityOf(state.origin.id).name);

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const R2D=Math.PI/180;
function km(a,b){const Rk=6371,dLat=(b.lat-a.lat)*R2D,dLng=(b.lng-a.lng)*R2D,la1=a.lat*R2D,la2=b.lat*R2D;const h=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;return 2*Rk*Math.asin(Math.sqrt(h))}
function bearing(a,b){const φ1=a.lat*R2D,φ2=b.lat*R2D,Δλ=(b.lng-a.lng)*R2D;const y=Math.sin(Δλ)*Math.cos(φ2),x=Math.cos(φ1)*Math.sin(φ2)-Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);return Math.atan2(y,x)}
const dec=n=>lang==='fr'?n.toFixed(1).replace('.',','):n.toFixed(1);
const fmtKm=d=>d<1?`${Math.round(d*100)*10} ${t('m')}`:d<10?`${dec(d)} ${t('km')}`:`${Math.round(d)} ${t('km')}`;
const locale=()=>lang==='ar'?'ar-TN':'fr-FR';
const fmtTime=x=>new Date(x).toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'});
const fmtWhen=x=>{const d=Math.floor((Date.now()-x)/86400000);return d<=0?t('when.today'):d===1?t('when.yesterday'):t('when.days',{n:d})};
const initials=n=>(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase();
const HUES=['#5B6B7A','#6E5B7A','#5B7A6A','#7A6A5B','#4F6F8F','#8A5E5E','#5E7A8A'];
const hue=n=>HUES[[...(String(n)||'')].reduce((a,c)=>a+c.charCodeAt(0),0)%HUES.length];
const digits=s=>String(s||'').replace(/\D/g,'');
const fmtTel=d=>d.length===8?`${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`:d;
const tel=d=>`<span class="ltr tnum">+216 ${fmtTel(d)}</span>`;
const firstName=n=>(n||'').split(' ')[0];
let toastT;function toast(m){const x=$('#toast');x.textContent=m;x.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>x.classList.remove('show'),3400)}
const busy=(btn,on)=>{if(!btn)return;btn.classList.toggle('busy',on);if(on){btn.dataset.label=btn.innerHTML;btn.textContent=t('f.saving')}else if(btn.dataset.label){btn.innerHTML=btn.dataset.label}};
function resizeImage(file,S,q=.82){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');let w=img.width,h=img.height;const sc=Math.min(1,S/Math.max(w,h));c.width=Math.round(w*sc);c.height=Math.round(h*sc);c.getContext('2d').drawImage(img,0,0,c.width,c.height);c.toBlob(b=>b?res(b):rej(new Error('img')),'image/jpeg',q)};img.onerror=rej;img.src=r.result};r.readAsDataURL(file)})}
function squareImage(file,S){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas'),s=Math.min(img.width,img.height);c.width=c.height=S;c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,S,S);c.toBlob(b=>b?res(b):rej(new Error('img')),'image/jpeg',.82)};img.onerror=rej;img.src=r.result};r.readAsDataURL(file)})}

/* ---------- electricians (view model) ---------- */
function view(){
  const m=me(), now=Date.now();
  return state.electricians.map(e=>{
    const eff=Store.effective(e,now);
    return {...e,name:L(e.name),desc:L(e.desc),zone:L(cityOf(e.zoneId).name),eff,dist:km(state.origin,e),mine:!!m&&e.id===m.id,approved:e.status==='approved',hueKey:e.demo?e.id:(e.phone||e.id)};
  });
}
const effRank={now:0,evening:1,off:2};
const avatar=(e,lg='',pip=true)=>`<div class="avatar ${lg}" style="--h:${hue(e.hueKey||e.id)}">${e.photo?`<img src="${esc(e.photo)}" alt="">`:esc(initials(e.name))}${pip?`<span class="pip ${e.eff==='now'?'':e.eff==='evening'?'ev':'off'}"></span>`:''}</div>`;
const statusPill=e=>e.eff==='now'?`<span class="status ok"><span class="dot"></span>${t('status.ok')}</span>`:e.eff==='evening'?`<span class="status ev"><span class="dot"></span>${t('status.evening')}</span>`:`<span class="status off"><span class="dot"></span>${t('status.off')}</span>`;
const vbadge=e=>e.approved?`<span class="vbadge" title="${t('badge.approved.sub')}">${ic('shield')}${t('badge.approved')}</span>`:'';
const starRow=r=>`<span class="stars" aria-label="${r}/5">${[1,2,3,4,5].map(i=>ic('star','fill'+(i<=r?'':' dim'))).join('')}</span>`;
const rating=e=>e.count?`<span>${ic('star','fill')} <b>${dec(e.rating)}</b> <span class="muted">(${e.count})</span></span>`:`<span class="muted">${t('new')}</span>`;
const waLink=e=>`https://wa.me/216${digits(e.phone)}?text=${encodeURIComponent(t('wa.msg',{zone:originLabel()}))}`;

async function refresh(){
  try{state.electricians=await Store.listElectricians();state.offline=false;LS.set(K.cache,state.electricians)}
  catch(e){console.warn(e);state.electricians=LS.get(K.cache,[]);state.offline=true}
  state.loaded=true;
  state.myEl=isPro()?await Store.getMyElectrician().catch(()=>null):null;
  const m=me(); state.myCalls=m?await Store.myCalls().catch(()=>[]):[];
  state.myDevis=m?await Store.myDevis().catch(()=>[]):[];
  state.promo=await Store.getPromo().catch(()=>null);
  if(m&&m.isAdmin){state.adminDevis=await Store.adminDevis().catch(()=>[]);state.adminElecs=await Store.adminList().catch(()=>[])}
  if(state.screen==='main')setTab(state.tab,true);
  if(state.screen==='welcome')renderPromo('#w-promo');
}
const promoLive=()=>{const p=state.promo;if(!p||!p.active||!(p.titleFr||p.titleAr))return null;if(p.endsOn&&new Date(p.endsOn+'T23:59:59')<new Date())return null;return p};
function promoHTML(p,dark){
  const title=lang==='ar'?(p.titleAr||p.titleFr):(p.titleFr||p.titleAr), text=lang==='ar'?(p.textAr||p.textFr):(p.textFr||p.textAr);
  return `<div class="promo ${dark?'dark':''}">${p.image?`<img src="${esc(p.image)}" alt="" loading="lazy">`:''}<div class="promo-body"><span class="eyebrow">${ic('tag')} ${t('pr.eyebrow')}</span><h3>${esc(title)}</h3>${text?`<p>${esc(text)}</p>`:''}${p.endsOn?`<span class="small muted">${t('pr.until',{date:new Date(p.endsOn+'T12:00:00').toLocaleDateString(locale(),{day:'numeric',month:'long'})})}</span>`:''}</div></div>`;
}
function renderPromo(sel){const box=$(sel);if(!box)return;const p=promoLive();box.innerHTML=p?promoHTML(p,sel==='#w-promo'):'';box.hidden=!p}
const adminBadge=()=>{const m=me();if(!m||!m.isAdmin)return 0;return state.adminElecs.filter(e=>e.status==='pending').length+state.adminDevis.filter(d=>d.status==='received').length};

/* ---------- screens ---------- */
function render(){
  const s=state.screen;
  $('#s-welcome').hidden=s!=='welcome';$('#s-auth').hidden=s!=='auth';$('#s-main').hidden=s!=='main';$('#tabbar').hidden=s!=='main';
  $('#app').classList.toggle('tabs',s==='main');
  if(s==='auth')renderAuth();else $('#auth-body').innerHTML='';
  if(s==='main'){renderTabs();renderHeader();setTab(state.tab,true)}
  if(s==='welcome')renderPromo('#w-promo');
  window.scrollTo({top:0});
}
function go(screen){state.screen=screen;render()}

/* ---------- auth: phone → (name →) PIN ---------- */
function startAuth(mode,role){state.auth={mode,role,step:'phone',phone:'',name:'',pin:''};go('auth')}
function renderAuth(){
  const a=state.auth, pro=a.role==='pro', b=$('#auth-body');
  if(a.step==='phone'){
    b.innerHTML=`<div><h1>${a.mode==='signup'?(pro?t('a.signup.pro'):t('a.signup')):t('login')}</h1><p class="lead" style="margin-top:6px">${pro&&a.mode==='signup'?t('a.phone.pro'):t('a.phone.sub')}</p></div>
      <form class="form" id="f-auth" novalidate>
        <div class="field" id="fw-aphone"><label for="a-phone">${t('a.phone.label')}</label><div class="tel-wrap"><span>+216</span><input id="a-phone" inputmode="tel" autocomplete="tel-national" placeholder="5x xxx xxx" value="${esc(fmtTel(a.phone))}" autofocus></div><span class="err">${t('a.phone.err')}</span></div>
        <button type="submit" class="btn primary lg">${t('a.next')}</button>
      </form>
      <div class="linkrow">${a.mode==='signup'?`<span class="muted">${t('a.have')}</span><button type="button" data-switch="login">${t('login')}</button>`:`<span class="muted">${t('a.none')}</span><button type="button" data-switch="signup">${t('a.create')}</button>`}</div>`;
    $('#f-auth').addEventListener('submit',e=>{e.preventDefault();const ph=digits($('#a-phone').value);if(ph.length!==8){$('#fw-aphone').classList.add('invalid');return}a.phone=ph;a.step=a.mode==='signup'?'name':'pin';renderAuth()});
    b.querySelector('[data-switch]').addEventListener('click',e=>{a.mode=e.target.dataset.switch;a.phone=digits($('#a-phone').value);renderAuth()});
  }
  else if(a.step==='name'){
    b.innerHTML=`<div><h1>${pro?t('a.name.pro.h'):t('a.name.h')}</h1><p class="lead" style="margin-top:6px">${pro?t('a.name.pro.sub'):t('a.name.sub')}</p></div>
      <form class="form" id="f-aname" novalidate>
        <div class="field" id="fw-aname"><label for="a-name">${pro?t('a.name.pro.label'):t('a.name.label')}</label><input id="a-name" autocomplete="name" placeholder="${pro?t('a.name.ph.pro'):t('a.name.ph')}" value="${esc(a.name)}" autofocus><span class="err">${t('a.name.err')}</span></div>
        <button type="submit" class="btn primary lg">${t('a.next')}</button>
      </form>`;
    $('#f-aname').addEventListener('submit',e=>{e.preventDefault();const n=$('#a-name').value.trim();if(!n){$('#fw-aname').classList.add('invalid');return}a.name=n;a.step='pin';renderAuth()});
  }
  else if(a.step==='pin'){
    const signup=a.mode==='signup';
    b.innerHTML=`<div><h1>${signup?t('a.pin.create.h'):t('a.pin.h')}</h1><p class="lead" style="margin-top:6px">${signup?t('a.pin.create.sub'):t('a.pin.login.sub')}</p></div>
      <form class="form" id="f-pin" novalidate>
        <div class="field" id="fw-pin"><label for="a-pin">${t('a.pin.label')}</label><input id="a-pin" class="codebox" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="${signup?'new-password':'current-password'}" placeholder="••••••" autofocus><span class="err" id="a-pinerr">${t('a.pin.err')}</span></div>
        <button type="submit" class="btn primary lg" id="a-go">${ic('check')}${signup?t('a.finish'):t('login')}</button>
      </form>
      <p class="small muted center">${signup?'':t('a.pin.forgot')}</p>`;
    $('#f-pin').addEventListener('submit',async e=>{
      e.preventDefault();const pin=digits($('#a-pin').value),fw=$('#fw-pin'),err=$('#a-pinerr'),btn=$('#a-go');
      if(pin.length!==6){err.textContent=t('a.pin.err');fw.classList.add('invalid');return}
      fw.classList.remove('invalid');busy(btn,true);
      try{
        const u=signup?await Store.signUp({phone:a.phone,pin,name:a.name,role:a.role}):await Store.signIn({phone:a.phone,pin});
        await finishLogin(u,signup);
      }catch(ex){
        busy(btn,false);
        const code=ex&&ex.message;
        err.textContent=code==='exists'?t('a.phone.exists'):code==='wrong'?t('a.pin.wrong'):t('err.generic');
        if(code!=='exists'&&code!=='wrong')console.error(ex);
        fw.classList.add('invalid');
      }
    });
  }
}
async function finishLogin(u,fresh){
  state.auth=null;state.editing=false;
  if(u.role==='pro'&&fresh&&state.screen==='auth'){/* new pro: straight to the fiche */}
  state.tab=u.role==='pro'?'activite':'clients';
  await refresh();go('main');
  toast(t(fresh?'welcome.new':'welcome.back',{name:firstName(u.name)}));
}
async function enterGuest(){await Store.ensureAnon();state.tab='clients';await refresh();go('main')}
async function logout(){if(state.unsub){state.unsub();state.unsub=null}await Store.signOut();state.myEl=null;state.myCalls=[];state.tab='clients';go('welcome')}

/* ---------- main: header & tabs ---------- */
function renderHeader(){const m=me(),b=$('#acctbtn');const real=m&&!m.anonymous;b.innerHTML=real?(state.myEl?.photo?`<img src="${esc(state.myEl.photo)}" alt="">`:esc(initials(m.name))):ic('user');b.style.background=real?hue(m.phone):''}
function tabsFor(){const x=[];if(isPro())x.push({id:'activite',icon:'gauge',live:state.myEl&&Store.effective(state.myEl)!=='off'});x.push({id:'clients',icon:'bolt'},{id:'store',icon:'store'},{id:'account',icon:'user'});return x}
function renderTabs(){$('#tabbar').innerHTML=tabsFor().map(x=>`<button type="button" data-tab="${x.id}" aria-pressed="${state.tab===x.id}">${ic(x.icon)}${t('tab.'+x.id)}${x.live?'<span class="live"></span>':''}</button>`).join('')}
function setTab(x,silent){
  if(x!=='admin'&&!tabsFor().some(y=>y.id===x))x='clients';
  state.tab=x;
  document.querySelectorAll('#tabbar [data-tab]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.tab===x));
  ['clients','activite','store','account','admin'].forEach(v=>$('#view-'+v).hidden=v!==x);
  if(x==='clients'){renderSkillChips();renderList();renderPrompt()}
  if(x==='activite')renderActivite();
  if(x==='store')renderStore();
  if(x==='account')renderAccount();
  if(x==='admin')renderAdmin();
  if(!silent)window.scrollTo({top:0});
}

/* ---------- client home ---------- */
function renderSkillChips(){
  const chips=[`<button type="button" class="chip urgent" data-urgent aria-pressed="${state.urgent}">${ic('alert')} ${t('chip.urgent')}</button>`,
    ...['Tous',...SKILLS].map(s=>`<button type="button" class="chip" data-skill="${esc(s)}" aria-pressed="${state.skill===s}">${s==='Tous'?t('skill.all'):esc(skill(s))}</button>`)];
  $('#skillchips').innerHTML=chips.join('');
}
function filtered(){
  const all=view().filter(e=>e.approved);
  let items=all.filter(e=>state.mode==='all'||(state.mode==='now'?e.eff==='now':e.eff!=='off'));
  if(state.skill!=='Tous')items=items.filter(e=>e.skills.includes(state.skill));
  items.sort((a,b)=>(effRank[a.eff]-effRank[b.eff])||(a.dist-b.dist));
  return {all,items};
}
function renderList(){
  $('#locname').textContent=originLabel();
  if(!state.loaded){$('#list').innerHTML=[1,2,3].map(()=>`<div class="skel"><i class="a"></i><div><i class="l1"></i><i class="l2"></i><i class="l3"></i></div></div>`).join('');$('#radar-count').innerHTML=`<span>${t('loading')}</span>`;return}
  const {all,items}=filtered();
  const nowN=all.filter(e=>e.eff==='now').length,evN=all.filter(e=>e.eff!=='off').length;
  $('#cnt-now').textContent=nowN;$('#cnt-evening').textContent=evN;$('#cnt-all').textContent=all.length;
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===state.mode));
  const near=all.filter(e=>e.eff==='now'&&e.dist<=15).length;
  $('#radar-count').innerHTML=`${countElec(near)}<span>${t('c.within',{place:esc(originLabel())})}</span>`;
  renderRadar(items);
  const notes=[];
  if(state.offline)notes.push(`<div class="note">${ic('info')}<span>${t('offline')}</span></div>`);
  if(items.length&&state.mode!=='all'&&Math.min(...items.map(e=>e.dist))>5&&Math.min(...items.map(e=>e.dist))<=120)notes.push(`<div class="note">${ic('info')}<span>${t('c.nearest')}</span></div>`);
  $('#listnote').innerHTML=notes.join('');
  if(!items.length){
    $('#list').innerHTML=all.length?`<div class="empty">${ic('bolt')}<h3>${t('c.empty.h',{skill:esc(state.urgent?t('chip.urgent'):skill(state.skill))})}</h3><p>${t('c.empty.p')}</p></div>`
      :`<div class="empty">${ic('bolt')}<h3>${t('c.empty.live.h')}</h3><p>${t('c.empty.live.p')}</p><div style="margin-top:14px">${isPro()?`<button type="button" class="btn primary" data-tab="activite">${t('c.empty.live.cta')}</button>`:`<button type="button" class="btn primary" data-auth="signup:pro">${t('w.pro.create')}</button>`}</div></div>`;
  }else $('#list').innerHTML=items.map(cardHTML).join('');
  $('#devis-cta').innerHTML=isPro()?'':devisCtaHTML();
  const far=items.length&&Math.min(...items.map(e=>e.dist))>120;
  const dn=$('#demonote');
  if(Store.mode==='demo'){dn.hidden=false;dn.innerHTML=far?`${ic('info')}<span>${t('c.far',{place:esc(originLabel())})}</span>`:`${ic('info')}<span>${t('c.demo')} ${isPro()?t('c.demo.pro'):t('c.demo.client')}</span>`}else dn.hidden=true;
}
function renderRadar(items){
  const H=224,cx=160,cy=112,Rr=98,dmax=12;
  const rOf=d=>Rr*Math.sqrt(Math.min(d,dmax)/dmax);
  const rings=[2,5,10].map(d=>`<circle class="ring" cx="${cx}" cy="${cy}" r="${rOf(d).toFixed(1)}"/><text class="lbl" x="${cx+4}" y="${(cy-rOf(d)-3).toFixed(1)}">${d} ${t('km')}</text>`).join('');
  const sweep=`<defs><linearGradient id="sw" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F2B233" stop-opacity="0"/><stop offset="1" stop-color="#F2B233" stop-opacity=".22"/></linearGradient></defs><path class="sweep" d="M${cx} ${cy} L${cx} ${cy-Rr} A${Rr} ${Rr} 0 0 1 ${(cx+Rr*Math.sin(70*R2D)).toFixed(1)} ${(cy-Rr*Math.cos(70*R2D)).toFixed(1)} Z" fill="url(#sw)"/>`;
  const dots=items.slice(0,40).map(e=>{const r=rOf(e.dist),θ=bearing(state.origin,e),x=cx+r*Math.sin(θ),y=cy-r*Math.cos(θ);const col=e.eff==='now'?'var(--ok)':e.eff==='evening'?'#F2B233':'#6E6E68';
    return `<g class="dot ${e.eff==='off'?'off':''} ${e.mine?'mine':''}" data-open="${e.id}" role="button" tabindex="0" aria-label="${esc(e.name)}, ${fmtKm(e.dist)}"><circle class="halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" style="fill:${col}"/><circle class="core" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${col}"/><text x="${x.toFixed(1)}" y="${(y+3).toFixed(1)}" text-anchor="middle" ${e.eff==='evening'?'style="fill:#171717"':''}>${esc(initials(e.name))}</text></g>`}).join('');
  $('#radar').innerHTML=`${sweep}${rings}<circle cx="${cx}" cy="${cy}" r="${Rr}" class="ring"/><text class="lbl" x="${cx}" y="12" text-anchor="middle">${t('north')}</text>${dots}<circle cx="${cx}" cy="${cy}" r="5" fill="#F2B233"/><circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="#F2B233" stroke-opacity=".5"/>`;
}
function cardHTML(e){
  return `<article class="card el ${e.eff==='off'?'off':''}" data-card="${e.id}">
    ${avatar(e)}
    <div>
      <div class="el-head"><div class="name">${esc(e.name)}${e.mine?`<span class="you">${t('you')}</span>`:''}${vbadge(e)}</div>${statusPill(e)}</div>
      <div class="meta">${rating(e)}<span>${ic('pin','pin')} <b>${fmtKm(e.dist)}</b> · ${esc(e.zone)}</span></div>
      <div class="skills">${e.skills.map(s=>esc(skill(s))).join(' · ')}</div>
      <div class="actions">${callBtn(e,'primary')}${waBtn(e,'')}<button type="button" class="btn" style="flex:0 0 auto;padding-inline:12px" data-open="${e.id}" aria-label="${t('view')}">${ic('chev','arrow')}</button></div>
    </div>
  </article>`;
}
function callBtn(e,cls){return e.demo?`<button type="button" class="btn ${cls}" data-call="${e.id}" data-demo="1">${ic('phone')}${t('call')}</button>`:`<a class="btn ${cls}" href="tel:+216${digits(e.phone)}" data-call="${e.id}">${ic('phone')}${t('call')}</a>`}
function waBtn(e,cls){return e.demo?`<button type="button" class="btn ${cls}" data-wa="${e.id}" data-demo="1">${ic('chat')}${t('wa')}</button>`:`<a class="btn ${cls}" href="${waLink(e)}" target="_blank" rel="noopener" data-wa="${e.id}">${ic('chat')}${t('wa')}</a>`}

function renderPrompt(){
  const box=$('#prompt'), m=me(); box.innerHTML='';
  const dismissed=LS.get(K.dismiss,{}), now=Date.now();
  const call=state.myCalls.find(c=>now-c.createdAt>3600000&&now-c.createdAt<7*86400000&&!dismissed[c.electricianId]);
  if(!call)return;
  const e=view().find(x=>x.id===call.electricianId); if(!e||e.mine)return;
  box.innerHTML=`<div class="banner">${avatar(e,'',false)}<div><h3>${t('rp.q',{name:esc(firstName(e.name))})}</h3><p>${t('rp.p',{when:fmtWhen(call.createdAt)})}</p><div class="row"><button type="button" class="btn primary" data-open="${e.id}">${ic('star','fill')}${t('rp.cta')}</button><button type="button" class="btn ghost" data-dismiss="${e.id}">${t('rp.later')}</button></div></div></div>`;
}

/* ---------- map (Leaflet, loaded on demand) ---------- */
let leafletP=null;
function loadLeaflet(){
  if(window.L&&window.L.map)return Promise.resolve();
  if(leafletP)return leafletP;
  leafletP=new Promise((res,rej)=>{
    const css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(css);
    const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
  return leafletP;
}
const tiles=map=>window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
let bigMap=null;
async function openMap(){
  const d=$('#mapdlg');$('#maptitle').textContent=t('map.h',{place:originLabel()});d.showModal();
  try{await loadLeaflet()}catch(e){toast(t('err.generic'));return}
  const Lf=window.L;
  if(bigMap){bigMap.remove();bigMap=null}
  bigMap=Lf.map('mapfull',{zoomControl:false}).setView([state.origin.lat,state.origin.lng],12);tiles(bigMap);
  Lf.marker([state.origin.lat,state.origin.lng],{icon:Lf.divIcon({className:'',html:'<div class="pinme"></div>',iconSize:[34,34],iconAnchor:[17,34]})}).addTo(bigMap);
  const {items}=filtered();
  items.forEach(e=>{const mk=Lf.marker([e.lat,e.lng],{icon:Lf.divIcon({className:'',html:`<div class="pinel ${e.eff==='evening'?'ev':e.eff==='off'?'off':''}">${esc(initials(e.name))}</div>`,iconSize:[30,30],iconAnchor:[15,15]})}).addTo(bigMap);
    mk.bindPopup(`<b>${esc(e.name)}</b><br><span style="font-size:12px">${fmtKm(e.dist)} · ${esc(e.zone)}</span><br><button type="button" class="btn primary" style="margin-top:8px;min-height:34px;padding:6px 10px;font-size:13px" data-open="${e.id}">${t('view')}</button>`);});
  setTimeout(()=>bigMap.invalidateSize(),50);
}

/* ---------- profile sheet ---------- */
async function openProfile(id){
  const e=view().find(x=>x.id===id); if(!e)return;
  const d=$('#profile'), m=me(), real=m&&!m.anonymous;
  const called=state.myCalls.some(c=>c.electricianId===id);
  d.innerHTML=`<div class="grab"></div>
  <div class="sheet-head"><span class="eyebrow">${t('p.eyebrow')}</span><button class="close" type="button" data-close="profile" aria-label="${t('close')}">${ic('x')}</button></div>
  <div class="sheet-body">
    <div class="phead">${avatar(e,'lg')}<div><h2>${esc(e.name)}${e.mine?`<span class="you">${t('you')}</span>`:''}</h2>
      <div style="margin-top:6px">${statusPill(e)}${e.eff!=='off'&&e.until?`<span class="small muted" style="margin-inline-start:8px">${t('until',{time:fmtTime(e.until)})}</span>`:''}</div>
      <div class="meta">${e.count?`<span>${ic('star','fill')} <b>${dec(e.rating)}</b> <span class="muted">${t('p.reviews.n',{n:e.count})}</span></span>`:`<span class="muted">${t('p.noreviews')}</span>`}<span>${ic('pin','pin')} <b>${fmtKm(e.dist)}</b> · ${esc(e.zone)}</span></div>
    </div></div>
    ${e.approved?`<div class="vline">${ic('shield')}<span>${t('badge.approved')} · <span class="muted" style="font-weight:600">${t('badge.approved.sub')}</span></span></div>`:''}
    <p class="lead">${esc(e.desc)||`<span class="muted">${t('p.nodesc')}</span>`}</p>
    ${e.workPhotos&&e.workPhotos.length?`<div><p class="eyebrow" style="margin-bottom:8px">${t('p.photos')}</p><div class="photostrip">${e.workPhotos.map(u=>`<img src="${esc(u)}" alt="" loading="lazy">`).join('')}</div></div>`:''}
    <div><p class="eyebrow" style="margin-bottom:8px">${t('p.skills')}</p><div class="chips wrap">${e.skills.map(s=>`<span class="chip">${esc(skill(s))}</span>`).join('')}</div></div>
    <div class="kv"><span>${ic('target')} ${t('p.radius',{r:e.radiusKm||20})}</span></div>
    <div class="kv"><span class="eyebrow">${t('p.phone')}</span><b>${e.demo?'<span class="ltr">5• ••• •••</span>':tel(digits(e.phone))}</b></div>${e.demo?`<p class="small muted" style="margin-top:-8px">${t('p.masked')}</p>`:''}
    <div id="revlist"><p class="eyebrow" style="margin-bottom:8px">${t('p.reviews',{n:e.count})}</p><p class="small muted">${t('loading')}</p></div>
    <div id="revbox"></div>
  </div>
  <div class="sheet-foot">${callBtn(e,'primary lg')}${waBtn(e,'lg')}</div>`;
  if(!d.open)d.showModal();d.querySelector('.sheet-body').scrollTop=0;
  // reviews
  let reviews=[];try{reviews=await Store.listReviews(id)}catch(x){console.warn(x)}
  const rl=d.querySelector('#revlist');if(!rl)return;
  rl.innerHTML=`<p class="eyebrow" style="margin-bottom:8px">${t('p.reviews',{n:reviews.length})}</p>${reviews.length?reviews.map(r=>`<div class="review"><div class="who"><span style="color:var(--ink)">${esc(L(r.who))}</span><span>${r.date?esc(L(r.date)):fmtWhen(r.createdAt)}</span></div>${starRow(r.stars)}<p>${esc(L(r.text))}</p></div>`).join(''):`<p class="small muted">${t('p.first')}</p>`}`;
  const mineRev=real?reviews.find(r=>r.authorId===m.id):null;
  const rb=d.querySelector('#revbox');
  if(e.mine)rb.innerHTML='';
  else if(!real)rb.innerHTML=`<div class="card" style="padding:14px"><h3>${t('p.leave')}</h3><p class="small muted" style="margin:4px 0 10px">${t('p.needacc',{name:esc(firstName(e.name))})}</p><button type="button" class="btn dark block" data-auth="signup:client">${t('p.createclient')}</button></div>`;
  else if(!called)rb.innerHTML=`<div class="card" style="padding:14px"><h3>${t('p.leave')}</h3><p class="small muted" style="margin:4px 0 0">${t('p.needcall',{name:esc(firstName(e.name))})}</p></div>`;
  else{
    rb.innerHTML=`<div class="card" style="padding:14px"><h3>${t('p.leave')}</h3><p class="small muted" style="margin:4px 0 10px">${mineRev?t('p.already'):t('p.leave.sub',{name:esc(firstName(e.name))})}</p>
      <div class="starpick" role="radiogroup">${[1,2,3,4,5].map(i=>`<button type="button" data-star="${i}" class="${mineRev&&i<=mineRev.stars?'on':''}" aria-label="${t('p.stars',{n:i})}">${ic('star','fill')}</button>`).join('')}</div>
      <div class="field" style="margin-top:10px"><textarea id="revtext" placeholder="${t('p.revph')}" rows="2">${mineRev?esc(mineRev.text):''}</textarea></div>
      <button type="button" class="btn dark block" id="revsend" style="margin-top:10px" ${mineRev?'':'disabled'}>${t('p.publish')}</button></div>`;
    let stars=mineRev?mineRev.stars:0;
    rb.querySelectorAll('[data-star]').forEach(b=>b.addEventListener('click',()=>{stars=+b.dataset.star;rb.querySelectorAll('[data-star]').forEach(x=>x.classList.toggle('on',+x.dataset.star<=stars));rb.querySelector('#revsend').disabled=false}));
    rb.querySelector('#revsend').addEventListener('click',async ev=>{
      const btn=ev.currentTarget;busy(btn,true);
      try{await Store.addReview(id,stars,rb.querySelector('#revtext').value.trim()||t('p.default'));const dm=LS.get(K.dismiss,{});dm[id]=Date.now();LS.set(K.dismiss,dm);toast(t('p.thanks'));await refresh();openProfile(id)}
      catch(x){console.error(x);busy(btn,false);toast(t('err.generic'))}
    });
  }
}

/* ---------- pro: activité ---------- */
async function renderActivite(){
  const v=$('#activite'), acc=me(); if(!acc||acc.anonymous)return;
  const mp=state.myEl;
  if(mp&&!state.editing){
    const all=view(), mine=all.find(e=>e.mine)||{...mp,name:mp.name,eff:Store.effective(mp),dist:0,zone:L(cityOf(mp.zoneId).name),hueKey:acc.phone};
    const eff=mine.eff, expired=mp.mode!=='off'&&(!mp.until||mp.until<Date.now());
    const rank=all.filter(e=>e.eff==='now').sort((a,b)=>a.dist-b.dist).findIndex(e=>e.mine)+1;
    const monthStart=new Date();monthStart.setDate(1);monthStart.setHours(0,0,0,0);
    const ok=mp.status==='approved';
    const statusCard=ok?`<div class="card" style="border-color:color-mix(in srgb,var(--ev) 50%,transparent)"><div class="vline" style="margin-bottom:4px">${ic('shield')}<span>${t('act.approved.h')}</span></div><p class="lead small">${t('act.approved.p')}</p></div>`
      :`<div class="pendingcard ${mp.status==='refused'?'bad':''}"><div class="vline">${ic(mp.status==='refused'?'alert':'clock')}<span>${t(mp.status==='refused'?'act.refused.h':'act.pending.h')}</span></div><p>${t(mp.status==='refused'?'act.refused.p':'act.pending.p')}</p><a class="btn dark" href="tel:${STORE_INFO.telE164}">${ic('phone')}${t('act.pending.call')} · <span class="ltr">${STORE_INFO.tel}</span></a></div>`;
    if(!ok){
      v.innerHTML=`${statusCard}
      <div><p class="eyebrow" style="margin-bottom:8px">${t('act.preview')}</p><div class="list">${cardHTML(mine)}</div></div>
      <div style="display:flex;gap:8px"><button type="button" class="btn" id="editbtn">${ic('edit')}${t('act.edit')}</button><button type="button" class="btn ghost danger" id="delbtn">${t('act.delete')}</button></div>
      ${Store.mode==='demo'?`<div class="note">${ic('info')}<span>${t('act.note')}</span></div>`:''}`;
      $('#editbtn').addEventListener('click',()=>{state.editing=true;renderActivite();window.scrollTo({top:0})});
      $('#delbtn').addEventListener('click',async()=>{if(confirm(t('act.confirmdel'))){await Store.deleteMyElectrician();await refresh();renderTabs()}});
      return;
    }
    v.innerHTML=`
      ${expired?`<div class="nudge"><h2>${t('act.expired.h')}</h2><p>${t('act.expired.p')}</p><div class="row"><button type="button" class="btn primary" data-setmode="now">${t('act.expired.yes')}</button><button type="button" class="btn onDark" data-setmode="off">${t('act.expired.no')}</button></div></div>`:''}
      <div class="statuscard ${eff==='now'?'on':''}" style="${eff==='evening'?'background-color:var(--ev)':''}">
        <div class="row"><div class="big"><span class="dot"></span>${eff==='now'?t('status.ok'):eff==='evening'?t('status.evening'):t('status.off')}</div>${eff!=='off'?`<span style="font-weight:800;opacity:.9">${ic('clock')} ${t('until',{time:fmtTime(mp.until)})}</span>`:''}</div>
      </div>
      <div class="modes">
        <button type="button" class="modebtn now" data-setmode="now" aria-pressed="${mp.mode==='now'&&!expired}"><span class="dot"></span><span><b>${t('act.mode.now')}</b><span>${t('act.mode.now.sub')}</span></span>${ic('check')}</button>
        <button type="button" class="modebtn ev" data-setmode="evening" aria-pressed="${mp.mode==='evening'&&!expired}"><span class="dot"></span><span><b>${t('act.mode.evening')}</b><span>${t('act.mode.evening.sub')}</span></span>${ic('check')}</button>
        <button type="button" class="modebtn off" data-setmode="off" aria-pressed="${mp.mode==='off'||expired}"><span class="dot"></span><span><b>${t('act.mode.off')}</b><span>${t('act.mode.off.sub')}</span></span>${ic('check')}</button>
      </div>
      <div class="stats"><div class="stat"><b id="st-calls">…</b><span>${t('act.calls.month')}</span></div><div class="stat"><b>${mine.count||0}</b><span>${t('act.reviews')}</span></div><div class="stat"><b>${eff==='now'&&rank?(lang==='fr'?`${rank}<sup style="font-size:12px">${rank===1?'er':'e'}</sup>`:rank):'—'}</b><span>${t('act.rank',{place:esc(originLabel())})}</span></div></div>
      <button type="button" class="ctacard" data-devisnew="pro">${ic('doc')}<span><b>${t('d.cta.pro')}</b><span>${t('d.cta.pro.sub')}</span></span>${ic('chev','arrow')}</button>
      ${state.myDevis.length?`<div><p class="eyebrow" style="margin-bottom:8px">${t('d.mine')}</p><div class="card"><div class="rows">${state.myDevis.slice(0,5).map(devisRowHTML).join('')}</div></div></div>`:''}
      ${statusCard}
      <div><p class="eyebrow" style="margin-bottom:8px">${t('act.preview')}</p><div class="list">${cardHTML(mine)}</div></div>
      <div style="display:flex;gap:8px"><button type="button" class="btn" id="editbtn">${ic('edit')}${t('act.edit')}</button><button type="button" class="btn ghost danger" id="delbtn">${t('act.delete')}</button></div>
      ${Store.mode==='demo'?`<div class="note">${ic('info')}<span>${t('act.note')}</span></div>`:''}`;
    Store.myCallsReceived(monthStart.getTime()).then(n=>{const el=$('#st-calls');if(el)el.textContent=n}).catch(()=>{});
    $('#editbtn').addEventListener('click',()=>{state.editing=true;renderActivite();window.scrollTo({top:0})});
    $('#delbtn').addEventListener('click',async()=>{if(confirm(t('act.confirmdel'))){await Store.deleteMyElectrician();await refresh();renderTabs()}});
    return;
  }
  renderFicheForm(acc,mp);
}
async function setMode(mode){
  try{state.myEl=await Store.setAvailability(mode);await refresh();renderTabs();toast(t(mode==='now'?'act.toast.now':mode==='evening'?'act.toast.evening':'act.toast.off'))}
  catch(e){console.error(e);toast(t(e&&e.message==='notapproved'?'act.notapproved':'err.generic'))}
}
let formMap=null,formMarker=null;
function renderFicheForm(acc,mp){
  const v=$('#activite');
  const m=mp||{name:acc.name,zoneId:'nabeul',lat:cityOf('nabeul').lat,lng:cityOf('nabeul').lng,radiusKm:20,skills:[],desc:'',photo:'',workPhotos:[]};
  state.pending={avatar:null,work:[],avatarUrl:m.photo||'',workUrls:[...(m.workPhotos||[])]};
  v.innerHTML=`
    ${state.editing?'':`<div><h1>${t('f.welcome',{name:esc(firstName(acc.name))})}</h1><p class="lead">${t('f.welcome.sub')}</p></div>`}
    <form class="form card" id="proform" novalidate>
      <h2>${state.editing?t('act.edit'):t('f.title')}</h2>
      <div class="photo-row"><div class="avatar lg" id="photoprev" style="--h:${hue(acc.phone)}">${m.photo?`<img src="${esc(m.photo)}" alt="">`:(m.name?esc(initials(m.name)):ic('cam'))}</div><label class="btn" for="f-photo" tabindex="0">${ic('cam')}${t('f.photo')}</label><input type="file" id="f-photo" accept="image/*"></div>
      <div class="field" id="fw-name"><label for="f-name">${t('f.name')}</label><input id="f-name" value="${esc(m.name)}" placeholder="${t('a.name.ph.pro')}" autocomplete="name"><span class="err">${t('f.name.err')}</span></div>
      <div class="kv"><span>${ic('phone')} ${t('f.callat')}</span><b>${tel(acc.phone)}</b></div>
      <div class="field"><label for="f-zone">${t('f.zone')}</label><select id="f-zone">${CITIES.map(c=>`<option value="${c.id}" ${c.id===m.zoneId?'selected':''}>${esc(L(c.name))}</option>`).join('')}</select></div>
      <div class="field"><label>${t('f.map')} <em>· ${t('f.map.sub')}</em></label><div class="mapbox" id="formmap"></div><button type="button" class="btn" id="f-geo" style="margin-top:6px">${ic('target')}${t('loc.use')}</button></div>
      <div class="field"><label for="f-radius">${t('f.radius')}</label><select id="f-radius">${[10,20,40].map(r=>`<option value="${r}" ${r===(m.radiusKm||20)?'selected':''}>${r} ${t('km')}</option>`).join('')}</select></div>
      <div class="field" id="fw-skills"><label>${t('f.skills')}</label><div class="chips wrap" id="fskills">${SKILLS.map(s=>`<button type="button" class="chip sel" data-fs="${esc(s)}" aria-pressed="${m.skills.includes(s)}">${esc(skill(s))}</button>`).join('')}</div><span class="err">${t('f.skills.err')}</span></div>
      <div class="field"><label for="f-desc">${t('f.desc')} <em>${t('f.optional')}</em></label><textarea id="f-desc" placeholder="${t('f.desc.ph')}">${esc(m.desc)}</textarea></div>
      <div class="field"><label>${t('f.work')} <em>· ${t('f.work.sub')}</em></label><div class="thumbs" id="thumbs"></div><input type="file" id="f-work" accept="image/*" multiple hidden></div>
      <div style="display:flex;gap:8px"><button type="submit" class="btn primary lg" id="f-submit">${ic('check')}${state.editing?t('f.save'):t('f.publish')}</button>${state.editing?`<button type="button" class="btn lg" id="cancel">${t('f.cancel')}</button>`:''}</div>
    </form>`;
  const pos={lat:m.lat,lng:m.lng};
  const renderThumbs=()=>{const all=[...state.pending.workUrls.map(u=>({u})),...state.pending.work.map(b=>({u:URL.createObjectURL(b),blob:b}))];$('#thumbs').innerHTML=all.map((x,i)=>`<div class="thumb"><img src="${esc(x.u)}" alt=""><button type="button" data-rmwork="${i}" aria-label="${t('close')}">${ic('x')}</button></div>`).join('')+(all.length<5?`<label class="thumb add" for="f-work">${ic('plus')}${t('f.work.add')}</label>`:'')};
  renderThumbs();
  $('#f-photo').addEventListener('change',async ev=>{const f=ev.target.files[0];if(!f)return;try{state.pending.avatar=await squareImage(f,256);$('#photoprev').innerHTML=`<img src="${URL.createObjectURL(state.pending.avatar)}" alt="">`}catch(e){toast(t('err.generic'))}});
  $('#f-work').addEventListener('change',async ev=>{for(const f of [...ev.target.files]){if(state.pending.workUrls.length+state.pending.work.length>=5)break;try{state.pending.work.push(await resizeImage(f,1000))}catch(e){}}ev.target.value='';renderThumbs()});
  $('#thumbs').addEventListener('click',e=>{const b=e.target.closest('[data-rmwork]');if(!b)return;const i=+b.dataset.rmwork,n=state.pending.workUrls.length;if(i<n)state.pending.workUrls.splice(i,1);else state.pending.work.splice(i-n,1);renderThumbs()});
  $('#f-name').addEventListener('input',e=>{if(!state.pending.avatar&&!m.photo)$('#photoprev').innerHTML=e.target.value?esc(initials(e.target.value)):ic('cam')});
  $('#fskills').addEventListener('click',e=>{const b=e.target.closest('[data-fs]');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')});
  $('#cancel')?.addEventListener('click',()=>{state.editing=false;renderActivite()});
  $('#f-zone').addEventListener('change',e=>{const c=cityOf(e.target.value);pos.lat=c.lat;pos.lng=c.lng;if(formMap){formMap.setView([c.lat,c.lng],13);formMarker.setLatLng([c.lat,c.lng])}});
  $('#f-geo').addEventListener('click',()=>{if(!navigator.geolocation){toast(t('loc.unavail'));return}navigator.geolocation.getCurrentPosition(p=>{pos.lat=p.coords.latitude;pos.lng=p.coords.longitude;if(formMap){formMap.setView([pos.lat,pos.lng],14);formMarker.setLatLng([pos.lat,pos.lng])}toast(t('loc.done'))},()=>toast(t('loc.denied')),{timeout:8000})});
  loadLeaflet().then(()=>{const Lf=window.L;if(formMap){formMap.remove()}const el=$('#formmap');if(!el)return;formMap=Lf.map('formmap',{zoomControl:false,attributionControl:false}).setView([pos.lat,pos.lng],13);tiles(formMap);
    formMarker=Lf.marker([pos.lat,pos.lng],{draggable:true,icon:Lf.divIcon({className:'',html:'<div class="pinme"></div>',iconSize:[34,34],iconAnchor:[17,34]})}).addTo(formMap);
    formMarker.on('dragend',()=>{const p=formMarker.getLatLng();pos.lat=p.lat;pos.lng=p.lng});formMap.on('click',e=>{formMarker.setLatLng(e.latlng);pos.lat=e.latlng.lat;pos.lng=e.latlng.lng});
    setTimeout(()=>formMap.invalidateSize(),50)}).catch(()=>{});
  $('#proform').addEventListener('submit',async e=>{
    e.preventDefault();
    const name=$('#f-name').value.trim(),skills=[...document.querySelectorAll('#fskills [aria-pressed="true"]')].map(b=>b.dataset.fs);
    let ok=true;$('#fw-name').classList.toggle('invalid',!name);ok&&=!!name;$('#fw-skills').classList.toggle('invalid',!skills.length);ok&&=!!skills.length;
    if(!ok){toast(t('f.fix'));return}
    const btn=$('#f-submit');busy(btn,true);
    try{
      let photo=state.pending.avatarUrl;if(state.pending.avatar)photo=await Store.uploadPhoto(state.pending.avatar,'avatar');
      const work=[...state.pending.workUrls];for(const b of state.pending.work)work.push(await Store.uploadPhoto(b,'work'));
      const rec={name,zoneId:$('#f-zone').value,lat:pos.lat,lng:pos.lng,radiusKm:+$('#f-radius').value,skills,desc:$('#f-desc').value.trim(),photo,workPhotos:work,mode:mp?mp.mode:'off',since:mp?mp.since:0,until:mp?mp.until:0};
      if(acc.name!==name)await Store.updateProfile({name});
      state.myEl=await Store.saveMyElectrician(rec);
      if(!mp&&state.myEl.status==='approved')state.myEl=await Store.setAvailability('now');
      state.editing=false;await refresh();renderTabs();renderHeader();
      toast(t(mp?'f.updated':state.myEl.status==='approved'?'f.published':'f.sent'));window.scrollTo({top:0});
    }catch(x){console.error(x);busy(btn,false);toast(t('err.generic'))}
  });
}

/* ---------- store ---------- */
const devisCtaHTML=()=>`<button type="button" class="ctacard" data-devisnew="client">${ic('doc')}<span><b>${t('d.cta')}</b><span>${t('d.cta.sub')}</span></span>${ic('chev','arrow')}</button>`;
const dStatusCls={received:'',quoted:'ev',confirmed:'ev',ready:'ok',delivered:'ok',cancelled:'off'};
const dStatusPill=d=>`<span class="status ${dStatusCls[d.status]}"><span class="dot"></span>${t('d.status.'+d.status)}</span>`;
function devisRowHTML(d){
  const m=me(), mineAsPro=isPro()&&d.electricianId===m.id&&d.createdBy!==m.id;
  const who=mineAsPro?t('d.for',{name:esc(d.clientName||fmtTel(d.clientPhone))}):d.electricianId?t('d.by',{name:esc(elecName(d.electricianId))}):t('d.by.unknown');
  return `<button type="button" data-devis="${d.id}">${ic('doc')}<span><span style="display:block">${who}</span><span class="small muted" style="font-weight:600">${fmtDate(d.createdAt)} · ${t('d.photos.n',{n:d.photos.length})}</span></span><span style="margin-inline-start:auto">${dStatusPill(d)}</span></button>`;
}
function elecName(id){const e=state.electricians.find(x=>x.id===id)||state.adminElecs.find(x=>x.id===id);return e?L(e.name):'—'}
function renderStore(){
  renderPromo('#s-promo');
  $('#s-devis').innerHTML=`${isPro()?`<button type="button" class="ctacard" data-devisnew="pro">${ic('doc')}<span><b>${t('d.cta.pro')}</b><span>${t('d.cta.pro.sub')}</span></span>${ic('chev','arrow')}</button>`:devisCtaHTML()}
    ${state.myDevis.length?`<div><p class="eyebrow" style="margin:14px 0 8px">${t('d.mine')}</p><div class="card"><div class="rows">${state.myDevis.map(devisRowHTML).join('')}</div></div></div>`:''}`;
  $('#storerows').innerHTML=`
    <a href="${STORE_INFO.maps}" target="_blank" rel="noopener">${ic('pin')}<span>${t('s.addr')}</span>${ic('chev','arrow')}</a>
    <a href="tel:${STORE_INFO.telE164}">${ic('phone')}<span class="ltr">${STORE_INFO.tel}</span>${ic('chev','arrow')}</a>
    <a href="mailto:${STORE_INFO.mail}">${ic('mail')}<span class="ltr">${STORE_INFO.mail}</span>${ic('chev','arrow')}</a>
    <a href="https://${STORE_INFO.site}" target="_blank" rel="noopener">${ic('globe')}<span class="ltr">${STORE_INFO.site}</span>${ic('chev','arrow')}</a>
    <a href="${STORE_INFO.fb}" target="_blank" rel="noopener">${ic('globe')}<span class="ltr">Facebook · Log-ON</span>${ic('chev','arrow')}</a>
    <a href="${STORE_INFO.ig}" target="_blank" rel="noopener">${ic('globe')}<span class="ltr">Instagram · @logontn</span>${ic('chev','arrow')}</a>`;
  $('#soon').innerHTML=[['bulb',3],['tag',4]].map(([i,n])=>`<div>${ic(i)}<span><b>${t(`s.${n}.h`)}</b> — ${t(`s.${n}.p`)}</span></div>`).join('');
}

/* ---------- account ---------- */
const langRow=()=>`<div class="r">${ic('lang')}<span>${t('acc.lang')}</span><span class="langseg"><button type="button" data-lang="fr" aria-pressed="${lang==='fr'}">Français</button><button type="button" data-lang="ar" aria-pressed="${lang==='ar'}">عربي</button></span></div>`;
function renderAccount(){
  const v=$('#account'), m=me(), real=m&&!m.anonymous;
  if(!real){
    v.innerHTML=`<div class="card"><div class="acct-head"><div class="avatar lg" style="--h:#6E6E68">${ic('user')}</div><div><h2>${t('acc.guest.h')}</h2><p class="lead small">${t('acc.guest.p')}</p></div></div></div>
      <div style="display:flex;gap:8px"><button type="button" class="btn primary lg" data-auth="signup:client">${t('acc.create')}</button><button type="button" class="btn lg" data-auth="login:client">${t('login')}</button></div>
      <div class="card"><div class="rows"><button type="button" data-auth="signup:pro">${ic('bolt')}<span>${t('acc.ispro')}</span><span class="sub">${t('acc.ispro.sub')}</span></button>${langRow()}<button type="button" id="quit">${ic('out')}<span>${t('acc.quit')}</span></button></div></div>
      ${Store.mode==='demo'?`<p class="small muted center">${t('acc.mode.demo')}</p>`:''}`;
    $('#quit').addEventListener('click',logout);return;
  }
  const pro=m.role==='pro';
  v.innerHTML=`<div class="card"><div class="acct-head"><div class="avatar lg" style="--h:${hue(m.phone)}">${state.myEl?.photo?`<img src="${esc(state.myEl.photo)}" alt="">`:esc(initials(m.name))}</div><div><h2>${esc(m.name)}</h2><p class="small muted">${tel(m.phone)}</p><span class="pill ${pro?'pro':''}" style="margin-top:6px">${pro?t('acc.pro'):t('acc.client')}</span></div></div></div>
    <div class="card"><div class="rows">
      ${pro?`<button type="button" data-tab="activite">${ic('edit')}<span>${t('acc.fiche')}</span>${ic('chev','arrow')}</button>`:`<button type="button" id="become-pro">${ic('bolt')}<span>${t('acc.become')}</span><span class="sub">${t('acc.become.sub')}</span></button>`}
      ${m.isAdmin?`<button type="button" data-tab="admin">${ic('shield')}<span>${t('acc.admin')}</span>${adminBadge()?`<span class="cnt">${adminBadge()}</span>`:''}${ic('chev','arrow')}</button>`:''}
      ${langRow()}
      <button type="button" id="pinbtn">${ic('key')}<span>${t('acc.pin')}</span>${ic('chev','arrow')}</button>
      <a href="${STORE_INFO.fb}" target="_blank" rel="noopener">${ic('store')}<span>${t('acc.about')}</span>${ic('chev','arrow')}</a>
      <button type="button" id="logout">${ic('out')}<span>${t('acc.logout')}</span></button>
      <button type="button" id="delacc" class="danger">${ic('trash')}<span>${t('acc.delete')}</span></button>
    </div></div>
    <p class="small muted center">${t('acc.created',{date:new Date(m.createdAt||Date.now()).toLocaleDateString(locale())})}${Store.mode==='demo'?' '+t('acc.mode.demo'):''}</p>`;
  $('#logout').addEventListener('click',logout);
  $('#pinbtn').addEventListener('click',()=>{$('#p-pin').value='';$('#pindlg').showModal()});
  $('#delacc').addEventListener('click',async()=>{if(!confirm(t('acc.delete.confirm')))return;try{await Store.deleteAccount();state.myEl=null;state.myCalls=[];toast(t('acc.deleted'));go('welcome')}catch(e){console.error(e);toast(t('err.generic'))}});
  $('#become-pro')?.addEventListener('click',async()=>{await Store.updateProfile({role:'pro'});await refresh();state.tab='activite';renderTabs();setTab('activite');toast(t('acc.became'))});
}
$('#pinform').addEventListener('submit',async e=>{e.preventDefault();const pin=digits($('#p-pin').value);if(pin.length!==6){toast(t('a.pin.err'));return}try{await Store.changePin(pin);$('#pindlg').close();toast(t('acc.pin.done'))}catch(x){console.error(x);toast(t('err.generic'))}});

/* ---------- admin ---------- */
const D_STATUSES=['received','quoted','confirmed','ready','delivered','cancelled'];
async function renderAdmin(){
  const v=$('#admin');
  const nPend=state.adminElecs.filter(e=>e.status==='pending').length, nNew=state.adminDevis.filter(d=>d.status==='received').length;
  v.innerHTML=`<div><h1>${t('ad.title')}</h1><p class="lead">${t('ad.sub')}</p></div>
    <div class="seg" role="group">${[['elec',nPend],['devis',nNew],['promo',0]].map(([k,n])=>`<button type="button" data-adtab="${k}" aria-pressed="${state.adminTab===k}">${t('ad.tab.'+k)}${n?` <span class="cnt">${n}</span>`:''}</button>`).join('')}</div>
    <div id="adbody"><p class="small muted">${t('loading')}</p></div>`;
  try{if(state.adminTab==='elec')state.adminElecs=await Store.adminList();else if(state.adminTab==='devis')state.adminDevis=await Store.adminDevis();else state.promo=await Store.getPromo()}catch(e){console.error(e);toast(t('err.generic'))}
  const box=$('#adbody');if(!box)return;
  if(state.adminTab==='elec')renderAdminElecs(box);else if(state.adminTab==='devis')renderAdminDevis(box);else renderAdminPromo(box);
}
function adminRow(e,actions){const eff=Store.effective(e);return `<div class="adminrow"><div class="avatar" style="--h:${hue(e.phone||e.id)}">${e.photo?`<img src="${esc(e.photo)}" alt="">`:esc(initials(L(e.name)))}<span class="pip ${eff==='now'?'':eff==='evening'?'ev':'off'}"></span></div><div><div class="n">${esc(L(e.name))}</div><div class="s">${tel(digits(e.phone||''))} · ${esc(L(cityOf(e.zoneId).name))} · ${fmtDate(e.createdAt)}${e.status==='approved'?` · ${e.callsCount||0} ${t('ad.calls')} · ${e.reviewsCount||0} ${t('ad.reviews')}`:''}</div><div class="s" style="margin-top:2px">${e.skills.map(x=>esc(skill(x))).join(' · ')}</div></div><div class="adacts">${actions}</div></div>`}
function renderAdminElecs(box){
  const list=state.adminElecs, pend=list.filter(e=>e.status==='pending'), ok=list.filter(e=>e.status==='approved'), no=list.filter(e=>e.status==='refused');
  const call=e=>`<a class="btn" href="tel:+216${digits(e.phone||'')}" aria-label="${t('ad.call')}">${ic('phone')}</a>`;
  box.innerHTML=`
    <p class="eyebrow">${t('ad.pending')} · ${pend.length}</p>
    <div class="card">${pend.length?pend.map(e=>adminRow(e,`${call(e)}<button type="button" class="btn primary" data-setstatus="${e.id}:approved">${ic('check')}${t('ad.approve')}</button><button type="button" class="btn ghost danger" data-setstatus="${e.id}:refused">${t('ad.refuse')}</button>`)).join(''):`<p class="small muted">${t('ad.nopending')}</p>`}</div>
    <p class="eyebrow">${t('ad.approved')} · ${ok.length}</p>
    <div class="card">${ok.length?ok.map(e=>adminRow(e,`${call(e)}<button type="button" class="btn ghost" data-setstatus="${e.id}:pending">${t('ad.suspend')}</button>`)).join(''):`<p class="small muted">${t('ad.none')}</p>`}</div>
    ${no.length?`<p class="eyebrow">${t('ad.refused')} · ${no.length}</p><div class="card">${no.map(e=>adminRow(e,`${call(e)}<button type="button" class="btn" data-setstatus="${e.id}:approved">${t('ad.approve')}</button>`)).join('')}</div>`:''}`;
}
function renderAdminDevis(box){
  const list=state.adminDevis, open=list.filter(d=>!['delivered','cancelled'].includes(d.status)), closed=list.filter(d=>['delivered','cancelled'].includes(d.status));
  const row=d=>`<button type="button" class="adminrow devisrow" data-devis="${d.id}"><div class="avatar" style="--h:${hue(d.clientPhone)}">${ic('doc')}</div><div><div class="n">${esc(d.clientName||fmtTel(d.clientPhone))} <span class="small muted" style="font-weight:600">${tel(d.clientPhone)}</span></div><div class="s">${fmtDate(d.createdAt)} · ${d.electricianId?t('d.by',{name:esc(elecName(d.electricianId))}):t('d.by.unknown')}${d.submittedBy==='pro'?` · ${t('d.sentby.pro')}`:''} · ${d.delivery==='delivery'?t('d.deliver.short',{zone:esc(L(cityOf(d.zoneId||'nabeul').name))}):t('d.pickup.short')}</div></div>${dStatusPill(d)}</button>`;
  box.innerHTML=`<p class="eyebrow">${t('ad.d.open')} · ${open.length}</p><div class="card">${open.length?open.map(row).join(''):`<p class="small muted">${t('ad.d.none')}</p>`}</div>
    ${closed.length?`<p class="eyebrow">${t('ad.d.closed')} · ${closed.length}</p><div class="card">${closed.map(row).join('')}</div>`:''}`;
}
function renderAdminPromo(box){
  const p=state.promo||{active:false,titleFr:'',titleAr:'',textFr:'',textAr:'',image:'',endsOn:''};
  let img=p.image, pendingImg=null;
  box.innerHTML=`<form class="form card" id="promoform" novalidate>
    <div><h2>${t('ad.pr.h')}</h2><p class="lead small">${t('ad.pr.sub')}</p></div>
    <label class="kv" style="cursor:pointer"><span>${t('ad.pr.active')}</span><input type="checkbox" id="pr-active" ${p.active?'checked':''} style="width:22px;height:22px"></label>
    <div class="field" id="fw-prtitle"><label for="pr-tfr">${t('ad.pr.title.fr')}</label><input id="pr-tfr" value="${esc(p.titleFr)}"><span class="err">${t('ad.pr.title.err')}</span></div>
    <div class="field"><label for="pr-tar">${t('ad.pr.title.ar')}</label><input id="pr-tar" dir="rtl" value="${esc(p.titleAr)}"></div>
    <div class="field"><label for="pr-xfr">${t('ad.pr.text.fr')}</label><textarea id="pr-xfr" rows="2">${esc(p.textFr)}</textarea></div>
    <div class="field"><label for="pr-xar">${t('ad.pr.text.ar')}</label><textarea id="pr-xar" dir="rtl" rows="2">${esc(p.textAr)}</textarea></div>
    <div class="field"><label for="pr-ends">${t('ad.pr.ends')} <em>${t('f.optional')}</em></label><input type="date" id="pr-ends" value="${esc(p.endsOn||'')}"></div>
    <div class="field"><label>${t('ad.pr.image')} <em>${t('f.optional')}</em></label><div class="thumbs" id="prthumb"></div><input type="file" id="pr-img" accept="image/*" hidden></div>
    <button type="submit" class="btn primary lg" id="pr-save">${ic('check')}${t('f.save')}</button>
  </form>
  <div><p class="eyebrow" style="margin-bottom:8px">${t('act.preview')}</p><div id="pr-preview"></div></div>`;
  const preview=()=>{const q={active:true,titleFr:$('#pr-tfr').value,titleAr:$('#pr-tar').value,textFr:$('#pr-xfr').value,textAr:$('#pr-xar').value,image:pendingImg?URL.createObjectURL(pendingImg):img,endsOn:$('#pr-ends').value};$('#pr-preview').innerHTML=(q.titleFr||q.titleAr)?promoHTML(q,false):`<p class="small muted">—</p>`};
  const thumbs=()=>{const u=pendingImg?URL.createObjectURL(pendingImg):img;$('#prthumb').innerHTML=u?`<div class="thumb"><img src="${esc(u)}" alt=""><button type="button" id="pr-rm" aria-label="${t('ad.pr.image.rm')}">${ic('x')}</button></div>`:`<label class="thumb add" for="pr-img">${ic('plus')}${t('f.work.add')}</label>`;$('#pr-rm')?.addEventListener('click',()=>{img='';pendingImg=null;thumbs();preview()});preview()};
  thumbs();
  box.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',preview));
  $('#pr-img').addEventListener('change',async ev=>{const f=ev.target.files[0];if(!f)return;try{pendingImg=await resizeImage(f,1200,.8)}catch(e){toast(t('err.generic'))}ev.target.value='';thumbs()});
  $('#promoform').addEventListener('submit',async e=>{
    e.preventDefault();const titleFr=$('#pr-tfr').value.trim();const active=$('#pr-active').checked;
    if(active&&!titleFr&&!$('#pr-tar').value.trim()){$('#fw-prtitle').classList.add('invalid');return}
    const btn=$('#pr-save');busy(btn,true);
    try{if(pendingImg)img=await Store.uploadPromoImage(pendingImg);state.promo=await Store.savePromo({active,titleFr,titleAr:$('#pr-tar').value.trim(),textFr:$('#pr-xfr').value.trim(),textAr:$('#pr-xar').value.trim(),image:img,endsOn:$('#pr-ends').value||''});pendingImg=null;busy(btn,false);toast(t('ad.pr.saved'))}
    catch(x){console.error(x);busy(btn,false);toast(t('err.generic'))}
  });
}

/* ---------- devis: new ---------- */
function openDevisForm(who){
  const d=$('#devisdlg'), m=me(), pro=who==='pro', real=m&&!m.anonymous;
  const pending=[];
  const recent=[...new Map(state.myCalls.map(c=>[c.electricianId,c])).keys()].map(id=>view().find(e=>e.id===id)).filter(Boolean).slice(0,5);
  d.innerHTML=`<div class="grab"></div>
  <div class="sheet-head"><h2>${t('d.form.h')}</h2><button class="close" type="button" data-close="devisdlg" aria-label="${t('close')}">${ic('x')}</button></div>
  <form class="sheet-body form" id="devisform" novalidate>
    <p class="lead small" style="margin-top:-6px">${pro?t('d.form.pro.sub'):t('d.form.sub')}</p>
    <div class="field" id="fw-dphotos"><label>${t('d.photos')} <em>· ${t('d.photos.sub')}</em></label><div class="thumbs" id="dthumbs"></div><input type="file" id="d-photos" accept="image/*" capture="environment" multiple hidden><span class="err">${t('d.photos.err')}</span></div>
    ${pro?'':`<div class="field"><label for="d-elec">${t('d.elec')}</label><select id="d-elec">${recent.map(e=>`<option value="${e.id}">${esc(e.name)} · ${esc(e.zone)}</option>`).join('')}<option value="">${t('d.elec.other')}</option></select></div>`}
    <div class="field" id="fw-dname"><label for="d-name">${pro?t('d.name.pro'):t('d.name')}</label><input id="d-name" value="${pro?'':esc(real?firstName(m.name):'')}" autocomplete="${pro?'off':'given-name'}"><span class="err">${t('a.name.err')}</span></div>
    <div class="field" id="fw-dphone"><label for="d-phone">${pro?t('d.phone.pro'):t('d.phone')}</label><div class="tel-wrap"><span>+216</span><input id="d-phone" inputmode="tel" placeholder="5x xxx xxx" value="${pro?'':esc(real?fmtTel(m.phone):'')}"></div><span class="err">${t('d.phone.err')}</span></div>
    <div class="field"><label for="d-note">${t('d.note')} <em>${t('f.optional')}</em></label><textarea id="d-note" rows="2" placeholder="${t('d.note.ph')}"></textarea></div>
    <div class="field"><label>${t('d.delivery')}</label><div class="modes">
      <button type="button" class="modebtn ok" data-dlv="pickup" aria-pressed="true">${ic('store')}<span><b>${t('d.pickup')}</b><span>${t('d.pickup.sub')}</span></span>${ic('check')}</button>
      <button type="button" class="modebtn ok" data-dlv="delivery" aria-pressed="false">${ic('box')}<span><b>${t('d.deliver')}</b><span>${t('d.deliver.sub')}</span></span>${ic('check')}</button></div></div>
    <div class="field" id="fw-dzone" hidden><label for="d-zone">${t('d.zone')}</label><select id="d-zone">${CITIES.map(c=>`<option value="${c.id}" ${c.id===state.origin.id?'selected':''}>${esc(L(c.name))}</option>`).join('')}</select></div>
    <button type="submit" class="btn primary lg" id="d-send">${ic('check')}${t('d.send')}</button>
  </form>`;
  let delivery='pickup';
  const thumbs=()=>{$('#dthumbs').innerHTML=pending.map((b,i)=>`<div class="thumb"><img src="${URL.createObjectURL(b)}" alt=""><button type="button" data-rmd="${i}" aria-label="${t('close')}">${ic('x')}</button></div>`).join('')+(pending.length<3?`<label class="thumb add" for="d-photos">${ic('cam')}${t('d.photos.add')}</label>`:'')};
  thumbs();
  $('#d-photos').addEventListener('change',async ev=>{for(const f of [...ev.target.files]){if(pending.length>=3)break;try{pending.push(await resizeImage(f,1400,.78))}catch(e){}}ev.target.value='';thumbs()});
  $('#dthumbs').addEventListener('click',e=>{const b=e.target.closest('[data-rmd]');if(!b)return;pending.splice(+b.dataset.rmd,1);thumbs()});
  d.querySelectorAll('[data-dlv]').forEach(b=>b.addEventListener('click',()=>{delivery=b.dataset.dlv;d.querySelectorAll('[data-dlv]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.dlv===delivery));$('#fw-dzone').hidden=delivery!=='delivery'}));
  $('#devisform').addEventListener('submit',async e=>{
    e.preventDefault();
    const name=$('#d-name').value.trim(), phone=digits($('#d-phone').value);
    let ok=true;$('#fw-dphotos').classList.toggle('invalid',!pending.length);ok&&=!!pending.length;$('#fw-dname').classList.toggle('invalid',!name);ok&&=!!name;$('#fw-dphone').classList.toggle('invalid',phone.length!==8);ok&&=phone.length===8;
    if(!ok){toast(t('f.fix'));return}
    const btn=$('#d-send');busy(btn,true);
    try{
      const rec=await Store.createDevis({submittedBy:pro?'pro':'client',electricianId:pro?m.id:($('#d-elec')?.value||null),clientName:name,clientPhone:phone,note:$('#d-note').value.trim(),photoBlobs:pending,delivery,zoneId:delivery==='delivery'?$('#d-zone').value:null});
      d.close();toast(t(pro?'d.sent.pro':'d.sent'));await refresh();openDevis(rec.id);
    }catch(x){console.error(x);busy(btn,false);toast(t('err.generic'))}
  });
  d.showModal();
}

/* ---------- devis: detail ---------- */
async function openDevis(id){
  const m=me(), admin=!!m&&m.isAdmin;
  const d=[...state.myDevis,...state.adminDevis].find(x=>x.id===id); if(!d)return;
  const dlg=$('#devisview'), st=D_STATUSES.indexOf(d.status), steps=D_STATUSES.slice(0,5);
  const mineAsPro=isPro()&&d.electricianId===m.id&&d.createdBy!==m.id;
  const waClient=`https://wa.me/216${digits(d.clientPhone)}?text=${encodeURIComponent(t('ad.d.wa.msg',{name:d.clientName||''}))}`;
  const waStore=`https://wa.me/${STORE_INFO.wa}?text=${encodeURIComponent(t('d.wa.msg',{ref:d.id.slice(0,6).toUpperCase()}))}`;
  dlg.innerHTML=`<div class="grab"></div>
  <div class="sheet-head"><span class="eyebrow">${t('d.aria')} · ${d.id.slice(0,6).toUpperCase()}</span><button class="close" type="button" data-close="devisview" aria-label="${t('close')}">${ic('x')}</button></div>
  <div class="sheet-body">
    <div class="row" style="display:flex;justify-content:space-between;align-items:center;gap:10px"><h2>${admin||mineAsPro?esc(d.clientName||fmtTel(d.clientPhone)):d.electricianId?t('d.by',{name:esc(elecName(d.electricianId))}):t('d.by.unknown')}</h2>${dStatusPill(d)}</div>
    <p class="lead small" style="margin-top:-8px">${fmtDate(d.createdAt)} · ${d.delivery==='delivery'?t('d.deliver.short',{zone:esc(L(cityOf(d.zoneId||'nabeul').name))}):t('d.pickup.short')}${admin&&d.electricianId?` · ${t('d.by',{name:esc(elecName(d.electricianId))})}`:''}${d.submittedBy==='pro'?` · ${t('d.sentby.pro')}`:''}</p>
    ${d.status!=='cancelled'?`<ol class="steps">${steps.map((k,i)=>`<li class="${i<st?'done':i===st?'cur':''}"><i></i><span>${t('d.status.'+k)}</span></li>`).join('')}</ol>`:''}
    <div class="note">${ic('info')}<span>${t('d.status.'+d.status+'.p')}</span></div>
    ${d.adminNote?`<div class="card" style="background:var(--accent-soft);border-color:transparent"><p class="eyebrow" style="margin-bottom:4px">${t('d.lognote')}</p><p>${esc(d.adminNote)}</p></div>`:''}
    <div><p class="eyebrow" style="margin-bottom:8px">${t('d.photos')}</p><div class="photostrip" id="dphotos">${d.photos.map(()=>`<div class="thumb" style="width:132px;height:99px;flex:none"></div>`).join('')}</div></div>
    ${d.note?`<div><p class="eyebrow" style="margin-bottom:4px">${t('d.note')}</p><p>${esc(d.note)}</p></div>`:''}
    ${admin?`<div class="kv"><span class="eyebrow">${t('d.client')}</span><b>${tel(d.clientPhone)}</b></div>
    <div class="form card" id="adform">
      <div class="field"><label for="ad-status">${t('ad.d.status')}</label><select id="ad-status">${D_STATUSES.map(k=>`<option value="${k}" ${k===d.status?'selected':''}>${t('d.status.'+k)}</option>`).join('')}</select></div>
      <div class="field"><label for="ad-note">${t('ad.d.note')}</label><textarea id="ad-note" rows="2" placeholder="${t('ad.d.note.ph')}">${esc(d.adminNote)}</textarea></div>
      <button type="button" class="btn dark" id="ad-save">${ic('check')}${t('ad.d.save')}</button>
    </div>`:''}
  </div>
  <div class="sheet-foot">${admin?`<a class="btn primary lg" href="${waClient}" target="_blank" rel="noopener">${ic('chat')}${t('ad.d.wa')}</a><a class="btn lg" href="tel:+216${digits(d.clientPhone)}">${ic('phone')}${t('ad.call')}</a>`
    :`<a class="btn primary lg" href="${waStore}" target="_blank" rel="noopener">${ic('chat')}${t('d.contact')}</a>${['received','quoted'].includes(d.status)&&d.createdBy===m?.id?`<button type="button" class="btn lg ghost danger" id="d-cancel">${t('d.cancel')}</button>`:''}`}</div>`;
  if(!dlg.open)dlg.showModal();dlg.querySelector('.sheet-body').scrollTop=0;
  $('#d-cancel')?.addEventListener('click',async()=>{if(!confirm(t('d.cancel.confirm')))return;try{await Store.cancelDevis(d.id);toast(t('d.cancelled'));await refresh();openDevis(d.id)}catch(x){console.error(x);toast(t('err.generic'))}});
  $('#ad-save')?.addEventListener('click',async ev=>{const btn=ev.currentTarget;busy(btn,true);try{await Store.setDevisStatus(d.id,$('#ad-status').value,$('#ad-note').value.trim());toast(t('ad.status.changed'));await refresh();openDevis(d.id)}catch(x){console.error(x);busy(btn,false);toast(t('err.generic'))}});
  // photos (signed URLs in live mode)
  const strip=dlg.querySelector('#dphotos');
  d.photos.forEach(async(p,i)=>{try{const u=await Store.devisPhotoUrl(p);const slot=strip.children[i];if(slot)slot.innerHTML=`<a href="${esc(u)}" target="_blank" rel="noopener"><img src="${esc(u)}" alt="" style="width:100%;height:100%;object-fit:cover"></a>`}catch(e){console.warn(e)}});
}

/* ---------- location ---------- */
function setOrigin(o){state.origin=o;LS.set(K.loc,o);if(state.screen==='main')setTab(state.tab,true);renderCities()}
function renderCities(){$('#citylist').innerHTML=CITIES.map(c=>`<button type="button" data-city="${c.id}" class="${state.origin.id===c.id?'on':''}">${ic(state.origin.id===c.id?'check':'pin')}${esc(L(c.name))}</button>`).join('')}
$('#locbtn').addEventListener('click',()=>{renderCities();$('#locdlg').showModal()});
$('#citylist').addEventListener('click',e=>{const b=e.target.closest('[data-city]');if(!b)return;const c=cityOf(b.dataset.city);setOrigin({id:c.id,lat:c.lat,lng:c.lng});$('#locdlg').close()});
$('#geobtn').addEventListener('click',()=>{
  if(!navigator.geolocation){toast(t('loc.unavail'));return}
  const b=$('#geobtn');b.disabled=true;b.textContent=t('loc.searching');
  const reset=()=>{b.disabled=false;b.innerHTML=`${ic('target')}<span>${t('loc.use')}</span>`};
  navigator.geolocation.getCurrentPosition(p=>{reset();setOrigin({id:'gps',lat:p.coords.latitude,lng:p.coords.longitude});$('#locdlg').close();toast(t('loc.done'))},()=>{reset();toast(t('loc.denied'))},{timeout:8000,maximumAge:60000});
});

/* ---------- global events ---------- */
document.addEventListener('click',e=>{
  const x=e.target.closest('button,a,[data-open]');
  if(!x){const c=e.target.closest('[data-card]');if(c)openProfile(c.dataset.card);return}
  if(x.dataset.langtoggle!==undefined){setLang(lang==='fr'?'ar':'fr');return}
  if(x.dataset.lang){if(x.dataset.lang!==lang)setLang(x.dataset.lang);return}
  if(x.dataset.guest!==undefined){enterGuest();return}
  if(x.dataset.auth){const [mode,role]=x.dataset.auth.split(':');$('#profile').open&&$('#profile').close();startAuth(mode,role);return}
  if(x.id==='auth-back'){const a=state.auth;if(a&&a.step!=='phone'){a.step=a.step==='pin'&&a.mode==='signup'?'name':'phone';renderAuth()}else go(me()?'main':'welcome');return}
  if(x.id==='acctbtn'){setTab('account');return}
  if(x.id==='mapbtn'){openMap();return}
  if(x.dataset.tab){$('#profile').open&&$('#profile').close();setTab(x.dataset.tab);return}
  if(x.dataset.mode){state.mode=x.dataset.mode;if(x.dataset.mode!=='now')state.urgent=false;renderSkillChips();renderList();return}
  if(x.dataset.urgent!==undefined){state.urgent=!state.urgent;state.skill=state.urgent?'Dépannage':'Tous';if(state.urgent)state.mode='now';renderSkillChips();renderList();return}
  if(x.dataset.skill){state.skill=x.dataset.skill;state.urgent=false;renderSkillChips();renderList();return}
  if(x.dataset.setmode){setMode(x.dataset.setmode);return}
  if(x.dataset.setstatus){const [id,st]=x.dataset.setstatus.split(':');busy(x,true);Store.setStatus(id,st).then(()=>refresh()).then(()=>toast(t('ad.status.changed'))).catch(err=>{console.error(err);busy(x,false);toast(t('err.generic'))});return}
  if(x.dataset.adtab){state.adminTab=x.dataset.adtab;renderAdmin();return}
  if(x.dataset.devisnew!==undefined){$('#profile').open&&$('#profile').close();openDevisForm(x.dataset.devisnew);return}
  if(x.dataset.devis){openDevis(x.dataset.devis);return}
  if(x.dataset.dismiss){const dm=LS.get(K.dismiss,{});dm[x.dataset.dismiss]=Date.now();LS.set(K.dismiss,dm);renderPrompt();return}
  if(x.dataset.open){if($('#mapdlg').open)$('#mapdlg').close();openProfile(x.dataset.open);return}
  if(x.dataset.close){$('#'+x.dataset.close).close();return}
  if(x.dataset.call){const id=x.dataset.call;Store.recordCall(id,'call').then(()=>Store.myCalls().then(c=>{state.myCalls=c}).catch(()=>{})).catch(()=>{});if(x.dataset.demo){const el=view().find(y=>y.id===id);toast(t('p.democall',{name:firstName(el.name)}))}return}
  if(x.dataset.wa){const id=x.dataset.wa;Store.recordCall(id,'whatsapp').then(()=>Store.myCalls().then(c=>{state.myCalls=c}).catch(()=>{})).catch(()=>{});if(x.dataset.demo)toast(t('p.demowa'));return}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('[data-open][role="button"]'))openProfile(e.target.dataset.open)});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
// keep availability pills honest without a reload
setInterval(()=>{if(state.screen==='main'&&state.loaded){if(state.tab==='clients')renderList();if(state.tab==='activite'&&!state.editing)renderActivite()}},60000);

/* ---------- boot ---------- */
(async function boot(){
  applyStatic();
  await Store.init();
  Store.getPromo().then(p=>{state.promo=p;renderPromo('#w-promo');if(state.screen==='main'&&state.tab==='store')renderPromo('#s-promo')}).catch(()=>{});
  const m=me();
  if(m){state.screen='main';state.tab=isPro()?'activite':'clients';render();await refresh();}
  else{render();refresh();}
  state.unsub=Store.subscribe(()=>refresh());
  if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
})();
})();
