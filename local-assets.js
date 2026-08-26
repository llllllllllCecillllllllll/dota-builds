window.DOTA_LOCAL_ASSETS={heroes:{},items:{},ready:false};
(function(){
  function localPath(kind,name){
    const map=window.DOTA_LOCAL_ASSETS[kind]||{};
    return map[name] ? map[name] : '';
  }
  window.wikiFile=function(){return ''};
  window.itemImage=function(name){return localPath('items',name)};
  window.heroImage=function(name){return localPath('heroes',name)};
  window.imageTag=function(name,type='item'){
    const src=type==='hero'?window.heroImage(name):window.itemImage(name);
    const cls=type==='hero'?'hero-art':'item-art';
    if(!src) return `<span class="${cls} no-image">${esc(name)}</span>`;
    return `<img class="${cls}" src="${src}" alt="${esc(name)}" loading="eager" decoding="async" onerror="this.style.display='none';this.parentElement.classList.add('no-image')">`;
  };
  fetch('assets/manifest.json',{cache:'no-store'}).then(r=>r.json()).then(m=>{
    window.DOTA_LOCAL_ASSETS.heroes=m.heroes||{};
    window.DOTA_LOCAL_ASSETS.items=m.items||{};
    window.DOTA_LOCAL_ASSETS.ready=true;
    if(typeof render==='function') render();
  }).catch(e=>console.warn('Local Dota assets manifest unavailable',e));
})();
