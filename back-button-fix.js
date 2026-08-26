(function(){
  'use strict';
  function goBack(){
    try {
      window.eval("state.page='builds'; render()");
    } catch(e) {
      console.error('Dota Assistant back navigation failed',e);
    }
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest('.page-head [data-action="back-builds"]');
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    goBack();
  },true);
})();