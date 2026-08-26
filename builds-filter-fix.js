/* Dota Assistant — stable builds search/filter layer v2 */
(function(){
'use strict';
let activeRole='Все',activeQuery='',boundInput=null,emptyNode=null;
function cards(){return Array.from(document.querySelectorAll('.build-card'))}
function cardData(card){const name=(card.querySelector('.build-name')?.textContent||'').trim(),hero=(card.querySelector('.build-hero')?.textContent||'').trim(),meta=(card.querySelector('.build-meta')?.textContent||'').trim(),m=meta.match(/(?:Позиция|Position)\s*([1-5])/i);return{name,hero,role:m?m[1]:''}}
function apply(){const q=activeQuery.trim().toLocaleLowerCase('ru-RU');let visible=0;cards().forEach(card=>{const d=cardData(card),text=(d.name+' '+d.hero).toLocaleLowerCase('ru-RU'),show=(!q||text.includes(q))&&(activeRole==='Все'||d.role===activeRole);card.hidden=!show;if(show)visible++});const grid=document.querySelector('.build-grid');if(!grid)return;if(!visible){if(!emptyNode||!emptyNode.isConnected){emptyNode=document.createElement('div');emptyNode.className='home-card filter-empty';emptyNode.innerHTML='<h2>Ничего не найдено</h2><p>Измени поиск или фильтр позиции.</p>';grid.appendChild(emptyNode)}}else if(emptyNode&&emptyNode.isConnected)emptyNode.remove()}
function syncButtons(){document.querySelectorAll('[data-role-filter]').forEach(btn=>btn.classList.toggle('active',btn.dataset.roleFilter===activeRole))}
function bindInput(input){if(!input||boundInput===input)return;boundInput=input;activeQuery=input.value||'';input.addEventListener('input',function(){activeQuery=this.value;apply()})}
document.addEventListener('input',function(e){const input=e.target.closest?.('#buildSearch');if(!input)return;e.stopImmediatePropagation();activeQuery=input.value;apply()},true);
document.addEventListener('click',function(e){const btn=e.target.closest('[data-role-filter]');if(!btn)return;e.preventDefault();e.stopImmediatePropagation();activeRole=btn.dataset.roleFilter||'Все';syncButtons();apply()},true);
function init(){const input=document.getElementById('buildSearch');if(!input)return;bindInput(input);syncButtons();apply()}
const observer=new MutationObserver(function(){const input=document.getElementById('buildSearch');if(input&&input!==boundInput){boundInput=null;emptyNode=null;init()}});observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();