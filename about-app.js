(function(){
  'use strict';
  const VERSION='1.04';
  const DEVELOPER='Сабир';
  const CREATED='27.08.2026';
  const CHANGES={
    '1.04':['Добавлен раздел «О приложении».','Добавлен журнал версий с датами и изменениями.'],
    '1.03':['Добавлена расширенная база предметов и нейтральных предметов.','Исправлены категории предметов, навигация и локальная загрузка изображений.'],
    '1.02':['Исправлены стабильность создания и сохранения сборок, фильтры и дерево закупки.'],
    '1.01':['Добавлена базовая версия редактора сборок и локального каталога.']
  };
  window.DOTA_APP_INFO={VERSION,DEVELOPER,CREATED,CHANGES};
  window.showAbout=showAbout;
  window.showVersions=showVersions;
  function esc(s){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));}
  function modal(inner){const root=document.getElementById('modal');if(!root)return;root.innerHTML='<div class="modal"><div class="sheet about-sheet">'+inner+'</div></div>';}
  function showAbout(){
    modal('<div class="sheet-head"><div><h3>О приложении</h3><div class="muted">Dota Assistant</div></div><button type="button" class="close" data-about-close>Закрыть</button></div>'+
      '<div class="about-card"><div class="about-row"><span>Версия:</span><strong>'+esc(VERSION)+'</strong></div><div class="about-row"><span>Разработчик:</span><strong>'+esc(DEVELOPER)+'</strong></div><div class="about-row"><span>Дата версии:</span><strong>'+esc(CREATED)+'</strong></div></div>'+
      '<button type="button" class="about-link" data-show-versions>Версии и изменения <span>›</span></button>');
  }
  function showVersions(){
    const versions=Object.entries(CHANGES).map(([v,changes])=>'<div class="version-block"><div class="version-head"><strong>v'+esc(v)+'</strong><span>'+esc(v==='1.04'?CREATED:v==='1.03'?'26.08.2026':v==='1.02'?'26.08.2026':'26.08.2026')+'</span></div><ul>'+changes.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>').join('');
    modal('<div class="sheet-head"><div><h3>Версии</h3><div class="muted">История изменений</div></div><button type="button" class="close" data-about-close>Закрыть</button></div>'+versions);
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-about]');if(b){e.preventDefault();showAbout();return;}
    if(e.target.closest('[data-show-versions]')){showVersions();return;}
    if(e.target.closest('[data-about-close]')){const r=document.getElementById('modal');if(r)r.innerHTML='';}
  });
})();