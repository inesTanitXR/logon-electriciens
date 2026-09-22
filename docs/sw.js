/* Log-ON Électriciens — service worker: offline shell, network-first for everything */
const CACHE='logon-shell-v1';
const SHELL=['./','./index.html','./style.css','./app.js','./store.js','./i18n.js','./data.js','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  const sameOrigin=url.origin===location.origin;
  const isFont=url.hostname.endsWith('gstatic.com')||url.hostname.endsWith('googleapis.com');
  const isLib=url.hostname==='unpkg.com'||url.hostname==='cdn.jsdelivr.net';
  if(!(sameOrigin||isFont||isLib))return;
  e.respondWith(fetch(req).then(res=>{if(res&&res.ok&&(sameOrigin||isFont||isLib)){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||(req.mode==='navigate'?caches.match('./index.html'):undefined))));
});
