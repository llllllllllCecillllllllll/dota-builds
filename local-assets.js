window.DOTA_LOCAL_ASSETS={heroes:{},items:{},ready:false};
(function(){
  var HERO_ALIASES={"Outworld Destroyer":"Outworld Devourer","Ringmaster":"Ringmaster"};
  var ITEM_ALIASES={"Kaya and Yasha":"Yasha and Kaya","Eul's Scepter":"Eul's Scepter of Divinity"};
  function lookup(map,name,aliases){
    if(map[name]) return map[name];
    var a=aliases[name];
    if(a&&map[a]) return map[a];
    return '';
  }
  function heroPath(name){
    var rel=lookup(window.DOTA_LOCAL_ASSETS.heroes,name,HERO_ALIASES);
    if(name==='Ringmaster' && !rel) rel='heroes/ringmaster.png';
    return rel?('assets/'+rel):'';
  }
  function itemPath(name){
    var rel=lookup(window.DOTA_LOCAL_ASSETS.items,name,ITEM_ALIASES);
    return rel?('assets/'+rel):'';
  }
  window.heroImage=heroPath;
  window.itemImage=itemPath;
  window.imageTag=function(name,type){
    type=type||'item';
    var src=type==='hero'?heroPath(name):itemPath(name);
    var cls=type==='hero'?'hero-art':'item-art';
    if(!src) return '<span class="'+cls+' no-image">'+esc(name)+'</span>';
    return '<img class="'+cls+'" src="'+src+'" alt="'+esc(name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'no-image\')">';
  };
  fetch('assets/manifest.json',{cache:'no-store'}).then(function(r){return r.json()}).then(function(m){
    window.DOTA_LOCAL_ASSETS.heroes=m.heroes||{};
    window.DOTA_LOCAL_ASSETS.items=m.items||{};
    window.DOTA_LOCAL_ASSETS.ready=true;
    if(typeof render==='function') render();
  }).catch(function(e){console.warn('Local Dota assets manifest unavailable',e)});
})();
