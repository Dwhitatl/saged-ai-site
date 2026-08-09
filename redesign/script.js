(function(){try{var t=localStorage.getItem('saged-theme');if(!t){t=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();

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

(function () {
    const CHAT_COLOR = '#0C9C83';
    const ACCOUNT_ID = '1605006';
    const CHATBOT_ID = 'TPMVAgTlLyk';
    const BUTTON_IMAGE_URL = 'https://storage.googleapis.com/wttus/assets/57/a/1605006/images/Avator-for%20Chat%20bubble%202-16-2025.png';
    let isChatOpen = false;
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        @keyframes floatButton { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        #chat-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background:transparent; z-index:9998; display:none; }
        #chat-container { position: fixed; bottom:0; left:50%; transform:translate(-50%,110%); width:360px; height:600px; background:#fff; border-radius:20px; overflow:hidden; z-index:9999; display:flex; flex-direction:column; transition:transform .6s ease, opacity .6s ease; opacity:0; box-shadow:0 24px 70px rgba(0,0,0,.35); }
        @media(max-width:768px){ #chat-container{ width:100%; height:100%; border-radius:20px; left:0; top:0; transform:translate(0,110%);} }
        #chat-button { position:fixed; bottom:20px; right:20px; background:#fff; border:none; border-radius:50%; width:62px; height:62px; cursor:pointer; z-index:10000; box-shadow:0 6px 24px rgba(12,156,131,.45); animation:floatButton 3s infinite ease; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        #chat-icon.rotate-right { transition:transform .5s; transform:rotate(90deg); }
        .close-chat { position:absolute; top:10px; right:10px; width:35px; height:35px; background:transparent; color:#08111A; border:none; font-size:30px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
    `;
    document.head.appendChild(styleSheet);
    const overlay = document.createElement('div');
    overlay.id = 'chat-overlay';
    document.body.appendChild(overlay);
    const container = document.createElement('div');
    container.id = 'chat-container';
    if (window.innerWidth <= 768) {
        container.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:#fff; border-radius:20px; overflow:hidden; z-index:9999; display:flex; flex-direction:column; transition:transform .6s ease, opacity .6s ease; opacity:0; transform:translate(0,110%);`;
    } else {
        container.style.cssText = `position:fixed; bottom:0; left:50%; transform:translate(-50%,110%); width:360px; height:600px; background:#fff; border-radius:20px; overflow:hidden; z-index:9999; display:flex; flex-direction:column; transition:transform .6s ease, opacity .6s ease; opacity:0;`;
    }
    container.innerHTML = `<button class="close-chat" style="position:absolute; top:10px; right:10px; z-index:10001;">&times;</button><div id="chat-body" style="flex-grow:1; overflow:hidden;"></div>`;
    document.body.appendChild(container);
    const button = document.createElement('button');
    button.id = "chat-button";
    button.innerHTML = `<img id="chat-icon" src="${BUTTON_IMAGE_URL}" alt="Chat" style="width:62px; height:62px;">`;
    document.body.appendChild(button);
    function openChat() {
        overlay.style.display = 'block';
        if (window.innerWidth <= 768) { button.style.display = 'none'; }
        else { document.getElementById('chat-icon').classList.add('rotate-right'); }
        isChatOpen = true;
        localStorage.removeItem('ktt10_chat_data');
        if (typeof ktt10 !== 'undefined') {
            ktt10.setup({ id: CHATBOT_ID, accountId: ACCOUNT_ID, color: CHAT_COLOR, element: '#chat-body', type: 'container', loadMessages: false });
        }
        setTimeout(() => {
            container.style.transform = window.innerWidth <= 768 ? 'translate(0,0)' : 'translate(-50%,-10%)';
            container.style.opacity = '1';
        }, 100);
    }
    function closeChat() {
        overlay.style.display = 'none';
        container.style.transform = window.innerWidth <= 768 ? 'translate(0,110%)' : 'translate(-50%,110%)';
        container.style.opacity = '0';
        if (window.innerWidth <= 768) { button.style.display = 'flex'; }
        else { document.getElementById('chat-icon').classList.remove('rotate-right'); }
        isChatOpen = false;
        localStorage.removeItem('ktt10_chat_data');
    }
    button.onclick = function () { if (isChatOpen) { closeChat(); } else { openChat(); } };
    container.querySelector('.close-chat').onclick = closeChat;
    window.clearChat = () => { document.getElementById('chat-body').innerHTML = ''; };
    window.openChat = openChat;
    document.addEventListener("submit", e => {
        if (e.target.matches(".chat-input form")) { e.preventDefault(); e.target.querySelector("button[type='submit']").click(); }
    }, true);
    const script = document.createElement('script');
    script.src = 'https://app.chatgptbuilder.io/webchat/plugin.js?v=6';
    document.body.appendChild(script);
})();