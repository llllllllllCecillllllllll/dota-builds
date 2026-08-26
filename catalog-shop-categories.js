(function(){'use strict';
  /* Dota shop taxonomy: Basics -> Consumables, Attributes, Equipment, Miscellaneous, Secret Shop; Upgrades -> Accessories, Support, Magical, Armor, Weapons, Artifacts. Neutral items are separate. */
  var C={
    'Расходники':['Observer Ward','Blood Grenade','Clarity','Sentry Ward','Smoke of Deceit','Enchanted Mango','Faerie Fire','Dust of Appearance','Tango','Healing Salve','Town Portal Scroll','Bottle','Aghanim\'s Shard'],
    'Атрибуты':['Iron Branch','Gauntlets of Strength','Mantle of Intelligence','Slippers of Agility','Circlet','Band of Elvenskin','Belt of Strength','Crown','Robe of the Magi','Blade of Alacrity','Diadem','Ogre Axe','Staff of Wizardry'],
    'Снаряжение':['Quelling Blade','Ring of Protection','Infused Raindrops','Orb of Venom','Orb of Blight','Blades of Attack','Gloves of Haste','Chainmail','Javelin','Helm of Iron Will','Blitz Knuckles','Broadsword','Claymore','Mithril Hammer'],
    'Разное':['Ring of Regen','Sage\'s Mask','Fluffy Hat','Wind Lace','Magic Stick','Boots of Speed','Ring of Health','Voodoo Mask','Cloak','Gem of True Sight','Morbid Mask','Shadow Amulet','Ghost Scepter','Ring of Tarrasque','Tiara of Selemene','Blink Dagger'],
    'Потайная лавка':['Energy Booster','Vitality Booster','Cornucopia','Point Booster','Talisman of Evasion','Platemail','Hyperstone','Demon Edge','Eaglesong','Mystic Staff','Reaver','Ultimate Orb','Sacred Relic'],
    'Аксессуары':['Bracer','Null Talisman','Wraith Band','Magic Wand','Soul Ring','Orb of Corrosion','Falcon Blade','Perseverance','Power Treads','Phase Boots','Oblivion Staff','Mask of Madness','Hand of Midas','Boots of Travel','Helm of the Dominator','Moon Shard','Helm of the Overlord','Boots of Travel 2'],
    'Поддержка':['Buckler','Headdress','Ring of Basilius','Urn of Shadows','Tranquil Boots','Arcane Boots','Pavise','Drum of Endurance','Mekansm','Vladmir\'s Offering','Holy Locket','Spirit Vessel','Pipe of Insight','Boots of Bearing','Guardian Greaves','Parasma'],
    'Магия':['Veil of Discord','Glimmer Cape','Force Staff','Rod of Atos','Aether Lens','Eul\'s Scepter of Divinity','Solar Crest','Witch Blade','Dagon','Dagon 2','Dagon 3','Dagon 4','Dagon 5','Orchid Malevolence','Aghanim\'s Scepter','Octarine Core','Refresher Orb','Scythe of Vyse','Gleipnir','Aghanim\'s Blessing','Wind Waker','Ethereal Blade'],
    'Броня':['Vanguard','Blade Mail','Aeon Disk','Soul Booster','Eternal Shroud','Crimson Guard','Lotus Orb','Black King Bar','Bloodstone','Hurricane Pike','Manta Style','Linken\'s Sphere','Assault Cuirass','Shiva\'s Guard','Heart of Tarrasque'],
    'Оружие':['Crystalys','Armlet of Mordiggian','Meteor Hammer','Skull Basher','Shadow Blade','Desolator','Battle Fury','Nullifier','Monkey King Bar','Radiance','Revenant\'s Brooch','Daedalus','Ethereal Blade','Khanda','Butterfly','Silver Edge','Abyssal Blade','Divine Rapier','Disperser','Bloodthorn'],
    'Артефакты':['Dragon Lance','Kaya','Sange','Yasha','Phylactery','Diffusal Blade','Echo Sabre','Mage Slayer','Maelstrom','Heaven\'s Halberd','Yasha and Kaya','Kaya and Sange','Sange and Yasha','Harpoon','Satanic','Eye of Skadi','Mjollnir','Arcane Blink','Overwhelming Blink','Swift Blink']
  };
  /* Local asset/catalog naming aliases. */
  C['Снаряжение']=C['Снаряжение'].map(function(x){return x==='Blight Stone'?'Orb of Blight':x;});
  C['Магия']=C['Магия'].map(function(x){return x==='Eul\'s Scepter of Divinity'?'Eul\'s Scepter':x;});

  var N=['Occult Bracelet','Kobold Cup','Chipped Vest','Pollywog Charm','Dormant Curio','Duelist Gloves','Weighted Dice','Ash Legion Shield','Dagger of Ristul','Stonefeather Satchel','Possessed Mask','Forager\'s Kit','Essence Ring','Mana Draught','Poor Man\'s Shield','Searing Signet','Tumbler\'s Toy','Defiant Shell','Crippling Crossbow','Medallion of Courage','Seeds of Serenity','Serrated Shiv','Gunpowder Gauntlet','Jidi Pollen Bag','Psychic Headband','Unrelenting Eye','Cloak of Flames','Spellslinger','Stormcrafter','Partisan\'s Brand','Giant\'s Maul','Rattlecage','Idol of Scree\'auk','Flayer\'s Bota','Metamorphic Mandible','Dandelion Amulet','Enchanter\'s Bauble','Prophet\'s Pendulum','Conjurer\'s Catalyst','Stygian Desolator','Fallen Sky','Book of the Dead','Minotaur Horn','Spider Legs','Riftshadow Prism','Dezun Bloodrite','Divine Regalia','Harmonizer','Witchbane'];
  var E=['Quickened','Vital','Brawny','Tough','Alert','Mystical','Greedy','Crude','Nimble','Keen-eyed','Titanic','Timeless','Evolved','Fleetfooted','Vampiric','Hulking','Audacious','Feverish','Manic'];
  function unique(a){var s=Object.create(null),o=[];(a||[]).forEach(function(x){if(x&&!s[x]){s[x]=1;o.push(x);}});return o;}
  function esc(s){return String(s==null?'':s).replace(/[&<>\"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c];});}
  function allShop(){return unique(Object.keys(C).reduce(function(a,k){return a.concat(C[k]);},[]));}
  function allNeutral(){return unique(N.concat(E));}
  function matches(x,q){return !q||x.toLocaleLowerCase('ru-RU').indexOf(q)>=0;}
  function html(list){return unique(list).map(function(x){return '<button class="item-choice" data-item="'+esc(x)+'" draggable="true">'+(typeof imageTag==='function'?imageTag(x):'')+'<span class="item-name">'+esc(x)+'</span></button>';}).join('');}
  function renderCatalog(){
    var box=document.querySelector('.categories');
    if(!box)return;
    var wanted=['Все','Расходники','Атрибуты','Снаряжение','Разное','Потайная лавка','Аксессуары','Магия','Оружие','Поддержка','Броня','Артефакты','Нейтральные'];
    Array.prototype.slice.call(box.querySelectorAll('.cat')).forEach(function(b){if(wanted.indexOf(b.dataset.category)<0)b.remove();});
    wanted.forEach(function(k){if(!box.querySelector('[data-category="'+k+'"]')){var b=document.createElement('button');b.className='cat';b.dataset.category=k;b.textContent=k;box.appendChild(b);}});
    Array.prototype.slice.call(box.querySelectorAll('.cat')).forEach(function(b){b.classList.toggle('active',b.dataset.category===itemCategory);});
    var input=document.getElementById('itemSearch'),q=(input?input.value:itemQuery||'').trim().toLocaleLowerCase('ru-RU');
    var cat=itemCategory||'Все';
    var list=cat==='Все'?allShop().concat(allNeutral()):cat==='Нейтральные'?allNeutral():(C[cat]||[]);
    var grid=document.getElementById('itemGrid');if(grid)grid.innerHTML=html(list.filter(function(x){return matches(x,q);}));
    window.DOTA_EXTRA_CATALOG={};Object.keys(C).forEach(function(k){window.DOTA_EXTRA_CATALOG[k]=C[k].slice();});window.DOTA_EXTRA_CATALOG['Нейтральные']=allNeutral();
  }
  window.__DOTA_SHOP_CATEGORIES__=C;
  window.__DOTA_SHOP_NEUTRALS__=allNeutral();
  document.addEventListener('pointerdown',function(e){var b=e.target.closest&&e.target.closest('.categories .cat');if(!b)return;e.preventDefault();e.stopImmediatePropagation();itemCategory=b.dataset.category||'Все';renderCatalog();},true);
  document.addEventListener('input',function(e){if(e.target&&e.target.id==='itemSearch'){itemQuery=e.target.value||'';renderCatalog();}},true);
  function start(){renderCatalog();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();