(function(){
  'use strict';
  var originalItemChoices=null;
  function escLocal(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
  function enchantmentNames(){return (window.DOTA_ENCHANTMENTS||[]).map(function(x){return x&&x[0];}).filter(Boolean);}
  function mergeEnchantmentPaths(){
    if(!window.DOTA_LOCAL_ASSETS) return;
    (window.DOTA_ENCHANTMENTS||[]).forEach(function(x){if(x&&x[0]&&x[1])window.DOTA_LOCAL_ASSETS.items[x[0]]=x[1];});
  }
  function extraNames(){
    var c=window.DOTA_EXTRA_CATALOG||{},out=[];
    Object.keys(c).forEach(function(k){(c[k]||[]).forEach(function(n){if(out.indexOf(n)<0)out.push(n);});});
    enchantmentNames().forEach(function(n){if(out.indexOf(n)<0)out.push(n);});
    return out;
  }
  function extraFor(cat){
    var a=((window.DOTA_EXTRA_CATALOG||{})[cat]||[]).slice();
    if(cat==='Зачарования')enchantmentNames().forEach(function(n){if(a.indexOf(n)<0)a.push(n);});
    return a;
  }
  function extraHtml(list){return list.map(function(x){return '<button class="item-choice" data-item="'+escLocal(x)+'" draggable="true">'+imageTag(x)+'<span class="item-name">'+escLocal(x)+'</span></button>';}).join('');}
  function patchChoices(){
    if(typeof window.itemChoices!=='function')return;
    if(!originalItemChoices)originalItemChoices=window.itemChoices;
    window.itemChoices=function(){
      var active=document.querySelector('.categories .cat.active');
      var cat=active?active.dataset.category:'Все';
      var search=document.getElementById('itemSearch');
      var q=(search?search.value:'').toLowerCase();
      if(cat==='Зачарования')return extraHtml(extraFor('Зачарования').filter(x=>x.toLowerCase().includes(q)));
      if(cat==='Все')return originalItemChoices()+extraHtml(extraNames().filter(x=>x.toLowerCase().includes(q)));
      if(cat==='Нейтральные')return originalItemChoices()+extraHtml(extraFor('Нейтральные').filter(x=>x.toLowerCase().includes(q)));
      return originalItemChoices();
    };
  }
  function injectCategories(){
    var box=document.querySelector('.categories');if(!box)return;
    ['Нейтральные','Зачарования'].forEach(function(cat){
      if(!box.querySelector('[data-category="'+cat+'"]')){var b=document.createElement('button');b.className='cat';b.dataset.category=cat;b.textContent=cat;box.appendChild(b);}
    });
  }
  function refresh(){
    patchChoices();injectCategories();mergeEnchantmentPaths();
    if(typeof render==='function'&&!window.__catalogRefresh){window.__catalogRefresh=true;render();setTimeout(function(){window.__catalogRefresh=false;injectCategories();},0);}
  }
  function start(){
    var s=document.createElement('script');s.src='assets/catalog.js';s.onload=function(){
      fetch('assets/enchantments.json',{cache:'no-store'}).then(r=>r.ok?r.json():[]).then(function(x){window.DOTA_ENCHANTMENTS=x||[];refresh();}).catch(function(){refresh();});
    };s.onerror=function(){refresh();};document.head.appendChild(s);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
