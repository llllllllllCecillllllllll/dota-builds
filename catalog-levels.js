(function(){'use strict';
  var LEVELS=[
    {name:'Dagon 2',categories:['Магия']},
    {name:'Dagon 3',categories:['Магия']},
    {name:'Dagon 4',categories:['Магия']},
    {name:'Dagon 5',categories:['Магия']},
    {name:'Boots of Travel 2',categories:['Поддержка']}
  ];
  function esc(s){return String(s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});}
  function levelCards(category){
    return LEVELS.filter(function(item){return category==='Все'||item.categories.indexOf(category)!==-1;}).map(function(item){
      var name=item.name;
      return '<button class="item-choice" data-item="'+esc(name)+'" draggable="true">'+imageTag(name)+'<span class="item-name">'+esc(name)+'</span></button>';
    }).join('');
  }
  function patch(){
    if(typeof window.itemChoices!=='function'||window.__dotaLevelsPatched)return;
    var base=window.itemChoices;
    window.itemChoices=function(){
      var html=base.apply(this,arguments);
      var cat=document.querySelector('.categories .cat.active');
      var category=cat?cat.dataset.category:'Все';
      var extra=levelCards(category);
      return html+extra;
    };
    window.__dotaLevelsPatched=true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
})();
