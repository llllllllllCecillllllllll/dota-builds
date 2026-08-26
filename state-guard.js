// Storage integrity guard for saved builds.
(function(){
  'use strict';
  var KEY='dota-assistant-v2';
  try{
    var raw=localStorage.getItem(KEY);
    if(!raw)return;
    var state=JSON.parse(raw);
    if(!state||!Array.isArray(state.builds))return;

    var used={};
    state.builds=state.builds.map(function(b,index){
      b=(b&&typeof b==='object')?b:{};

      // Every build owns its own 9-slot array. Never reuse an array/reference
      // from another build and never leave slots 6-8 missing.
      var old=Array.isArray(b.slots)?b.slots.slice(0,9):[];
      b.slots=Array.from({length:9},function(_,i){return typeof old[i]==='string'?old[i]:''});

      // Every build owns its own timeline array as well.
      b.timeline=(Array.isArray(b.timeline)?b.timeline:[]).map(function(step){
        return {name:step&&typeof step.name==='string'?step.name:''};
      });

      // Repair accidental duplicate/missing IDs so Open/Delete always targets
      // exactly one build.
      var id=String(b.id||'');
      if(!id||used[id]){
        do{id=Date.now().toString(36)+Math.random().toString(36).slice(2)}while(used[id]);
        b.id=id;
      }
      used[id]=true;
      return b;
    });

    localStorage.setItem(KEY,JSON.stringify(state));
  }catch(e){
    // Never prevent the application from loading if localStorage is unavailable
    // or contains data from an older version.
  }
})();
