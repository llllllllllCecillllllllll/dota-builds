(function(){
'use strict';
const baseRender=window.render;
if(typeof baseRender!=='function')return;
window.render=function(){
  if(typeof state!=='undefined'&&state.page==='draft'&&typeof window.renderDraft==='function')return window.renderDraft();
  const out=baseRender.apply(this,arguments);
  if(typeof state!=='undefined'&&state.page==='home'){
    document.querySelectorAll('#app h2').forEach(function(h){if(h.textContent==='Драфт-хелпер')h.textContent='Драфт'});
  }
  return out;
};
})();
