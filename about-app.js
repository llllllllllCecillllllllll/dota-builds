(function(){
'use strict';

const VERSION='1.06';
const DEVELOPER='Сабир';
const CREATED='28.08.2026';
const THEME_KEY='dota-assistant-theme';
const CHANGES={
  '1.06':['Добавлена регистрация и вход по логину и паролю без email.','Добавлены пользовательские аккаунты и профиль.','Добавлено облачное сохранение сборок в аккаунте.','Сборки автоматически загружаются после входа в аккаунт.','Добавлено автоматическое сохранение и удаление сборок в облаке.','Исправлена работа профиля при переключении вкладок.','Убрана необходимость в ручной синхронизации сборок.','Название раздела «Драфт-хелпер» изменено на «Драфт».'],
  '1.05':['Обновлён визуальный стиль интерфейса.','Добавлена тёмная тема с туманным лесом ночью.','Добавлена светлая тема — туманный лес на рассвете.','Добавлено переключение темы одним касанием в разделе «О приложении».','Красные акцентные элементы получили потёртую текстуру и более тёмный оттенок.'],
  '1.04':['Добавлен раздел «О приложении».','Добавлен журнал версий с датами и изменениями.'],
  '1.03':['Добавлена расширенная база предметов и нейтральных предметов.','Исправлены категории предметов, навигация и локальная загрузка изображений.'],
  '1.02':['Исправлены стабильность создания и сохранения сборок, фильтры и дерево закупки.'],
  '1.01':['Добавлена базовая версия редактора сборок и локального каталога.']
};
const DATES={'1.06':'28.08.2026','1.05':'28.08.2026','1.04':'27.08.2026','1.03':'26.08.2026','1.02':'26.08.2026','1.01':'26.08.2026'};

window.DOTA_APP_INFO={VERSION,DEVELOPER,CREATED,CHANGES};
window.showAbout=showAbout;
window.showVersions=showVersions;

function esc(value){
  return String(value).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});
}
function getTheme(){return localStorage.getItem(THEME_KEY)==='light'?'light':'dark';}
function applyTheme(theme){
  theme=theme==='light'?'light':'dark';
  document.documentElement.dataset.theme=theme;
  document.body&&document.body.setAttribute('data-theme',theme);
  localStorage.setItem(THEME_KEY,theme);
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=theme==='light'?'#dce5e3':'#070b0e';
}
function installStyles(){
  if(document.getElementById('about-app-styles-v2'))return;
  const style=document.createElement('style');
  style.id='about-app-styles-v2';
  style.textContent=`
#modal .about-sheet{background:#10161e!important;color:#edf2f7!important;border-color:#293544!important;}
#modal .about-sheet .sheet-head h3{color:#edf2f7!important;}
#modal .about-sheet .muted{color:#8b98a7!important;}
#modal .about-sheet .close{background:#1b2530!important;color:#edf2f7!important;border:1px solid #293544!important;}
#modal .about-sheet .about-card{background:#151d27!important;color:#dce3ea!important;border:1px solid #293544!important;}
#modal .about-sheet .about-row{color:#aeb9c7!important;}
#modal .about-sheet .about-row span{color:#aeb9c7!important;}
#modal .about-sheet .about-row strong{color:#f2f5f8!important;}
#modal .about-sheet .theme-toggle,#modal .about-sheet .about-link{display:flex!important;align-items:center!important;justify-content:space-between!important;width:100%!important;min-height:44px!important;margin-top:10px!important;padding:11px 13px!important;background:#18212c!important;color:#edf2f7!important;border:1px solid #293544!important;border-radius:10px!important;box-shadow:none!important;appearance:none!important;-webkit-appearance:none!important;}
#modal .about-sheet .theme-toggle:hover,#modal .about-sheet .about-link:hover{background:#202b37!important;}
#modal .about-sheet .theme-state{color:#9ca9b8!important;font-size:12px!important;}
#modal .about-sheet .theme-icon{font-size:16px!important;}
#modal .about-sheet .version-block{padding:12px 0!important;border-bottom:1px solid #26313d!important;}
#modal .about-sheet .version-head strong{color:#edf2f7!important;}
#modal .about-sheet .version-head span{color:#8b98a7!important;}
#modal .about-sheet .version-block ul{color:#dce3ea!important;}
#modal .about-sheet .version-block li{color:#dce3ea!important;}
html[data-theme="light"] #modal .about-sheet{background:#f4f8f7!important;color:#182028!important;border-color:#c5d0ce!important;}
html[data-theme="light"] #modal .about-sheet .sheet-head h3{color:#182028!important;}
html[data-theme="light"] #modal .about-sheet .muted{color:#647276!important;}
html[data-theme="light"] #modal .about-sheet .close{background:#e3eae9!important;color:#243035!important;border-color:#c5d0ce!important;}
html[data-theme="light"] #modal .about-sheet .about-card{background:#e9efee!important;color:#243035!important;border-color:#c5d0ce!important;}
html[data-theme="light"] #modal .about-sheet .about-row,html[data-theme="light"] #modal .about-sheet .about-row span{color:#647276!important;}
html[data-theme="light"] #modal .about-sheet .about-row strong{color:#182028!important;}
html[data-theme="light"] #modal .about-sheet .theme-toggle,html[data-theme="light"] #modal .about-sheet .about-link{background:#e3eae9!important;color:#243035!important;border-color:#c5d0ce!important;}
html[data-theme="light"] #modal .about-sheet .theme-toggle:hover,html[data-theme="light"] #modal .about-sheet .about-link:hover{background:#d9e2e0!important;}
html[data-theme="light"] #modal .about-sheet .theme-state{color:#647276!important;}
html[data-theme="light"] #modal .about-sheet .version-block{border-bottom-color:#c5d0ce!important;}
html[data-theme="light"] #modal .about-sheet .version-head strong{color:#182028!important;}
html[data-theme="light"] #modal .about-sheet .version-head span,html[data-theme="light"] #modal .about-sheet .version-block li{color:#59696d!important;}
`;
  document.head.appendChild(style);
}
function render(inner){installStyles();applyTheme(getTheme());const root=document.getElementById('modal');if(!root)return;root.innerHTML='<div class="modal"><div class="sheet about-sheet">'+inner+'</div></div>';}
function header(title,subtitle){return '<div class="sheet-head"><div><h3>'+esc(title)+'</h3><div class="muted">'+esc(subtitle)+'</div></div><button type="button" class="close" data-about-close>Закрыть</button></div>';}
function showAbout(){const dark=getTheme()==='dark';render(header('О приложении','Dota Assistant')+'<div class="about-card"><div class="about-row"><span>Версия:</span><strong>'+esc(VERSION)+'</strong></div><div class="about-row"><span>Разработчик:</span><strong>'+esc(DEVELOPER)+'</strong></div><div class="about-row"><span>Дата версии:</span><strong>'+esc(CREATED)+'</strong></div></div><button type="button" class="theme-toggle" data-theme-toggle><span>Тема интерфейса</span><span class="theme-state">'+(dark?'Тёмная':'Светлая')+' <span class="theme-icon">'+(dark?'☾':'☀')+'</span></span></button><button type="button" class="about-link" data-show-versions><span>Версии и изменения</span><span>›</span></button>');}
function showVersions(){const versions=Object.entries(CHANGES).map(function(entry){const v=entry[0],changes=entry[1];return '<div class="version-block"><div class="version-head"><strong>v'+esc(v)+'</strong><span>'+esc(DATES[v]||'')+'</span></div><ul>'+changes.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';}).join('');render(header('Версии','История изменений')+versions);}
document.addEventListener('click',function(e){if(e.target.closest('[data-theme-toggle]')){applyTheme(getTheme()==='dark'?'light':'dark');showAbout();return;}if(e.target.closest('[data-show-versions]')){showVersions();return;}if(e.target.closest('[data-about-close]')){const root=document.getElementById('modal');if(root)root.innerHTML='';}});
installStyles();applyTheme(getTheme());
})();