(function(){'use strict';
  var LEVELS=[
    {name:'Dagon 2',categories:['Магия']},
    {name:'Dagon 3',categories:['Магия']},
    {name:'Dagon 4',categories:['Магия']},
    {name:'Dagon 5',categories:['Магия']},
    {name:'Boots of Travel 2',categories:['Аксессуары']}
  ];
  function esc(s){return String(s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});}
  function levelCards(category){
    var out=[];
    LEVELS.forEach(function(x){if(x.categories.indexOf(category)>=0)out.push(x.name);});
    return out;
  }
  function patch(){
    if(typeof window.itemChoices!=='function')return;
    var old=window.itemChoices;
    window.itemChoices=function(){
      var active=document.querySelector('.categories .cat.active'),cat=active?active.dataset.category:(typeof itemCategory!=='undefined'?itemCategory:'Все');
      var base=old();
      if(cat==='Магия'||cat==='Аксессуары'){
        var extra=levelCards(cat).filter(function(n){return base.indexOf(n)<0;});
        if(extra.length){var h=extra.map(function(x){return '<button class="item-choice" data-item="'+esc(x)+'" draggable="true">'+(typeof imageTag==='function'?imageTag(x):'')+'<span class="item-name">'+esc(x)+'</span></button>';}).join('');base+=h;}
      }
      return base;
    };
  }
  function start(){patch();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();