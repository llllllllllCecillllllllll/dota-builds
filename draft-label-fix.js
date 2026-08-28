/* Rename the Draft Helper label to simply "Драфт". */
(function(){
  const replace = () => {
    const root = document.getElementById('app');
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (node.nodeValue && node.nodeValue.includes('Драфт-хелпер')) {
        node.nodeValue = node.nodeValue.replaceAll('Драфт-хелпер', 'Драфт');
      }
    });
  };
  replace();
  new MutationObserver(replace).observe(document.getElementById('app') || document.body, {childList:true,subtree:true});
})();
