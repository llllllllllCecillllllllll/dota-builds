window.DOTA_LOCAL_ASSETS={heroes:{},items:{},ready:false};
(function(){
  var HERO_ALIASES={"Outworld Destroyer":"Outworld Devourer","Ringmaster":"Ring Master"};
  var HERO_FALLBACKS={"Kez":"assets/heroes/kez.png","Largo":"assets/heroes/largo.png","Ringmaster":"assets/heroes/ringmaster.png","Underlord":"assets/heroes/abyssal_underlord.png"};
  var ITEM_ALIASES={"Kaya and Yasha":"Yasha and Kaya","Eul's Scepter":"Eul's Scepter of Divinity","Dagon 1":"Dagon","Dagon 2":"Dagon","Dagon 3":"Dagon","Dagon 4":"Dagon","Dagon 5":"Dagon","Boots of Travel 1":"Boots of Travel","Keen-Eyed":"Keen-eyed"};
  var ITEM_FALLBACKS={"Kaya and Yasha":"assets/items/yasha_and_kaya.png"};
  function lookup(map,name,aliases){if(map[name])return map[name];var a=aliases[name];if(a&&map[a])return map[a];return ''}
  function slug(name){return String(name||'').toLowerCase().replace(/&/g,'and').replace(/['’]/g,'').replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'')}
  function heroPath(name){var rel=lookup(window.DOTA_LOCAL_ASSETS.heroes,name,HERO_ALIASES);if(rel)return rel.indexOf('assets/')===0?rel:'assets/'+rel;return HERO_FALLBACKS[name]||''}
  function itemPath(name){var rel=lookup(window.DOTA_LOCAL_ASSETS.items,name,ITEM_ALIASES);if(rel)return rel.indexOf('assets/')===0?rel:'assets/'+rel;if(ITEM_FALLBACKS[name])return ITEM_FALLBACKS[name];var s=slug(ITEM_ALIASES[name]||name);return s?'assets/items/'+s+'.png':''}
  function escLocal(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]})}
  window.heroImage=heroPath;window.itemImage=itemPath;
  window.imageTag=function(name,type){type=type||'item';var src=type==='hero'?heroPath(name):itemPath(name),cls=type==='hero'?'hero-art':'item-art';if(!src)return '<span class="'+cls+' no-image">'+escLocal(name)+'</span>';return '<img class="'+cls+'" src="'+src+'" alt="'+escLocal(name)+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'no-image\')">'};
  fetch('assets/manifest.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('manifest '+r.status);return r.json()}).then(function(m){window.DOTA_LOCAL_ASSETS.heroes=m.heroes||{};window.DOTA_LOCAL_ASSETS.items=m.items||{};window.DOTA_LOCAL_ASSETS.ready=true}).catch(function(e){console.warn('Local Dota assets manifest unavailable',e)});
})();