/* Dota Assistant v1.06 — Supabase authentication and cloud builds */
(() => {
  const SUPABASE_URL = 'https://jnhmawezxclyrhzvttvc.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_meuajVSmCCdCpGqeRvWcpQ_vat1Wjz2';
  const LOCAL_KEY = 'dota-assistant-v2';
  let client = null;
  let user = null;
  let originalSave = null;
  let syncing = false;

  function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }
  function loadClient() {
    if (!window.supabase) return null;
    if (!client) client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return client;
  }
  function localBuilds() {
    try { const x = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); return Array.isArray(x.builds) ? x.builds : []; } catch { return []; }
  }
  function writeLocal(builds) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify({ page: (window.state && state.page) || 'home', builds })); } catch {}
  }
  function modal(html) {
    const m = document.querySelector('#modal');
    if (!m) return;
    m.innerHTML = `<div class="auth-backdrop"><div class="auth-card">${html}</div></div>`;
    m.classList.add('auth-open');
  }
  function closeModal() { const m=document.querySelector('#modal'); if(m){m.innerHTML='';m.classList.remove('auth-open');} }
  function showLogin(error='') {
    modal(`<div class="auth-head"><div><div class="auth-kicker">DOTA ASSISTANT</div><h2>Вход</h2></div><button class="auth-close" data-auth="close">×</button></div>
      <label>Email<input id="authEmail" type="email" autocomplete="email" placeholder="you@example.com"></label>
      <label>Пароль<input id="authPassword" type="password" autocomplete="current-password" placeholder="••••••••"></label>
      ${error?`<div class="auth-error">${esc(error)}</div>`:''}
      <button class="primary wide" data-auth="login">Войти</button>
      <button class="auth-link" data-auth="signup">Создать аккаунт</button>`);
  }
  function showSignup(error='') {
    modal(`<div class="auth-head"><div><div class="auth-kicker">DOTA ASSISTANT</div><h2>Регистрация</h2></div><button class="auth-close" data-auth="close">×</button></div>
      <label>Никнейм<input id="authUsername" type="text" autocomplete="username" maxlength="30" placeholder="Например, Sabir"></label>
      <label>Email<input id="authEmail" type="email" autocomplete="email" placeholder="you@example.com"></label>
      <label>Пароль<input id="authPassword" type="password" autocomplete="new-password" placeholder="Минимум 6 символов"></label>
      ${error?`<div class="auth-error">${esc(error)}</div>`:''}
      <button class="primary wide" data-auth="signup-submit">Зарегистрироваться</button>
      <button class="auth-link" data-auth="login-form">У меня уже есть аккаунт</button>`);
  }
  async function login() {
    const c=loadClient(); if(!c)return showLogin('Не удалось подключить сервер.');
    const email=document.querySelector('#authEmail')?.value.trim(); const password=document.querySelector('#authPassword')?.value;
    if(!email||!password)return showLogin('Введите email и пароль.');
    const {error}=await c.auth.signInWithPassword({email,password}); if(error)return showLogin(error.message);
    closeModal(); await syncFromCloud(); renderAccountButton();
  }
  async function signup() {
    const c=loadClient(); if(!c)return showSignup('Не удалось подключить сервер.');
    const username=document.querySelector('#authUsername')?.value.trim(); const email=document.querySelector('#authEmail')?.value.trim(); const password=document.querySelector('#authPassword')?.value;
    if(!username||!email||!password)return showSignup('Заполните все поля.');
    if(password.length<6)return showSignup('Пароль должен содержать минимум 6 символов.');
    const {data,error}=await c.auth.signUp({email,password,options:{data:{username,display_name:username}}});
    if(error)return showSignup(error.message);
    if(data.session){ user=data.user; await migrateLocalToCloud(); closeModal(); renderAccountButton(); }
    else showLogin('Аккаунт создан. Проверьте email для подтверждения, затем войдите.');
  }
  async function syncFromCloud() {
    const c=loadClient(); if(!c||!user||syncing)return; syncing=true;
    try {
      const {data,error}=await c.from('builds').select('*').order('updated_at',{ascending:false});
      if(error) throw error;
      const builds=(data||[]).map(row => { const d=row.data||{}; return {...d,id:row.id,name:row.name||d.name||'Моя сборка',hero:row.hero||d.hero||'',role:row.role||d.role||'1',is_favorite:!!row.is_favorite}; });
      writeLocal(builds);
      if(window.load) load();
      if(window.render) render();
    } catch(e) { console.error('Cloud sync:',e); toast?.('Не удалось загрузить облачные сборки'); }
    finally { syncing=false; }
  }
  async function migrateLocalToCloud() {
    const c=loadClient(); if(!c||!user)return;
    const builds=localBuilds(); if(!builds.length)return;
    const rows=builds.map(b=>({id:isUuid(b.id)?b.id:undefined,user_id:user.id,name:b.name||'Моя сборка',hero:b.hero||null,role:b.role||null,data:b,is_favorite:!!b.is_favorite}));
    const clean=rows.map(r=>{if(!r.id)delete r.id;return r;});
    const {error}=await c.from('builds').upsert(clean,{onConflict:'id'}); if(error){console.error(error);return;}
    await syncFromCloud();
  }
  function isUuid(v){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''));}
  async function cloudSave() {
    if(!user||!loadClient()||syncing)return;
    const builds=localBuilds();
    const rows=builds.map(b=>({id:isUuid(b.id)?b.id:undefined,user_id:user.id,name:b.name||'Моя сборка',hero:b.hero||null,role:b.role||null,data:b,is_favorite:!!b.is_favorite,updated_at:new Date().toISOString()}));
    const c=client;
    for(const row of rows){ const q={...row}; if(!q.id)delete q.id; const {error}=await c.from('builds').upsert(q); if(error)console.error('Build save:',error); }
  }
  function renderAccountButton() {
    let b=document.querySelector('#accountButton');
    if(!b){ const host=document.querySelector('.app'); if(!host)return; b=document.createElement('button'); b.id='accountButton'; b.className='account-button'; host.prepend(b); }
    b.textContent=user ? `◉ ${user.user_metadata?.username || user.email?.split('@')[0] || 'Аккаунт'}` : '◉ Войти';
    b.onclick=()=>user?showAccount():showLogin();
  }
  function showAccount() {
    const name=esc(user?.user_metadata?.username||user?.email?.split('@')[0]||'Игрок');
    modal(`<div class="auth-head"><div><div class="auth-kicker">АККАУНТ</div><h2>${name}</h2></div><button class="auth-close" data-auth="close">×</button></div>
      <div class="auth-info">${esc(user?.email||'')}</div>
      <div class="auth-stats">Сборки сохраняются в облаке и доступны после входа с другого устройства.</div>
      <button class="primary wide" data-auth="sync">Синхронизировать сборки</button>
      <button class="auth-link danger-link" data-auth="logout">Выйти</button>`);
  }
  document.addEventListener('click', async e=>{
    const a=e.target.closest('[data-auth]'); if(!a)return; const action=a.dataset.auth;
    if(action==='close')closeModal(); else if(action==='login')await login(); else if(action==='signup')showSignup(); else if(action==='signup-submit')await signup(); else if(action==='login-form')showLogin(); else if(action==='sync') { await migrateLocalToCloud(); closeModal(); } else if(action==='logout') { const c=loadClient(); await c?.auth.signOut(); user=null; closeModal(); renderAccountButton(); }
  });
  async function init() {
    const c=loadClient(); if(!c)return;
    const {data}=await c.auth.getSession(); user=data.session?.user||null;
    if(user){
      originalSave=window.save;
      if(typeof originalSave==='function' && !window.__cloudSavePatched){
        window.save=function(){ originalSave(); cloudSave(); };
        window.__cloudSavePatched=true;
      }
      const hasLocal=localBuilds().length>0;
      const {count}=await c.from('builds').select('id',{count:'exact',head:true});
      if((count||0)===0 && hasLocal) await migrateLocalToCloud(); else await syncFromCloud();
    }
    renderAccountButton();
    c.auth.onAuthStateChange(async (_event,session)=>{ user=session?.user||null; renderAccountButton(); if(user) await syncFromCloud(); });
  }
  window.DTAuth={openLogin:showLogin,sync:syncFromCloud,getUser:()=>user};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,0);
})();