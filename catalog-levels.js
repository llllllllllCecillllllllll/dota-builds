(function(){'use strict';
  var LEVELS=['Dagon 2','Dagon 3','Dagon 4','Dagon 5'];
  function esc(s){return String(s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});}
  function levelCards(){
    return LEVELS.map(function(name){
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
      if(category==='Магия') html += levelCards();
      if(category==='Все') html += levelCards();
      return html;
    };
    window.__dotaLevelsPatched=true;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
})();
