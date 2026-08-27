(function(){
  'use strict';
  const ICONS={
    home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3l8.5 7.5v9a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    builds:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.5" width="14" height="17" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 7h6M9 11h6M9 15h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    draft:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 20c.6-4.1 2.8-6.2 6.5-6.2s5.9 2.1 6.5 6.2M7 11.5h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    wards:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 3.5v3M20.5 12h-3M12 20.5v-3M3.5 12h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    community:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 18c.5-3 2.3-5 5.5-5s5 2 5.5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="17" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14.5 15c.8-.8 1.8-1.2 3-1.2 1.8 0 3.1 1.1 3.5 3.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
  };
  function paint(){
    document.querySelectorAll('.bottom-nav').forEach(nav=>{
      nav.style.gridTemplateColumns='repeat(5,minmax(0,1fr))';
      nav.style.display='grid';
      nav.querySelectorAll('.nav-btn').forEach(btn=>{
        const page=btn.dataset.page||'';
        if(!ICONS[page]) return;
        let holder=btn.querySelector('.nav-svg');
        if(!holder){
          holder=document.createElement('span');
          holder.className='nav-svg';
          holder.setAttribute('aria-hidden','true');
          btn.textContent='';
          btn.appendChild(holder);
        }
        holder.innerHTML=ICONS[page];
      });
    });
  }
  const style=document.createElement('style');
  style.textContent=`
    .bottom-nav{grid-template-columns:repeat(5,minmax(0,1fr))!important;display:grid!important;overflow:hidden!important;}
    .bottom-nav .nav-btn{display:flex!important;align-items:center!important;justify-content:center!important;min-width:0!important;width:100%!important;height:100%!important;padding:0!important;font-size:0!important;line-height:1!important;}
    .bottom-nav .nav-svg{display:flex!important;align-items:center!important;justify-content:center!important;width:24px!important;height:24px!important;color:currentColor!important;visibility:visible!important;opacity:1!important;}
    .bottom-nav .nav-svg svg{display:block!important;width:22px!important;height:22px!important;}
  `;
  document.head.appendChild(style);
  const obs=new MutationObserver(paint);
  function start(){paint();const root=document.getElementById('app')||document.body;obs.observe(root,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
