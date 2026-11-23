/* jederzeitsparen – Scroll-Einblendungen nach sandcastles.ai */
(function(){
  var root=document.documentElement;
  root.classList.add('ja-ok');
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){root.classList.remove('ja');return;}
  var sel='.hero > div > *,.hero-karte,.abschnitt > :not(.drei):not(.haendler),.drei > div,.haendler > *,.home > .cta,.ueber,.kopf > *,.wrap > section > :not(.blick),.blick > li,.step,main.text > *';
  var els=[].slice.call(document.querySelectorAll(sel));
  var far=['H1','H2'];
  var io=new IntersectionObserver(function(entries){
    var batch=entries.filter(function(e){return e.isIntersecting;}).map(function(e){return e.target;});
    batch.sort(function(a,b){return a.getBoundingClientRect().top-b.getBoundingClientRect().top||a.getBoundingClientRect().left-b.getBoundingClientRect().left;});
    batch.forEach(function(el,i){
      el.style.setProperty('--d',Math.min(i,8)*70+'ms');
      if(far.indexOf(el.tagName)>-1||el.classList.contains('hero-karte'))el.classList.add('far');
      el.classList.add('jz-in');io.unobserve(el);
    });
  },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
  els.forEach(function(el){io.observe(el);});
  /* Sprunglinks (#guides usw.): Ziel sofort sichtbar machen */
  function showHash(){var t=location.hash&&document.querySelector(location.hash);if(!t)return;els.forEach(function(el){if(t.contains(el)||el.contains(t)){el.classList.add('jz-in');io.unobserve(el);}});}
  window.addEventListener('hashchange',showHash);showHash();
})();
