(function(){try{var t=localStorage.getItem('saged-theme');if(!t){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();

(function(){
  var btn = document.getElementById('themeBtn');
  if(btn){
    btn.addEventListener('click', function(){
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      try{ localStorage.setItem('saged-theme', cur); }catch(e){}
    });
  }
  document.querySelectorAll('.nav-mobile a').forEach(function(a){
    a.addEventListener('click', function(){ document.getElementById('nav').classList.remove('open'); });
  });
  var track = document.getElementById('marqueeTrack');
  if(track){ track.innerHTML += track.innerHTML; }
  document.querySelectorAll('.flip').forEach(function(c){
    c.addEventListener('click', function(){ c.classList.toggle('flipped'); });
    c.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); c.classList.toggle('flipped'); }
    });
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var el = e.target;
        var target = parseInt(el.getAttribute('data-count'),10);
        var prefix = el.getAttribute('data-prefix') || '';
        var suffixEl = el.querySelector('.suffix');
        var suffixHTML = suffixEl ? suffixEl.outerHTML : '';
        var dur = 1300, start = null;
        function step(ts){
          if(!start) start = ts;
          var p = Math.min((ts-start)/dur,1);
          el.innerHTML = prefix + Math.floor(p*target) + suffixHTML;
          if(p<1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      }
    });
  }, {threshold:.4});
  document.querySelectorAll('.stat-num').forEach(function(el){ cio.observe(el); });
  var vid = document.getElementById('denisePreview');
  var fallback = document.getElementById('videoFallback');
  if(vid){
    vid.addEventListener('loadeddata', function(){
      vid.style.display = 'block';
      if(fallback) fallback.style.display = 'none';
      vid.setAttribute('controls','');
      vid.setAttribute('autoplay','');
    });
    vid.addEventListener('error', function(){
      vid.style.display = 'none';
      if(fallback) fallback.style.display = 'block';
    });
    vid.load();
  }
})();

(function(){
  var panel=document.getElementById('askPanel'),
      frame=document.getElementById('askFrame'),
      closeBtn=document.getElementById('askClose'),
      restart=document.getElementById('askRestart'),
      again=document.getElementById('askNew');
  if(!panel||!frame) return;

  var BASE='https://paymegpt.com/agents/47699893/embed';
  var IDLE=120000;
  var timer=null, started=false;

  function fresh(){ frame.src = BASE + '?s=' + Date.now() + Math.random().toString(36).slice(2,8); }
  function endChat(){
    clearTimeout(timer); timer=null; started=false;
    frame.src='about:blank';
    panel.className='ask-inline off';
    if(restart) restart.className='ask-restart on';
  }
  function newChat(){
    if(restart) restart.className='ask-restart';
    panel.className='ask-inline';
    fresh(); started=false;
    clearTimeout(timer); timer=null;
  }
  function kick(){ if(!started) return; clearTimeout(timer); timer=setTimeout(endChat, IDLE); }
  function begin(){ if(started) return; started=true; kick(); }

  fresh();

  window.addEventListener('blur', function(){
    setTimeout(function(){ if(document.activeElement === frame){ begin(); kick(); } }, 0);
  });
  ['mousemove','keydown','click','scroll','touchstart'].forEach(function(ev){
    document.addEventListener(ev, function(){
      if(document.activeElement === frame){ begin(); }
      kick();
    }, {passive:true});
  });
  setInterval(function(){ if(document.activeElement === frame){ begin(); kick(); } }, 4000);

  if(closeBtn) closeBtn.addEventListener('click', endChat);
  if(again) again.addEventListener('click', newChat);
  window.addEventListener('pageshow', function(e){ if(e.persisted) newChat(); });
})();