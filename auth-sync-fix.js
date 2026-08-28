/* v1.06 hotfix: render() rebuilds .app and removes #accountButton. */
(()=>{
  function ensure(){
    const app=document.querySelector('.app');
    if(!app)return;
    let b=document.querySelector('#accountButton');
    const u=window.DTAuth?.getUser?.();
    if(!b){
      b=document.createElement('button');
      b.id='accountButton';
      b.className='account-button';
      b.type='button';
      app.prepend(b);
    }
    b.textContent=u?`◉ ${u.username}`:'◉ Войти';
    b.onclick=()=>u?document.dispatchEvent(new CustomEvent('dta-open-profile')):window.DTAuth?.openLogin?.();
  }
  document.addEventListener('dta-open-profile',()=>{
    const u=window.DTAuth?.getUser?.();
    if(!u)return;
    const m=document.querySelector('#modal');
    if(!m)return;
    m.innerHTML=`<div class="auth-backdrop"><div class="auth-card"><div class="auth-head"><div><div class="auth-kicker">АККАУНТ</div><h2>${String(u.username).replace(/[&<>"']/g,'')}</h2></div><button class="auth-close" data-auth="close">×</button></div><div class="auth-stats">Сборки сохраняются в облаке и доступны после входа с другого устройства.</div><button class="primary wide" onclick="window.DTAuth.sync();document.querySelector('#modal').innerHTML=''">Синхронизировать</button><button class="auth-link danger-link" onclick="localStorage.removeItem('dta-session-v2');location.reload()">Выйти</button></div></div>`;
    m.classList.add('auth-open');
  });
  setInterval(ensure,500);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure);else ensure();
})();