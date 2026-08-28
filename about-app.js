(function(){
'use strict';
const VERSION='1.05',DEVELOPER='Сабир',CREATED='28.08.2026';
const CHANGES={'1.05':['Обновлён визуальный стиль интерфейса.','Добавлена тёмная тема с туманным лесом ночью.','Добавлена светлая тема — туманный лес на рассвете.','Добавлено переключение темы одним касанием в разделе «О приложении».','Красные акцентные элементы приведены к цвету логотипа и получили потёртую текстуру.'],'1.04':['Добавлен раздел «О приложении».','Добавлен журнал версий с датами и изменениями.'],'1.03':['Добавлена расширенная база предметов и нейтральных предметов.','Исправлены категории предметов, навигация и локальная загрузка изображений.'],'1.02':['Исправлены стабильность создания и сохранения сборок, фильтры и дерево закупки.'],'1.01':['Добавлена базовая версия редактора сборок и локального каталога.']};
const THEME_KEY='dota-assistant-theme';
window.DOTA_APP_INFO={VERSION,DEVELOPER,CREATED,CHANGES};
window.showAbout=showAbout;window.showVersions=showVersions;
function esc(s){return String(s).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));}
function getTheme(){return localStorage.getItem(THEME_KEY)==='light'?'light':'dark';}
function applyTheme(theme){theme=theme==='light'?'light':'dark';document.documentElement.dataset.theme=theme;document.body?.setAttribute('data-theme',theme);localStorage.setItem(THEME_KEY,theme);const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=theme==='light'?'#dfe7e7':'#080b10';}
function ensureTheme(){applyTheme(getTheme());}
function ensureStyles(){if(document.getElementById('about-app-styles'))return;const s=document.createElement('style');s.id='about-app-styles';s.textContent=`
:root{--da-red:#d91f24;--da-red-dark:#9e171b;--da-red-soft:#7d171a}
html,body{min-height:100%;transition:background-color .25s,color .25s}
body{background:#080b10!important;background-image:radial-gradient(ellipse at 50% 35%,rgba(54,72,70,.30),transparent 48%),linear-gradient(180deg,rgba(5,9,13,.82),rgba(8,12,15,.94)),repeating-linear-gradient(74deg,transparent 0 86px,rgba(36,51,51,.14) 87px 91px,transparent 92px 150px)!important;background-attachment:fixed!important}
body:before{content:'';position:fixed;z-index:-1;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 72%,rgba(114,130,124,.12),transparent 42%),linear-gradient(90deg,rgba(0,0,0,.45),transparent 25%,transparent 75%,rgba(0,0,0,.45));}
.app{position:relative}
.primary,.cat.active,.role.active,.position-select button.active,.build-role-filter button.active{background:var(--da-red)!important;color:#fff!important;border-color:var(--da-red)!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 4px 14px rgba(120,0,0,.20)!important}
.primary{background-image:repeating-linear-gradient(128deg,transparent 0 46px,rgba(0,0,0,.16) 47px 49px,transparent 50px 105px)!important}
.ghost.danger{color:#ff5257!important}
.about-sheet .about-card{margin-top:14px;display:grid;gap:8px;background:#111922;border:1px solid #263341;border-radius:12px;padding:14px}
.about-sheet .about-row{display:flex;align-items:baseline;gap:8px;line-height:1.35}.about-sheet .about-row span{color:#aeb9c7}.about-sheet .about-row strong{color:#f1f4f7}
.about-sheet .about-link,.theme-toggle{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:10px;padding:11px 13px;background:#1a2430!important;color:#e7edf3!important;border:1px solid #2c3948!important;border-radius:9px;cursor:pointer}
.theme-toggle .theme-state{font-size:12px;color:#9ca9b8}.theme-toggle .theme-icon{font-size:17px}
.about-sheet .about-link:hover,.theme-toggle:hover{background:#202c38!important}
.about-sheet .version-block{padding:9px 0 12px}.about-sheet .version-head{display:flex;align-items:baseline;gap:8px;margin-bottom:5px}.about-sheet .version-head strong{font-size:16px;color:#f1f4f7}.about-sheet .version-head span{font-size:13px;color:#aeb9c7}.about-sheet ul{margin:5px 0 0;padding-left:24px}.about-sheet li{margin:4px 0}
html[data-theme="light"] body{color:#182028!important;background:#dfe7e7!important;background-image:radial-gradient(ellipse at 50% 38%,rgba(255,255,255,.82),transparent 48%),linear-gradient(180deg,rgba(226,234,233,.88),rgba(181,197,194,.90)),repeating-linear-gradient(74deg,transparent 0 86px,rgba(76,92,89,.12) 87px 91px,transparent 92px 150px)!important}
html[data-theme="light"] body:before{background:radial-gradient(ellipse at 50% 72%,rgba(255,255,255,.38),transparent 42%),linear-gradient(90deg,rgba(80,96,92,.10),transparent 25%,transparent 75%,rgba(80,96,92,.10))}
html[data-theme="light"] .home-card,html[data-theme="light"] .build-card,html[data-theme="light"] .draft-placeholder,html[data-theme="light"] .ward-placeholder{background:rgba(246,249,248,.88)!important;border-color:#c5d0ce!important;box-shadow:0 10px 30px rgba(39,55,53,.10)}
html[data-theme="light"] .sub,html[data-theme="light"] .muted,html[data-theme="light"] .build-meta{color:#5f6f73!important}
html[data-theme="light"] .title,html[data-theme="light"] .home-card h2,html[data-theme="light"] .build-card h3{color:#182028!important}
html[data-theme="light"] .field,html[data-theme="light"] .search{background:rgba(248,250,249,.92)!important;color:#182028!important;border-color:#bdc9c7!important}
html[data-theme="light"] .build-role-filter button,html[data-theme="light"] .cat,html[data-theme="light"] .ghost,html[data-theme="light"] .role,html[data-theme="light"] .position-select button{background:rgba(239,244,243,.94)!important;color:#56666b!important;border-color:#c5d0ce!important}
html[data-theme="light"] .bottom-nav{background:rgba(244,248,247,.92)!important;border-color:#c4cfcd!important;box-shadow:0 10px 30px rgba(34,48,47,.16)}
html[data-theme="light"] .nav-btn{color:#69787c!important}.nav-btn.active{color:var(--da-red)!important;border-color:rgba(217,31,36,.28)!important}
html[data-theme="light"] .about-sheet{background:#f4f8f7!important;color:#182028!important}.about-sheet .about-card{background:#e9efee!important;border-color:#c5d0ce!important}.about-sheet .about-row span{color:#647276}.about-sheet .about-row strong{color:#182028}.about-sheet .about-link,.theme-toggle{background:#e3eae9!important;color:#243035!important;border-color:#c5d0ce!important}.about-sheet .version-head strong{color:#182028}.about-sheet .version-head span,.about-sheet li{color:#59696d}
`;
document.head.appendChild(s);}
function modal(inner){ensureStyles();const root=document.getElementById('modal');if(!root)return;root.innerHTML='<div class="modal"><div class="sheet about-sheet">'+inner+'</div></div>';}
function showAbout(){ensureTheme();modal('<div class="sheet-head"><div><h3>О приложении</h3><div class="muted">Dota Assistant</div></div><button type="button" class="close" data-about-close>Закрыть</button></div><div class="about-card"><div class="about-row"><span>Версия:</span><strong>'+esc(VERSION)+'</strong></div><div class="about-row"><span>Разработчик:</span><strong>'+esc(DEVELOPER)+'</strong></div><div class="about-row"><span>Дата версии:</span><strong>'+esc(CREATED)+'</strong></div></div><button type="button" class="theme-toggle" data-theme-toggle><span>Тема интерфейса</span><span class="theme-state">'+(getTheme()==='dark'?'Тёмная':'Светлая')+' <span class="theme-icon">'+(getTheme()==='dark'?'☾':'☀')+'</span></span></button><button type="button" class="about-link" data-show-versions>Версии и изменения <span>›</span></button>');}
function showVersions(){const dates={'1.05':'28.08.2026','1.04':'27.08.2026','1.03':'26.08.2026','1.02':'26.08.2026','1.01':'26.08.2026'};const versions=Object.entries(CHANGES).map(([v,changes])=>'<div class="version-block"><div class="version-head"><strong>v'+esc(v)+'</strong><span>'+esc(dates[v])+'</span></div><ul>'+changes.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>').join('');modal('<div class="sheet-head"><div><h3>Версии</h3><div class="muted">История изменений</div></div><button type="button" class="close" data-about-close>Закрыть</button></div>'+versions);}
document.addEventListener('click',function(e){const b=e.target.closest('[data-about]');if(b){e.preventDefault();showAbout();return;}if(e.target.closest('[data-theme-toggle]')){applyTheme(getTheme()==='dark'?'light':'dark');showAbout();return;}if(e.target.closest('[data-show-versions]')){showVersions();return;}if(e.target.closest('[data-about-close]')){const r=document.getElementById('modal');if(r)r.innerHTML='';}});
ensureStyles();ensureTheme();
})();