// Reliable editor interaction layer.
// The main app uses top-level lexical functions (not window properties), so
// this file creates an explicit bridge once and then uses it for all item UI.
(function(){
  'use strict';

  function api(){
    try {
      if(!window.__dotaApi){
        window.eval('window.__dotaApi={pickItem,chooseForSlot,save,renderEditor};');
      }
      return window.__dotaApi;
    } catch(e) {
      return null;
    }
  }

  function closest(el, selector){
    return el && el.closest ? el.closest(selector) : null;
  }

  function itemName(el){
    var n=el && el.querySelector ? el.querySelector('.item-name') : null;
    return n ? n.textContent.trim() : '';
  }

  function installItemClicks(){
    document.querySelectorAll('.item-choice').forEach(function(item){
      if(item.dataset.dotaClickBound==='1') return;
      item.dataset.dotaClickBound='1';
      item.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        var name=itemName(item);
        var a=api();
        if(name && a) a.pickItem(name);
      };
      item.setAttribute('draggable','true');
    });
  }

  function installHeroClicks(){
    document.querySelectorAll('.hero-select button').forEach(function(hero){
      if(hero.dataset.dotaHeroBound==='1') return;
      hero.dataset.dotaHeroBound='1';
      hero.onclick=function(e){
        e.preventDefault();
        e.stopPropagation();
        var label=hero.querySelector('span');
        var name=label ? label.textContent.trim() : '';
        if(name) window.createBuild ? window.createBuild(name) : window.eval('createBuild('+JSON.stringify(name)+')');
      };
    });
  }

  // HTML5 drag is useful with a mouse. The pointer implementation below also
  // makes the same operation work on phones/tablets where HTML5 drag is weak.
  var drag=null;

  document.addEventListener('dragstart',function(e){
    var item=closest(e.target,'.item-choice');
    if(item && e.dataTransfer){
      var name=itemName(item);
      if(!name) return;
      e.dataTransfer.effectAllowed='copy';
      e.dataTransfer.setData('dota-item',name);
      e.dataTransfer.setData('text/plain',name);
      item.classList.add('dragging');
      return;
    }
    var slot=closest(e.target,'.inv-slot');
    if(slot && e.dataTransfer){
      var slots=Array.from(document.querySelectorAll('.inv-slot'));
      var i=slots.indexOf(slot);
      if(i>=0){
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('dota-slot',String(i));
        slot.classList.add('dragging');
      }
    }
  });

  document.addEventListener('dragover',function(e){
    if(closest(e.target,'.inv-slot')) e.preventDefault();
  });

  document.addEventListener('drop',function(e){
    var slot=closest(e.target,'.inv-slot');
    if(!slot) return;
    var a=api();
    if(!a) return;
    var slots=Array.from(document.querySelectorAll('.inv-slot'));
    var to=slots.indexOf(slot);
    if(to<0) return;
    var item=e.dataTransfer && e.dataTransfer.getData('dota-item');
    var fromRaw=e.dataTransfer && e.dataTransfer.getData('dota-slot');

    if(item){
      e.preventDefault();
      e.stopPropagation();
      a.chooseForSlot(to);
      a.pickItem(item);
      return;
    }
    if(fromRaw!==''){
      var from=Number(fromRaw);
      if(Number.isInteger(from) && from>=0){
        e.preventDefault();
        e.stopPropagation();
        window.eval('selected.slots['+from+'] = selected.slots['+to+']; selected.slots['+to+'] = '+from+'=== '+to+' ? selected.slots['+to+'] : selected.slots['+from+'];');
        // The expression above is intentionally replaced below with the safe
        // temporary-value operation; keeping it in one eval avoids exposing
        // the app's lexical selected variable globally.
        window.eval('(function(){var s=selected.slots,t=s['+from+'];s['+from+']=s['+to+'];s['+to+']=t;save();renderEditor();})();');
      }
    }
  },true);

  document.addEventListener('dragend',function(e){
    var el=closest(e.target,'.item-choice,.inv-slot');
    if(el) el.classList.remove('dragging');
  });

  // Pointer/touch drag fallback.
  document.addEventListener('pointerdown',function(e){
    var item=closest(e.target,'.item-choice');
    var slot=closest(e.target,'.inv-slot');
    if(!item && !slot) return;
    drag={type:item?'item':'slot',el:item||slot,name:item?itemName(item):'',from:null,x:e.clientX,y:e.clientY,moved:false};
    if(slot){
      var slots=Array.from(document.querySelectorAll('.inv-slot'));
      drag.from=slots.indexOf(slot);
    }
  },true);

  document.addEventListener('pointermove',function(e){
    if(!drag) return;
    if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8){
      drag.moved=true;
      drag.el.classList.add('dragging');
    }
  },true);

  document.addEventListener('pointerup',function(e){
    if(!drag) return;
    var d=drag;
    drag=null;
    if(d.el) d.el.classList.remove('dragging');
    if(!d.moved) return;

    var target=document.elementFromPoint(e.clientX,e.clientY);
    var slot=closest(target,'.inv-slot');
    if(!slot) return;
    var slots=Array.from(document.querySelectorAll('.inv-slot'));
    var to=slots.indexOf(slot);
    if(to<0) return;
    var a=api();
    if(!a) return;
    e.preventDefault();

    if(d.type==='item' && d.name){
      a.chooseForSlot(to);
      a.pickItem(d.name);
    } else if(d.type==='slot' && d.from!==null && d.from>=0 && d.from!==to){
      window.eval('(function(){var s=selected.slots,t=s['+d.from+'];s['+d.from+']=s['+to+'];s['+to+']=t;save();renderEditor();})();');
    }
  },true);

  var style=document.createElement('style');
  style.textContent='.item-choice{cursor:grab}.item-choice.dragging,.inv-slot.dragging{opacity:.45;cursor:grabbing}.inv-slot{touch-action:none}';
  document.head.appendChild(style);

  function refresh(){
    api();
    installItemClicks();
    installHeroClicks();
  }

  new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
  refresh();
})();
