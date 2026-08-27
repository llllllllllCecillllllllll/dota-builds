(function(){'use strict';
  /* Current Dota 2 shop taxonomy. Kept separate from the raw asset catalog so only real shop items are shown in shop categories. */
  var C={
    'Расходники':['Town Portal Scroll','Clarity','Faerie Fire','Smoke of Deceit','Observer Ward','Observer and Sentry Wards','Sentry Ward','Enchanted Mango','Healing Salve','Tango','Blood Grenade','Dust of Appearance','Bottle',"Aghanim's Shard"],
    'Атрибуты':['Iron Branch','Gauntlets of Strength','Slippers of Agility','Mantle of Intelligence','Circlet','Belt of Strength','Band of Elvenskin','Robe of the Magi','Crown','Ogre Axe','Blade of Alacrity','Staff of Wizardry','Diadem'],
    'Снаряжение':['Quelling Blade','Ring of Protection','Infused Raindrops','Orb of Venom','Orb of Blight','Orb of Frost','Blight Stone','Blades of Attack','Gloves of Haste','Chainmail','Helm of Iron Will','Broadsword','Blitz Knuckles','Javelin','Claymore','Mithril Hammer','Splintmail','Consecrated Wraps'],
    'Разное':['Ring of Regen',"Sage's Mask",'Magic Stick','Fluffy Hat','Wind Lace','Cloak','Boots of Speed','Gem of True Sight','Morbid Mask','Voodoo Mask','Shadow Amulet','Ghost Scepter','Blink Dagger','Ring of Health','Void Stone','Chasm Stone','Shawl','Wizard Hat'],
    'Потайная лавка':['Ring of Tarrasque','Tiara of Selemene','Cornucopia','Energy Booster','Vitality Booster','Point Booster','Talisman of Evasion','Platemail','Hyperstone','Ultimate Orb','Demon Edge','Mystic Staff','Reaver','Eaglesong','Sacred Relic'],
    'Аксессуары':['Magic Wand','Null Talisman','Wraith Band','Bracer','Soul Ring','Orb of Corrosion','Falcon Blade','Power Treads','Phase Boots','Oblivion Staff','Perseverance','Mask of Madness','Hand of Midas','Boots of Travel','Boots of Travel 2','Helm of the Dominator','Moon Shard'],
    'Поддержка':['Buckler','Ring of Basilius','Headdress','Urn of Shadows','Tranquil Boots','Pavise','Arcane Boots','Drum of Endurance','Mekansm',"Vladmir's Offering",'Holy Locket','Spirit Vessel','Essence Distiller','Pipe of Insight','Guardian Greaves','Boots of Bearing','Parasma'],
    'Магия':['Veil of Discord','Glimmer Cape','Force Staff','Aether Lens',"Eul's Scepter of Divinity",'Rod of Atos','Dagon','Dagon 2','Dagon 3','Dagon 4','Dagon 5','Orchid Malevolence','Solar Crest',"Aghanim's Scepter","Aghanim's Blessing",'Refresher Orb','Octarine Core','Scythe of Vyse','Gleipnir','Wind Waker',"Crella's Crozier"],
    'Броня':['Vanguard','Blade Mail','Aeon Disk','Soul Booster','Crimson Guard','Lotus Orb','Black King Bar','Hurricane Pike','Manta Style',"Linken's Sphere",'Shiva\'s Guard','Heart of Tarrasque','Assault Cuirass','Bloodstone','Helm of the Overlord','Eternal Shroud'],
    'Оружие':['Crystalys','Meteor Hammer','Armlet of Mordiggian','Skull Basher','Shadow Blade','Desolator','Battle Fury','Ethereal Blade','Nullifier','Monkey King Bar','Butterfly','Radiance','Daedalus','Silver Edge','Divine Rapier','Bloodthorn','Abyssal Blade',"Revenant's Brooch",'Disperser','Khanda','Witch Blade',"Hydra's Breath","Specialist's Array"],
    'Артефакты':['Dragon Lance','Sange','Yasha','Kaya','Echo Sabre','Maelstrom','Diffusal Blade','Mage Slayer','Phylactery',"Heaven's Halberd",'Kaya and Sange','Sange and Yasha','Yasha and Kaya','Satanic','Eye of Skadi','Mjollnir','Overwhelming Blink','Swift Blink','Arcane Blink','Harpoon']
  };
  var N=['Trusty Shovel','Occult Bracelet','Pig Pole','Mana Draught','Pollywog Charm','Spark of Courage',"Ripper's Lash",'Orb of Destruction','Essence Ring','Iron Talon','Gossamer Cape','Searing Signet',"Brigand's Blade","Tumbler's Toy",'Serrated Shiv','Nemesis Curse','Gale Guard','Gunpowder Gauntlet','Whisper of the Dread','Ninja Gear','Ogre Seal Totem','Crippling Crossbow','Magnifying Monocle','Ceremonial Robe','Mind Breaker','Pyrrhic Cloak','Stygian Desolator','Fallen Sky','Book of the Dead','Minotaur Horn','Spider Legs','Magic Lamp','Unrelenting Eye','Pirate Hat','Ash Legion Shield','Chipped Vest','Cloak of Flames',"Dagger of Ristul",'Stonefeather Satchel','Possessed Mask',"Forager's Kit",'Defiant Shell','Medallion of Courage','Seeds of Serenity',"Jidi Pollen Bag",'Psychic Headband','Spellslinger','Stormcrafter',"Partisan's Brand","Giant's Maul",'Rattlecage',"Idol of Scree'auk","Flayer's Bota",'Metamorphic Mandible','Dandelion Amulet',"Enchanter's Bauble","Prophet's Pendulum","Conjurer's Catalyst",'Dezun Bloodrite','Divine Regalia','Harmonizer','Witchbane'];
  var E=['Quickened','Vital','Brawny','Tough','Alert','Mystical','Greedy','Crude','Nimble','Keen-eyed','Titanic','Timeless','Evolved','Fleetfooted','Vampiric','Hulking','Audacious','Feverish','Manic'];
  function unique(a){var s=Object.create(null),o=[];(a||[]).forEach(function(x){if(x&&!s[x]){s[x]=1;o.push(x);}});return o;}
  function esc(s){return String(s==null?'':s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});}
  function allShop(){return unique(Object.keys(C).reduce(function(a,k){return a.concat(C[k]);},[]));}
  function allNeutral(){return unique(N.concat(E));}
  function matches(x,q){return !q||x.toLocaleLowerCase('ru-RU').indexOf(q)>=0;}
  function html(list){return unique(list).map(function(x){return '<button class="item-choice" data-item="'+esc(x)+'" draggable="true">'+(typeof imageTag==='function'?imageTag(x):'')+'<span class="item-name">'+esc(x)+'</span></button>';}).join('');}
  function renderCatalog(){
    var box=document.querySelector('.categories');if(!box)return;
    var wanted=['Все','Расходники','Атрибуты','Снаряжение','Разное','Потайная лавка','Аксессуары','Магия','Оружие','Поддержка','Броня','Артефакты','Нейтральные'];
    Array.prototype.slice.call(box.querySelectorAll('.cat')).forEach(function(b){if(wanted.indexOf(b.dataset.category)<0)b.remove();});
    wanted.forEach(function(k){if(!box.querySelector('[data-category="'+k+'"]')){var b=document.createElement('button');b.className='cat';b.dataset.category=k;b.textContent=k;box.appendChild(b);}});
    Array.prototype.slice.call(box.querySelectorAll('.cat')).forEach(function(b){b.classList.toggle('active',b.dataset.category===itemCategory);});
    var input=document.getElementById('itemSearch'),q=(input?input.value:itemQuery||'').trim().toLocaleLowerCase('ru-RU'),cat=itemCategory||'Все';
    var list=cat==='Все'?allShop().concat(allNeutral()):cat==='Нейтральные'?allNeutral():(C[cat]||[]);
    var grid=document.getElementById('itemGrid');if(grid)grid.innerHTML=html(list.filter(function(x){return matches(x,q);}));
    window.DOTA_EXTRA_CATALOG={};Object.keys(C).forEach(function(k){window.DOTA_EXTRA_CATALOG[k]=C[k].slice();});window.DOTA_EXTRA_CATALOG['Нейтральные']=allNeutral();
  }
  window.__DOTA_SHOP_CATEGORIES__=C;window.__DOTA_SHOP_NEUTRALS__=allNeutral();
  document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('.categories .cat');if(!b)return;e.preventDefault();e.stopImmediatePropagation();itemCategory=b.dataset.category||'Все';renderCatalog();},true);
  document.addEventListener('input',function(e){if(e.target&&e.target.id==='itemSearch'){e.preventDefault();e.stopImmediatePropagation();itemQuery=e.target.value||'';renderCatalog();}},true);
  function start(){renderCatalog();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();