(function(){
'use strict';
const KEY='dota-assistant-v2';
function escJs(s){return JSON.stringify(String(s||''));}
function callApp(code){try{return window.eval(code)}catch(e){console.error('Dota Assistant action failed',e);return null}}
function roleValue(){return window.__stableBuildRole||'1'}
window.__stableBuildRole='1';
document.addEventListener('click',function(e){
  const role=e.target.closest('#modal [data-new-role]');
  if(role){
    e.preventDefault();e.stopImmediatePropagation();
    window.__stableBuildRole=role.dataset.newRole;
    document.querySelectorAll('#modal [data-new-role]').forEach(b=>b.classList.toggle('active',b===role));
    return;
  }
  const create=e.target.closest('#modal [data-create-hero]');
  if(create){
    e.preventDefault();e.stopImmediatePropagation();
    const hero=create.dataset.createHero;
    callApp("newRole="+escJs(roleValue())+";createBuild("+escJs(hero)+")");
    return;
  }
},true);
const observer=new MutationObserver(()=>{
  const modal=document.querySelector('#modal');
  if(modal && modal.querySelector('[data-create-hero]') && !modal.dataset.stableRole){
    modal.dataset.stableRole='1';
    window.__stableBuildRole='1';
  }
});
observer.observe(document.body,{childList:true,subtree:true});
})();