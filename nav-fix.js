(function(){
'use strict';
const ABOUT_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 10.5v5.8M12 7.3h.01" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
function ensure(){
 document.querySelectorAll('.bottom-nav').forEach(nav=>{
  nav.style.setProperty('display','grid','important');
  nav.style.setProperty('grid-template-columns','repeat(6,minmax(0,1fr))','important');
  nav.style.setProperty('grid-auto-flow','column','important');
  nav.style.setProperty('align-items','stretch','important');
  if(!nav.querySelector('[data-about]')){
   const btn=document.createElement('button');
   btn.type='button'; btn.className='nav-btn'; btn.setAttribute('data-about','1'); btn.setAttribute('aria-label','О приложении');
   btn.innerHTML='<span class="nav-svg about-svg" aria-hidden="true">'+ABOUT_ICON+'</span>';
   btn.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();if(window.showAbout)window.showAbout();});
   nav.appendChild(btn);
  }
 });
}
const style=document.createElement('style');
style.textContent='.bottom-nav{display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;grid-auto-flow:column!important}.bottom-nav .nav-btn{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;height:100%!important;padding:0!important;line-height:1!important}.bottom-nav .nav-btn .icon,.bottom-nav .nav-btn .people-icon{display:flex!important;align-items:center!important;justify-content:center!important;font-size:21px!important;line-height:1!important;visibility:visible!important;opacity:1!important}.bottom-nav .nav-svg{display:flex!important;align-items:center!important;justify-content:center!important;width:24px!important;height:24px!important;color:currentColor!important;visibility:visible!important;opacity:1!important}.bottom-nav .nav-svg svg{display:block!important;width:22px!important;height:22px!important}';
document.head.appendChild(style);
function start(){ensure();new MutationObserver(function(){document.querySelectorAll('.bottom-nav').forEach(nav=>{if(!nav.querySelector('[data-about]'))ensure();});}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
