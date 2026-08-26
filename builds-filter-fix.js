/* Dota Assistant — stable builds search/filter layer */
(function(){
  'use strict';

  let searchTimer = 0;
  let activeRole = 'Все';
  let activeQuery = '';

  function cards(){ return Array.from(document.querySelectorAll('.build-card')); }

  function cardData(card){
    const name = (card.querySelector('.build-name')?.textContent || '').trim();
    const hero = (card.querySelector('.build-hero')?.textContent || '').trim();
    const meta = (card.querySelector('.build-meta')?.textContent || '').trim();
    const m = meta.match(/(?:Позиция|Position)\s*([1-5])/i);
    return {name, hero, role:m ? m[1] : ''};
  }

  function apply(){
    const q = activeQuery.trim().toLocaleLowerCase('ru-RU');
    cards().forEach(card=>{
      const d = cardData(card);
      const text = (d.name + ' ' + d.hero).toLocaleLowerCase('ru-RU');
      const searchOK = !q || text.includes(q);
      const roleOK = activeRole === 'Все' || d.role === activeRole;
      card.hidden = !(searchOK && roleOK);
    });

    const grid = document.querySelector('.build-grid');
    if(!grid) return;
    const visible = cards().filter(c=>!c.hidden).length;
    let empty = grid.querySelector('.filter-empty');
    if(!visible){
      if(!empty){
        empty=document.createElement('div');
        empty.className='home-card filter-empty';
        empty.innerHTML='<h2>Ничего не найдено</h2><p>Измени поиск или фильтр позиции.</p>';
        grid.appendChild(empty);
      }
    } else if(empty) empty.remove();
  }

  function syncButtons(){
    document.querySelectorAll('[data-role-filter]').forEach(btn=>{
      btn.classList.toggle('active', btn.dataset.roleFilter === activeRole);
    });
  }

  function init(){
    const input=document.getElementById('buildSearch');
    if(input){
      activeQuery=input.value || '';
      input.addEventListener('input', function(){
        activeQuery=this.value;
        clearTimeout(searchTimer);
        searchTimer=setTimeout(apply, 40);
      }, {passive:true});
    }
    syncButtons();
    apply();
  }

  // Capture the position buttons before the old application handlers can interfere.
  document.addEventListener('click', function(e){
    const btn=e.target.closest('[data-role-filter]');
    if(!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    activeRole=btn.dataset.roleFilter || 'Все';
    syncButtons();
    apply();
  }, true);

  // The app replaces #app when navigating. Re-initialize whenever the builds page appears.
  const observer=new MutationObserver(function(){
    if(document.getElementById('buildSearch')) init();
  });
  observer.observe(document.getElementById('app') || document.body,{childList:true,subtree:true});

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
