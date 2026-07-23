(function(){
  document.querySelectorAll('.nav-mobile a').forEach(function(a){
    a.addEventListener('click', function(){ document.getElementById('nav').classList.remove('open'); });
  });
})();

(function () {
    const CHAT_COLOR = '#000';
    const ACCOUNT_ID = '1605006';
    const CHATBOT_ID = 'TPMVAgTlLyk';
    const BUTTON_IMAGE_URL = 'https://storage.googleapis.com/tapthetable/assets/1605006/images/Avator-for Chat bubble 2-16-2025.png';
    let isChatOpen = false;

    const styleSheet = document.createElement('style');
    styleSheet.innerText = `
        @keyframes floatButton {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        #chat-overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 9998;
            display: none;
        }
        #chat-container {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 110%);
            width: 360px;
            height: 600px;
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            transition: transform 0.6s ease, opacity 0.6s ease;
            opacity: 0;
            will-change: transform, opacity;
            backface-visibility: hidden;
        }
        @media(max-width:768px) {
            #chat-container {
                width: 100%;
                height: 100%;
                border-radius: 20px;
                left: 0;
                top: 0;
                transform: translate(0, 110%);
            }
            #chat-button.hidden {
                display: none !important;
            }
        }
        #chat-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, ${CHAT_COLOR}, #36d6b5);
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 0 15px 5px #36d6b5;
            animation: floatButton 3s infinite ease;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s;
            overflow: hidden;
        }
        #chat-icon.rotate-right {
            transition: transform 0.5s;
            transform: rotate(90deg);
        }
        .close-chat {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 35px;
            height: 35px;
            background: transparent;
            color: #fff;
            border: none;
            font-size: 30px;
            border-radius: 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(styleSheet);

    const overlay = document.createElement('div');
    overlay.id = 'chat-overlay';
    document.body.appendChild(overlay);

    const container = document.createElement('div');
    container.id = 'chat-container';
    if (window.innerWidth <= 768) {
        container.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: #fff; border-radius: 20px; overflow: hidden; z-index: 9999;
            display: flex; flex-direction: column;
            transition: transform 0.6s ease, opacity 0.6s ease;
            opacity: 0; will-change: transform, opacity; backface-visibility: hidden;
            transform: translate(0, 110%);
        `;
    } else {
        container.style.cssText = `
            position: fixed; bottom: 0; left: 50%; transform: translate(-50%, 110%);
            width: 360px; height: 600px; background: #fff; border-radius: 20px;
            overflow: hidden; z-index: 9999; display: flex; flex-direction: column;
            transition: transform 0.6s ease, opacity 0.6s ease;
            opacity: 0; will-change: transform, opacity; backface-visibility: hidden;
        `;
    }
    container.innerHTML = `
        <button class="close-chat" style="position:absolute; top:10px; right:10px; z-index:10001;">&times;</button>
        <div id="chat-body" style="flex-grow:1; overflow:hidden;"></div>
    `;
    document.body.appendChild(container);

    const button = document.createElement('button');
    button.id = "chat-button";
    button.innerHTML = `<img id="chat-icon" src="${BUTTON_IMAGE_URL}" alt="Chat Button" style="width:65px; height:65px;">`;
    document.body.appendChild(button);

    function openChat() {
        overlay.style.display = 'block';
        if (window.innerWidth <= 768) {
            button.style.display = 'none';
        } else {
            document.getElementById('chat-icon').classList.add('rotate-right');
        }
        isChatOpen = true;
        localStorage.removeItem('ktt10_chat_data');
        if (typeof ktt10 !== 'undefined') {
            ktt10.setup({
                id: CHATBOT_ID,
                accountId: ACCOUNT_ID,
                color: CHAT_COLOR,
                element: '#chat-body',
                type: 'container',
                loadMessages: false
            });
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
        if (window.innerWidth <= 768) {
            button.style.display = 'flex';
        } else {
            document.getElementById('chat-icon').classList.remove('rotate-right');
        }
        isChatOpen = false;
        localStorage.removeItem('ktt10_chat_data');
    }

    button.onclick = function () {
        if (isChatOpen) { closeChat(); } else { openChat(); }
    };
    container.querySelector('.close-chat').onclick = closeChat;

    window.clearChat = () => { document.getElementById('chat-body').innerHTML = ''; };
    window.openChat = openChat;

    document.addEventListener("submit", e => {
        if (e.target.matches(".chat-input form")) {
            e.preventDefault();
            e.target.querySelector("button[type='submit']").click();
        }
    }, true);

    const script = document.createElement('script');
    script.src = 'https://app.chatgptbuilder.io/webchat/plugin.js?v=6';
    script.onload = () => { console.log('Chat plugin loaded.'); };
    script.onerror = () => { console.error('Webchat script failed to load.'); };
    document.body.appendChild(script);
})();