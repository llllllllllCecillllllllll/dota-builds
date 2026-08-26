// Desktop drag-and-drop for item cards -> inventory slots.
(function(){
  document.addEventListener('dragstart',function(e){
    var item=e.target.closest && e.target.closest('.item-choice');
    if(!item || !e.dataTransfer) return;
    var name=item.querySelector('.item-name');
    if(!name) return;
    e.dataTransfer.effectAllowed='copy';
    e.dataTransfer.setData('item',name.textContent.trim());
    e.dataTransfer.setData('text/plain',name.textContent.trim());
    item.classList.add('dragging');
  });
  document.addEventListener('dragend',function(e){
    var item=e.target.closest && e.target.closest('.item-choice');
    if(item) item.classList.remove('dragging');
  });

  window.dropSlot=function(e,i){
    e.preventDefault();
    e.stopPropagation();
    var item=e.dataTransfer && e.dataTransfer.getData('item');
    if(item){
      if(window.selected && selected.slots){
        selected.slots[i]=item;
        targetSlot=null;
        save();
        renderEditor();
      }
      return;
    }
    var from=Number(e.dataTransfer && e.dataTransfer.getData('slot'));
    if(Number.isInteger(from) && !Number.isNaN(from) && window.selected && selected.slots){
      var s=selected.slots;
      [s[from],s[i]]=[s[i],s[from]];
      save();
      renderEditor();
    }
  };

  // Make item cards draggable without changing the generated HTML.
  var style=document.createElement('style');
  style.textContent='.item-choice{cursor:grab}.item-choice.dragging{opacity:.45;cursor:grabbing}.inv-slot[draggable="true"]{cursor:grab}';
  document.head.appendChild(style);

  // The generated buttons need draggable=true. MutationObserver handles every re-render.
  function mark(){
    document.querySelectorAll('.item-choice').forEach(function(el){el.setAttribute('draggable','true')});
  }
  new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
  mark();
})();
