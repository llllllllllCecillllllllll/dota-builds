(function(){
'use strict';
var lastSignature='';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]});}
function allExtra(){
  var c=window.DOTA_EXTRA_CATALOG||{},out=[];
  Object.keys(c).forEach(function(k){(c[k]||[]).forEach(function(n){if(n&&out.indexOf(n)<0)out.push(n);});});
  (window.DOTA_ENCHANTMENTS||[]).forEach(function(x){var n=x&&x[0];if(n&&out.indexOf(n)<0)out.push(n);});
  return out;
}
function byCategory(cat){
  var c=window.DOTA_EXTRA_CATALOG||{};
  if(cat==='Зачарования')return (window.DOTA_ENCHANTMENTS||[]).map(function(x){return x&&x[0];}).filter(Boolean);
  return (c[cat]||[]).slice();
}
function image(name){try{return typeof imageTag==='function'?imageTag(name):'<span class="item-img-fallback">+</span>'}catch(e){return '<span class="item-img-fallback">+</span>';}}
function render(){
  var grid=document.getElementById('itemGrid');if(!grid||!window.DOTA_EXTRA_CATALOG)return;
  var search=document.getElementById('itemSearch');
  var q=(search&&search.value||'').trim().toLowerCase();
  var active=document.querySelector('.categories .cat.active');
  var cat=active?active.dataset.category:'Все';
  var names=[];
  if(cat==='Все'){
    Object.keys(ITEMS||{}).forEach(function(k){(ITEMS[k]||[]).forEach(function(n){if(n&&names.indexOf(n)<0)names.push(n);});});
    allExtra().forEach(function(n){if(names.indexOf(n)<0)names.push(n);});
  }else if((window.DOTA_EXTRA_CATALOG||{})[cat]){
    names=byCategory(cat);
  }else{
    names=(ITEMS[cat]||[]).slice();
  }
  names=names.filter(function(n){return !q||n.toLowerCase().indexOf(q)>=0;});
  var sig=cat+'|'+q+'|'+names.length;
  if(sig===lastSignature)return;
  lastSignature=sig;
  grid.innerHTML=names.map(function(n){return '<button class="item-choice" data-item="'+esc(n)+'" draggable="true">'+image(n)+'<span class="item-name">'+esc(n)+'</span></button>';}).join('');
}
function ensureCategories(){
  var box=document.querySelector('.categories');if(!box)return;
  ['Нейтральные','Зачарования'].forEach(function(cat){if(!box.querySelector('[data-category="'+cat+'"]')){var b=document.createElement('button');b.className='cat';b.dataset.category=cat;b.textContent=cat;box.appendChild(b);}});
}
function tick(){ensureCategories();render();}
document.addEventListener('click',function(e){var cat=e.target.closest('.categories [data-category]');if(cat){lastSignature='';setTimeout(tick,0);}},true);
document.addEventListener('input',function(e){if(e.target&&e.target.id==='itemSearch'){lastSignature='';setTimeout(tick,0);}},true);
var obs=new MutationObserver(function(){ensureCategories();});
obs.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
var n=0;function boot(){tick();if(++n<80)setTimeout(boot,250);}boot();
})();