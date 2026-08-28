/* DTAs v1.06 — keep account button outside the rerendered #app shell */
(()=>{
  function install(){
    const app=document.querySelector('#app');
    if(!app)return;

    // auth.js has its own observer from the previous fix. It is no longer needed:
    // the account button is kept outside #app, so navigation cannot destroy it.
    if(window.__dtaAccountObserver){
      try{window.__dtaAccountObserver.disconnect()}catch{}
      window.__dtaAccountObserver=null;
    }

    const move=()=>{
      const b=document.querySelector('#accountButton');
      if(b && b.parentElement!==document.body) document.body.appendChild(b);
    };

    move();

    const observer=new MutationObserver(()=>move());
    observer.observe(app,{childList:true,subtree:true});
    window.__dtaPermanentAccountObserver=observer;
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
