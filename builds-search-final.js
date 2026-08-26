/* Dota Assistant — final builds search fix */
(function(){
'use strict';
function applySearch(query){
  const q=(query||'').trim().toLocaleLowerCase('ru-RU');
  document.querySelectorAll('.build-card').forEach(card=>{
    const name=(card.querySelector('.build-name')?.textContent||'').trim();
    const hero=(card.querySelector('.build-hero')?.textContent||'').trim();
    const meta=(card.querySelector('.build-meta')?.textContent||'').trim();
    const m=meta.match(/(?:Позиция|Position)\s*([1-5])/i);
    const role=m?m[1]:'';
    const text=(name+' '+hero).toLocaleLowerCase('ru-RU');
    const active=document.querySelector('.build-role-filter button.active');
    const selectedRole=active?.textContent?.trim()||'Все';
    card.hidden=!!q&&!text.includes(q) || (selectedRole!=='Все'&&role!==selectedRole);
  });
}
function install(){
  const previous=document.oninput;
  document.oninput=function(e){
    if(e.target && e.target.id==='buildSearch'){
      // Critical: do not call the old handler. It called buildsPage(), replacing the input after one keypress.
      window.__dotaBuildQuery=e.target.value;
      applySearch(e.target.value);
      return;
    }
    if(typeof previous==='function') previous.call(this,e);
  };
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();