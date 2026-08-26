(function(){
  'use strict';
  let locked=false;
  function goBack(e){
    const btn=e && e.target && e.target.closest ? e.target.closest('.page-head [data-action="back-builds"]') : null;
    if(!btn || locked)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    locked=true;
    try{
      window.eval("state.page='builds'; render();");
    }catch(err){
      console.error('Dota Assistant back navigation failed',err);
    }
    setTimeout(()=>{locked=false},250);
  }
  document.addEventListener('pointerdown',goBack,true);
  document.addEventListener('click',goBack,true);
})();