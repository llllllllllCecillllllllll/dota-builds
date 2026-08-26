// Reliable editor interaction layer for inventory and item selection.
(function(){
  'use strict';
  function closest(el,selector){return el&&el.closest?el.closest(selector):null}
  function itemName(el){var n=el&&el.querySelector?el.querySelector('.item-name'):null;return n?n.textContent.trim():''}
  function api(){try{if(!window.__dotaApi)window.eval('window.__dotaApi={pickItem,chooseForSlot,save,renderEditor};');return window.__dotaApi}catch(e){return null}}

  function installItemClicks(){
    document.querySelectorAll('.item-choice').forEach(function(item){
      if(item.dataset.dotaClickBound==='1')return;
      item.dataset.dotaClickBound='1';
      item.onclick=function(e){e.preventDefault();e.stopPropagation();var n=itemName(item),a=api();if(n&&a)a.pickItem(n)};
      item.setAttribute('draggable','false');
    });
  }

  var drag=null,suppressClick=false;

  document.addEventListener('pointerdown',function(e){
    var item=closest(e.target,'.item-choice'),slot=closest(e.target,'.inv-slot');
    if(!item&&!slot)return;
    drag={type:item?'item':'slot',el:item||slot,name:item?itemName(item):'',from:null,x:e.clientX,y:e.clientY,moved:false};
    if(slot){var ss=Array.from(document.querySelectorAll('.inv-slot'));drag.from=ss.indexOf(slot)}
  },true);

  document.addEventListener('pointermove',function(e){
    if(!drag)return;
    if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){drag.moved=true;drag.el.classList.add('dragging');e.preventDefault()}
  },{capture:true,passive:false});

  document.addEventListener('pointerup',function(e){
    if(!drag)return;
    var d=drag;drag=null;if(d.el)d.el.classList.remove('dragging');
    if(!d.moved)return;
    suppressClick=true;setTimeout(function(){suppressClick=false},100);
    var target=document.elementFromPoint(e.clientX,e.clientY),slot=closest(target,'.inv-slot');
    if(!slot)return;
    var ss=Array.from(document.querySelectorAll('.inv-slot')),to=ss.indexOf(slot);if(to<0)return;
    var a=api();if(!a)return;
    e.preventDefault();e.stopPropagation();
    if(d.type==='item'&&d.name){a.chooseForSlot(to);a.pickItem(d.name);return}
    if(d.type==='slot'&&d.from!==null&&d.from>=0&&d.from!==to){
      window.eval('(function(){var s=selected.slots,t=s['+d.from+'];s['+d.from+']=s['+to+'];s['+to+']=t;save();renderEditor();})();');
    }
  },{capture:true,passive:false});

  document.addEventListener('click',function(e){if(suppressClick){e.preventDefault();e.stopImmediatePropagation();suppressClick=false}},true);

  // Desktop fallback for slot-to-slot dragging.
  document.addEventListener('dragstart',function(e){
    var slot=closest(e.target,'.inv-slot');if(!slot||!e.dataTransfer)return;
    var ss=Array.from(document.querySelectorAll('.inv-slot')),i=ss.indexOf(slot);if(i<0)return;
    e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('dota-slot',String(i));slot.classList.add('dragging');
  });
  document.addEventListener('dragover',function(e){if(closest(e.target,'.inv-slot'))e.preventDefault()});
  document.addEventListener('drop',function(e){
    var slot=closest(e.target,'.inv-slot');if(!slot)return;
    var raw=e.dataTransfer&&e.dataTransfer.getData('dota-slot');if(raw==='')return;
    var from=Number(raw),ss=Array.from(document.querySelectorAll('.inv-slot')),to=ss.indexOf(slot);
    if(!Number.isInteger(from)||from<0||to<0||from===to)return;
    e.preventDefault();e.stopImmediatePropagation();
    window.eval('(function(){var s=selected.slots,t=s['+from+'];s['+from+']=s['+to+'];s['+to+']=t;save();renderEditor();})();');
  },true);
  document.addEventListener('dragend',function(e){var el=closest(e.target,'.item-choice,.inv-slot');if(el)el.classList.remove('dragging')});

  var style=document.createElement('style');style.textContent='.item-choice{cursor:pointer}.item-choice.dragging,.inv-slot.dragging{opacity:.45;cursor:grabbing}.inv-slot{touch-action:none}';document.head.appendChild(style);
  function refresh(){api();installItemClicks()}
  new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});refresh();
})();
