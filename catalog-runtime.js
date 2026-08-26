(function(){
  'use strict';
  var originalItemChoices=null;
  function escLocal(s){return String(s??'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]||c;});}
  function unique(a){var seen=Object.create(null),out=[];(a||[]).forEach(function(x){x=String(x||'');if(x&&!seen[x]){seen[x]=1;out.push(x);}});return out;}
  function enchantments(){return (window.DOTA_ENCHANTMENTS||[]).map(function(x){return Array.isArray(x)?x[0]:x&&x.name;}).filter(Boolean);}
  function extras(){var c=window.DOTA_EXTRA_CATALOG||{},out=[];Object.keys(c).forEach(function(k){out=out.concat(c[k]||[]);});return unique(out.concat(enchantments()));}
  function extrasFor(cat){var c=window.DOTA_EXTRA_CATALOG||{};return unique((c[cat]||[]).concat(cat==='Зачарования'?enchantments():[]));}
  function html(list){return unique(list).map(function(x){return '<button class="item-choice" data-item="'+escLocal(x)+'" draggable="true">'+imageTag(x)+'<span class="item-name">'+escLocal(x)+'</span></button>';}).join('');}
  function patch(){
    if(typeof window.itemChoices!=='function')return;
    if(!originalItemChoices)originalItemChoices=window.itemChoices;
    window.itemChoices=function(){
      var active=document.querySelector('.categories .cat.active');
      var cat=active?active.dataset.category:'Все';
      var input=document.getElementById('itemSearch');
      var q=(input?input.value:'').trim().toLocaleLowerCase('ru-RU');
      var base=(cat==='Зачарования')?'':originalItemChoices();
      var extra=cat==='Все'?extras():extrasFor(cat);
      var extraFiltered=extra.filter(function(x){return !q||x.toLocaleLowerCase('ru-RU').includes(q);});
      if(cat==='Все')return base+html(extraFiltered);
      if(cat==='Нейтральные')return base+html(extraFiltered);
      if(cat==='Зачарования')return html(extraFiltered);
      return base;
    };
  }
  function injectCategories(){
    var box=document.querySelector('.categories');if(!box)return;
    ['Нейтральные','Зачарования'].forEach(function(cat){if(!box.querySelector('[data-category="'+cat+'']')){var b=document.createElement('button');b.className='cat';b.dataset.category=cat;b.textContent=cat;box.appendChild(b);}});
  }
  function refreshGrid(){patch();injectCategories();var grid=document.getElementById('itemGrid');if(grid&&typeof window.itemChoices==='function')grid.innerHTML=window.itemChoices();}
  function loadCatalog(){
    var s=document.createElement('script');s.src='assets/catalog.js';
    s.onload=function(){fetch('assets/enchantments.json',{cache:'no-store'}).then(function(r){return r.ok?r.json():[];}).then(function(x){window.DOTA_ENCHANTMENTS=x||[];refreshGrid();}).catch(function(){refreshGrid();});};
    s.onerror=function(){refreshGrid();};document.head.appendChild(s);
  }
  function start(){patch();injectCategories();if(document.getElementById('itemGrid'))refreshGrid();loadCatalog();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();