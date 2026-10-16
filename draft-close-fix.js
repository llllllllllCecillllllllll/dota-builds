(function(){
'use strict';
function addClose(){
  const root=document.getElementById('draft-v107');
  if(!root)return;
  root.style.position='relative';
  root.style.marginTop='58px';
  const header=root.querySelector('header');
  if(!header||header.querySelector('[data-draft-close]'))return;
  const btn=document.createElement('button');
  btn.type='button';
  btn.setAttribute('data-draft-close','1');
  btn.setAttribute('aria-label','Выйти из Драфта');
  btn.title='Выйти из Драфта';
  btn.textContent='×';
  btn.style.cssText='position:absolute;top:12px;right:14px;width:40px;height:40px;padding:0;border:1px solid var(--line);border-radius:50%;background:var(--bg);color:var(--text);font:30px/36px system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:1000;';
  header.style.position='relative';
  header.style.paddingRight='64px';
  btn.onclick=function(e){
    e.preventDefault();
    e.stopPropagation();
    const home=document.querySelector('.bottom-nav [data-page="home"]');
    if(home)home.click();
  };
  header.appendChild(btn);
}
const style=document.createElement('style');
style.textContent='#draft-v107{position:relative!important;margin-top:58px!important}#draft-v107 [data-draft-close]{z-index:1000!important}';
document.head.appendChild(style);
const observer=new MutationObserver(addClose);
function start(){addClose();observer.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
