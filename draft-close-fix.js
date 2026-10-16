(function(){
'use strict';
function addClose(){
  const root=document.getElementById('draft-v107');
  if(!root)return;
  const header=root.querySelector('header');
  if(!header||header.querySelector('[data-draft-close]'))return;
  const btn=document.createElement('button');
  btn.type='button';
  btn.setAttribute('data-draft-close','1');
  btn.setAttribute('aria-label','Выйти из Драфта');
  btn.title='Выйти из Драфта';
  btn.textContent='×';
  btn.style.cssText='position:absolute;top:12px;right:14px;width:34px;height:34px;padding:0;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text);font:28px/30px system-ui,sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:2;';
  header.style.position='relative';
  btn.onclick=function(){
    const home=document.querySelector('.bottom-nav [data-page="home"]');
    if(home)home.click();
  };
  header.appendChild(btn);
}
const observer=new MutationObserver(addClose);
function start(){addClose();observer.observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
