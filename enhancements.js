// Desktop drag-and-drop + safe item click handling.
(function(){
  function getItemName(el){
    var n=el && el.querySelector && el.querySelector('.item-name');
    return n ? n.textContent.trim() : '';
  }

  document.addEventListener('dragstart',function(e){
    var item=e.target.closest && e.target.closest('.item-choice');
    if(item && e.dataTransfer){
      var name=getItemName(item);
      if(!name) return;
      e.dataTransfer.effectAllowed='copy';
      e.dataTransfer.setData('item',name);
      e.dataTransfer.setData('text/plain',name);
      item.classList.add('dragging');
      return;
    }
    var slot=e.target.closest && e.target.closest('.inv-slot');
    if(slot && e.dataTransfer){
      var slots=[].slice.call(document.querySelectorAll('.inv-slot'));
      var i=slots.indexOf(slot);
      if(i>=0){
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('slot',String(i));
        slot.classList.add('dragging');
      }
    }
  });

  document.addEventListener('dragend',function(e){
    var el=e.target.closest && e.target.closest('.item-choice,.inv-slot');
    if(el) el.classList.remove('dragging');
  });

  // Handles catalog clicks independently of malformed/legacy inline onclick attributes.
  document.addEventListener('click',function(e){
    var item=e.target.closest && e.target.closest('.item-choice');
    if(!item) return;
    if(typeof window.pickItem!=='function') return;
    var name=getItemName(item);
    if(!name) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.pickItem(name);
  },true);

  window.dropSlot=function(e,i){
    e.preventDefault();
    e.stopPropagation();
    var item=e.dataTransfer && e.dataTransfer.getData('item');
    if(item){
      if(window.selected && selected.slots){
        selected.slots[i]=item;
        window.targetSlot=null;
        if(typeof window.save==='function') save();
        if(typeof window.renderEditor==='function') renderEditor();
      }
      return;
    }
    var from=Number(e.dataTransfer && e.dataTransfer.getData('slot'));
    if(Number.isInteger(from) && !Number.isNaN(from) && window.selected && selected.slots){
      var s=selected.slots;
      [s[from],s[i]]=[s[i],s[from]];
      if(typeof window.save==='function') save();
      if(typeof window.renderEditor==='function') renderEditor();
    }
  };

  var style=document.createElement('style');
  style.textContent='.item-choice{cursor:grab}.item-choice.dragging{opacity:.45;cursor:grabbing}.inv-slot[draggable="true"]{cursor:grab}.inv-slot.dragging{opacity:.5}';
  document.head.appendChild(style);

  function mark(){
    document.querySelectorAll('.item-choice').forEach(function(el){el.setAttribute('draggable','true')});
    document.querySelectorAll('.inv-slot').forEach(function(el){el.setAttribute('draggable','true')});
  }
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
  mark();
})();
