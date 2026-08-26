// Reliable desktop pointer drag-and-drop for item cards and inventory slots.
(function(){
  var drag=null;
  var ghost=null;
  var startX=0,startY=0;
  var THRESHOLD=6;

  function itemName(el){
    var n=el && el.querySelector('.item-name');
    return n ? n.textContent.trim() : '';
  }

  function slotIndex(el){
    if(!el) return -1;
    var m=el.getAttribute('ondrop');
    var hit=m && m.match(/dropSlot\(event,\s*(\d+)\)/);
    return hit ? Number(hit[1]) : -1;
  }

  function makeGhost(source){
    ghost=source.cloneNode(true);
    ghost.removeAttribute('onclick');
    ghost.removeAttribute('ondragstart');
    ghost.removeAttribute('ondrop');
    ghost.removeAttribute('ondragover');
    ghost.style.position='fixed';
    ghost.style.pointerEvents='none';
    ghost.style.zIndex='99999';
    ghost.style.width=source.getBoundingClientRect().width+'px';
    ghost.style.height=source.getBoundingClientRect().height+'px';
    ghost.style.opacity='.85';
    ghost.style.transform='scale(1.04)';
    ghost.style.margin='0';
    document.body.appendChild(ghost);
    moveGhost(startX,startY);
  }

  function moveGhost(x,y){
    if(!ghost) return;
    ghost.style.left=(x-ghost.offsetWidth/2)+'px';
    ghost.style.top=(y-ghost.offsetHeight/2)+'px';
  }

  function cleanup(){
    if(ghost){ghost.remove();ghost=null;}
    document.querySelectorAll('.dragging').forEach(function(x){x.classList.remove('dragging')});
    drag=null;
  }

  function begin(source,type,index,name,e){
    drag={source:source,type:type,index:index,name:name,active:false,pointerId:e.pointerId};
    startX=e.clientX;startY=e.clientY;
  }

  document.addEventListener('pointerdown',function(e){
    if(e.button!==0) return;
    var item=e.target.closest && e.target.closest('.item-choice');
    if(item){
      var name=itemName(item);
      if(name) begin(item,'item',-1,name,e);
      return;
    }
    var slot=e.target.closest && e.target.closest('.inv-slot');
    if(slot){
      var idx=slotIndex(slot);
      if(idx>=0 && window.selected && selected.slots && selected.slots[idx]) begin(slot,'slot',idx,selected.slots[idx],e);
    }
  },true);

  document.addEventListener('pointermove',function(e){
    if(!drag || e.pointerId!==drag.pointerId) return;
    var dx=e.clientX-startX,dy=e.clientY-startY;
    if(!drag.active && Math.hypot(dx,dy)<THRESHOLD) return;
    if(!drag.active){
      drag.active=true;
      drag.source.classList.add('dragging');
      makeGhost(drag.source);
    }
    e.preventDefault();
    moveGhost(e.clientX,e.clientY);
  },{capture:true,passive:false});

  document.addEventListener('pointerup',function(e){
    if(!drag || e.pointerId!==drag.pointerId) return;
    var d=drag;
    if(d.active){
      e.preventDefault();
      var el=document.elementFromPoint(e.clientX,e.clientY);
      var target=el && el.closest ? el.closest('.inv-slot') : null;
      var to=slotIndex(target);
      if(to>=0 && window.selected && selected.slots){
        if(d.type==='item'){
          selected.slots[to]=d.name;
        }else if(d.type==='slot' && d.index!==to){
          var s=selected.slots;
          [s[d.index],s[to]]=[s[to],s[d.index]];
        }
        save();
        cleanup();
        renderEditor();
        return;
      }
    }
    cleanup();
  },true);

  document.addEventListener('pointercancel',cleanup,true);

  var style=document.createElement('style');
  style.textContent='.item-choice{cursor:grab;user-select:none;-webkit-user-select:none}.item-choice.dragging,.inv-slot.dragging{opacity:.4;cursor:grabbing}.inv-slot{user-select:none;-webkit-user-select:none}';
  document.head.appendChild(style);
})();
