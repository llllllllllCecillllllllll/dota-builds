// UI fixes for editor interactions.
(function(){
  function closest(el, selector){
    return el && el.closest ? el.closest(selector) : null;
  }
  function itemName(el){
    var n=el && el.querySelector ? el.querySelector('.item-name') : null;
    return n ? n.textContent.trim() : '';
  }

  // The app's inline item handler is malformed because JSON.stringify() is
  // placed inside a double-quoted HTML attribute. Handle the click safely here.
  document.addEventListener('click',function(e){
    var item=closest(e.target,'.item-choice');
    if(item && typeof window.pickItem==='function'){
      var name=itemName(item);
      if(name){
        e.preventDefault();
        e.stopImmediatePropagation();
        window.pickItem(name);
      }
      return;
    }

    // Same issue for hero names containing an apostrophe, e.g. Nature's Prophet.
    var hero=closest(e.target,'.hero-select button');
    if(hero && typeof window.createBuild==='function'){
      var label=hero.querySelector('span');
      var name=label ? label.textContent.trim() : '';
      if(name){
        e.preventDefault();
        e.stopImmediatePropagation();
        window.createBuild(name);
      }
    }
  },true);

  // Drag an item from the catalog directly onto an inventory/backpack slot.
  // Slot-to-slot dragging is intentionally left to the app's native dropSlot(),
  // because that function has direct access to the app's lexical selected state.
  document.addEventListener('dragstart',function(e){
    var item=closest(e.target,'.item-choice');
    if(item && e.dataTransfer){
      var name=itemName(item);
      if(!name)return;
      e.dataTransfer.effectAllowed='copy';
      e.dataTransfer.setData('dota-item',name);
      e.dataTransfer.setData('text/plain',name);
      item.classList.add('dragging');
      return;
    }
    var slot=closest(e.target,'.inv-slot');
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
    var el=closest(e.target,'.item-choice,.inv-slot');
    if(el)el.classList.remove('dragging');
  });

  // Capture catalog -> slot drops before the inline slot handler. For this
  // operation we use the app's own chooseForSlot() and pickItem() functions,
  // so its lexical state remains consistent with localStorage.
  document.addEventListener('drop',function(e){
    var slot=closest(e.target,'.inv-slot');
    if(!slot)return;
    var item=e.dataTransfer && e.dataTransfer.getData('dota-item');
    if(!item)return; // let native slot-to-slot handling continue

    var slots=[].slice.call(document.querySelectorAll('.inv-slot'));
    var i=slots.indexOf(slot);
    if(i<0 || typeof window.chooseForSlot!=='function' || typeof window.pickItem!=='function')return;

    e.preventDefault();
    e.stopImmediatePropagation();
    window.chooseForSlot(i);
    window.pickItem(item);
  },true);

  var style=document.createElement('style');
  style.textContent=`
    .item-choice{cursor:grab}
    .item-choice.dragging{opacity:.45;cursor:grabbing}
    .inv-slot.dragging{opacity:.5}
  `;
  document.head.appendChild(style);

  function mark(){
    document.querySelectorAll('.item-choice').forEach(function(el){el.setAttribute('draggable','true')});
    document.querySelectorAll('.inv-slot').forEach(function(el){el.setAttribute('draggable','true')});
  }
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
  mark();
})();
