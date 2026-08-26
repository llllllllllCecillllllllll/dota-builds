(function(){
  'use strict';
  var originalItemChoices=null;
  var SHOP_EXTRA=["Aeon Disk","Blade Mail","Blade of Alacrity","Blitz Knuckles","Blood Grenade","Chasm Stone","Consecrated Wraps","Crella's Crozier","Crown","Diadem","Diffusal Blade","Dragon Lance","Eaglesong","Energy Booster","Essence Distiller","Eul's Scepter of Divinity","Eye of Skadi","Falcon Blade","Fluffy Hat","Gem of True Sight","Ghost Scepter","Gloves of Haste","Hand of Midas","Headdress","Heart of Tarrasque","Helm of Iron Will","Helm of the Dominator","Helm of the Overlord","Hydra's Breath","Hyperstone","Infused Raindrops","Khanda","Mage Slayer","Magic Stick","Manta Style","Mask of Madness","Meteor Hammer","Moon Shard","Morbid Mask","Mystic Staff","Nullifier","Oblivion Staff","Ogre Axe","Orb of Blight","Orb of Corrosion","Orb of Frost","Orb of Venom","Orchid Malevolence","Parasma","Perseverance","Phylactery","Platemail","Point Booster","Quelling Blade","Reaver","Revenant's Brooch","Ring of Basilius","Ring of Health","Ring of Regen","Ring of Tarrasque","Rod of Atos","Sacred Relic","Sage's Mask","Sange","Shadow Amulet","Shawl","Skull Basher","Soul Booster","Soul Ring","Specialist's Array","Splintmail","Staff of Wizardry","Talisman of Evasion","Tiara of Selemene","Ultimate Orb","Vitality Booster","Vladmir's Offering","Void Stone","Voodoo Mask","Wind Lace","Witch Blade","Wizard Hat"];
  var NEUTRAL=["Occult Bracelet","Kobold Cup","Chipped Vest","Pollywog Charm","Dormant Curio","Duelist Gloves","Weighted Dice","Ash Legion Shield","Dagger of Ristul","Stonefeather Satchel","Possessed Mask","Forager's Kit","Essence Ring","Mana Draught","Poor Man's Shield","Searing Signet","Tumbler's Toy","Defiant Shell","Crippling Crossbow","Medallion of Courage","Seeds of Serenity","Serrated Shiv","Gunpowder Gauntlet","Jidi Pollen Bag","Psychic Headband","Unrelenting Eye","Cloak of Flames","Spellslinger","Stormcrafter","Partisan's Brand","Giant's Maul","Rattlecage","Idol of Scree'auk","Flayer's Bota","Metamorphic Mandible","Dandelion Amulet","Enchanter's Bauble","Prophet's Pendulum","Conjurer's Catalyst","Stygian Desolator","Fallen Sky","Book of the Dead","Minotaur Horn","Spider Legs","Riftshadow Prism","Dezun Bloodrite","Divine Regalia","Harmonizer","Witchbane"];
  var ENCHANT=["Quickened","Vital","Brawny","Tough","Alert","Mystical","Greedy","Crude","Nimble","Keen-eyed","Titanic","Timeless","Evolved","Fleetfooted","Vampiric","Hulking","Audacious","Feverish","Manic"];
  var HIDE=["Quarterstaff","Kaya and Yasha","Eul's Scepter","Philosopher's Stone","Arcane Ring","Pig Pole","Bullwhip","Vambrace","Ceremonial Robe","Ninja Gear","Giant's Ring","Mirror Shield"];
  function escLocal(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]||c;});}
  function unique(a){var seen=Object.create(null),out=[];(a||[]).forEach(function(x){x=String(x||'');if(x&&!seen[x]){seen[x]=1;out.push(x);}});return out;}
  function baseHtml(){var wrap=document.createElement('div');wrap.innerHTML=originalItemChoices();wrap.querySelectorAll('.item-choice[data-item]').forEach(function(el){if(HIDE.indexOf(el.dataset.item)>=0)el.remove();});return Array.from(wrap.children).map(function(el){return el.outerHTML;}).join('');}
  function html(list){return unique(list).map(function(x){return '<button class="item-choice" data-item="'+escLocal(x)+'" draggable="true">'+imageTag(x)+'<span class="item-name">'+escLocal(x)+'</span></button>';}).join('');}
  function allCurrent(){return unique([].concat(SHOP_EXTRA,NEUTRAL,ENCHANT));}
  function patch(){
    if(typeof window.itemChoices!=='function')return;
    if(!originalItemChoices)originalItemChoices=window.itemChoices;
    window.itemChoices=function(){
      var active=document.querySelector('.categories .cat.active');
      var cat=active?active.dataset.category:'Все';
      var input=document.getElementById('itemSearch');
      var q=(input?input.value:'').trim().toLocaleLowerCase('ru-RU');
      var matches=function(x){return !q||x.toLocaleLowerCase('ru-RU').includes(q);};
      if(cat==='Нейтральные')return html(NEUTRAL.filter(matches));
      if(cat==='Зачарования')return html(ENCHANT.filter(matches));
      var base=baseHtml();
      var extra=cat==='Все'?SHOP_EXTRA:[];
      return base+html(extra.filter(matches));
    };
  }
  function injectCategories(){
    var box=document.querySelector('.categories');if(!box)return;
    ['Нейтральные','Зачарования'].forEach(function(cat){if(!box.querySelector('[data-category="'+cat+'"]')){var b=document.createElement('button');b.className='cat';b.dataset.category=cat;b.textContent=cat;box.appendChild(b);}});
  }
  function exposeCleanCatalog(){window.DOTA_EXTRA_CATALOG={"Другое":SHOP_EXTRA.slice(),"Нейтральные":NEUTRAL.slice(),"Зачарования":ENCHANT.slice()};}
  function refreshGrid(){patch();injectCategories();exposeCleanCatalog();var grid=document.getElementById('itemGrid');if(grid&&typeof window.itemChoices==='function')grid.innerHTML=window.itemChoices();}
  function start(){patch();injectCategories();exposeCleanCatalog();if(document.getElementById('itemGrid'))refreshGrid();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();