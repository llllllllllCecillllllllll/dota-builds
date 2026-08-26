// UI enhancements: local item clicks + desktop drag-and-drop + Dota-style empty inventory.
(function(){
  function getItemName(el){
    var n=el && el.querySelector && el.querySelector('.item-name');
    return n ? n.textContent.trim() : '';
  }
  document.addEventListener('dragstart',function(e){
    var item=e.target.closest && e.target.closest('.item-choice');
    if(item && e.dataTransfer){
      var name=getItemName(item); if(!name)return;
      e.dataTransfer.effectAllowed='copy'; e.dataTransfer.setData('item',name); e.dataTransfer.setData('text/plain',name); item.classList.add('dragging'); return;
    }
    var slot=e.target.closest && e.target.closest('.inv-slot');
    if(slot && e.dataTransfer){
      var slots=[].slice.call(document.querySelectorAll('.inv-slot')),i=slots.indexOf(slot);
      if(i>=0){e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('slot',String(i));slot.classList.add('dragging');}
    }
  });
  document.addEventListener('dragend',function(e){var el=e.target.closest&&e.target.closest('.item-choice,.inv-slot');if(el)el.classList.remove('dragging')});
  document.addEventListener('click',function(e){
    var item=e.target.closest&&e.target.closest('.item-choice'); if(!item||typeof window.pickItem!=='function')return;
    var name=getItemName(item);if(!name)return;e.preventDefault();e.stopImmediatePropagation();window.pickItem(name);
  },true);
  window.dropSlot=function(e,i){
    e.preventDefault();e.stopPropagation();
    var item=e.dataTransfer&&e.dataTransfer.getData('item');
    if(item){if(window.selected&&selected.slots){selected.slots[i]=item;window.targetSlot=null;if(typeof window.save==='function')save();if(typeof window.renderEditor==='function')renderEditor();}return;}
    var from=Number(e.dataTransfer&&e.dataTransfer.getData('slot'));
    if(Number.isInteger(from)&&!Number.isNaN(from)&&window.selected&&selected.slots){var s=selected.slots;[s[from],s[i]]=[s[i],s[from]];if(typeof window.save==='function')save();if(typeof window.renderEditor==='function')renderEditor();}
  };
  var style=document.createElement('style');
  style.textContent=`
    /* Dota-like 3x3 inventory: 6 inventory slots + 3 backpack slots. */
    .inventory{width:max-content;max-width:100%;display:grid!important;grid-template-columns:repeat(3,85px)!important;grid-template-rows:repeat(3,64px)!important;gap:3px!important;padding:4px;background:#080b0f;border:1px solid #30353a;border-radius:4px;margin:0 auto}
    .inv-slot{width:85px!important;height:64px!important;min-width:85px;min-height:64px;border:2px solid #30363b!important;border-radius:0!important;background:#11161b!important;color:transparent!important;font-size:0!important;padding:0!important;box-shadow:inset 0 0 0 1px #07090b;cursor:grab}
    .inv-slot:hover{border-color:#59636d!important;background:#171d22!important}.inv-slot.filled{border-style:solid!important;border-color:#555d63!important;background:#141a1f!important}.inv-slot:nth-child(n+7){background:#0d1217!important;border-color:#292f34!important}.inv-slot.dragging{opacity:.5}
    .slot-art{width:85px!important;height:64px!important;object-fit:cover;display:block}.slot-x{font-size:11px!important}.backpack-label{display:none!important}.item-choice{cursor:grab}.item-choice.dragging{opacity:.45;cursor:grabbing}
  `;
  document.head.appendChild(style);
  function mark(){document.querySelectorAll('.item-choice').forEach(function(el){el.setAttribute('draggable','true')});document.querySelectorAll('.inv-slot').forEach(function(el){el.setAttribute('draggable','true')})}
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});mark();
})();
