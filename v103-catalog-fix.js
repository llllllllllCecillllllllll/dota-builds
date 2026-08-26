(function(){
  'use strict';
  // Prevent async asset/catalog refreshes from reloading localStorage and
  // replacing the currently open editor with the builds list.
  // The initial app load() has already happened before this script is loaded.
  if (typeof window.load === 'function') {
    window.load = function(){};
  }

  function refreshCatalogUI(){
    try {
      var grid=document.getElementById('itemGrid');
      if(grid && typeof window.itemChoices==='function'){
        grid.innerHTML=window.itemChoices();
      }
      var box=document.querySelector('.categories');
      if(box){
        ['Нейтральные','Зачарования'].forEach(function(cat){
          if(!box.querySelector('[data-category="'+cat+'"]')){
            var b=document.createElement('button');
            b.className='cat';
            b.dataset.category=cat;
            b.textContent=cat;
            box.appendChild(b);
          }
        });
      }
    }catch(e){console.warn('Dota catalog UI refresh failed',e)}
  }

  var tries=0;
  function wait(){
    refreshCatalogUI();
    tries++;
    if(tries<80) setTimeout(wait,250);
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){setTimeout(wait,50)},{once:true});
  }else{
    setTimeout(wait,50);
  }
})();
