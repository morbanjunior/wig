// widget.js
(function() {
    // --- Configuración del Widget ---
    const chatConfig = {
        wsUrl: "wss://atalia.morbrain.com/ws", // URL de tu WebSocket
        // wsUrl: "ws://localhost:8000/ws", // Para pruebas locales
        avatarUrl: "imagen/atal.ia.jpg", // URL de la imagen del avatar (reemplaza con tu imagen)
        botName: "ATALIA",
        botSubtitle: "Estamos aquí para ayudarte.",
        greetingMessage: "👋 ¡Hola! soy ATALIA",
        inputPlaceholder: "Escribe un mensaje...",
        sendButtonText: "Enviar",
        charLimit: 150
    };

    // --- CSS del Widget ---
    const styles = `
    :root {
        --chat-primary-color: #007bff;
        --chat-background-color: #f4f4f4;
        --chat-widget-width: 385px;
        --chat-widget-height: 533px;
    }
    .chat-toggle-container-atalia {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 9999;
    }
    .chat-greeting-atalia {
        background-color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 14px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        color: #333;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        opacity: 0;
        visibility: hidden;
    }
    .chat-greeting-atalia.visible-atalia {
        opacity: 1;
        visibility: visible;
    }
    .chat-button-atalia {
        background: var(--chat-primary-color);
        color: white;
        border: none;
        padding: 15px;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .chat-popup-atalia {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: var(--chat-widget-width);
        height: var(--chat-widget-height);
        background: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        overflow: hidden;
        display: none; /* Cambiado a none por defecto, JS lo cambiará a flex */
        flex-direction: column;
        font-family: Arial, sans-serif;
        z-index: 9998;
    }
    @media screen and (max-width: 500px) {
        .chat-popup-atalia {
            right: 10px; left: 10px;
            width: auto; max-width: none;
            height: 90vh;
            bottom: 70px;
        }
    }
    .chat-header-atalia {
        background: var(--chat-primary-color); color: white; padding: 10px;
        font-size: 18px; font-weight: bold;
        display: flex; align-items: center; gap: 10px;
        border-bottom: #8b8b8b 1px solid;
    }
    .chat-avatar-atalia {
        width: 45px; height: 45px; border-radius: 50%;
    }
    .chat-header-text-atalia h4 { margin: 0; font-size: 16px; }
    .chat-header-text-atalia p { margin: 0; font-size: 13px; font-weight: 300; }
    .chat-box-atalia {
        flex: 1;
        padding: 10px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        background-color: #fff;
    }
    .message-atalia {
        display: flex; align-items: flex-start;
        margin-bottom: 25px; max-width: 97%;
        word-wrap: break-word; overflow-wrap: break-word;
        position: relative; /* Para el timestamp */
    }
    .bot-message-atalia, .user-message-atalia, .operator-message-atalia {
        max-width: 90%; padding: 5px; border-radius: 10px;
        font-size: 14px;
    }
    .bot-message-atalia { background-color: #eaeaea; color: black; border-top-left-radius: 0; }
    .user-message-atalia {
        background-color: var(--chat-primary-color); color: white; border-top-right-radius: 0;
        margin-left: auto; text-align: left;
    }
    .operator-message-atalia { background-color: #f9e79f; color: black; border-top-left-radius: 0; }
    .user-container-atalia, .bot-container-atalia, .operator-container-atalia {
        display: flex; flex-direction: row; align-items: center;
    }
    .user-container-atalia { justify-content: flex-end; }
    .bot-container-atalia, .operator-container-atalia { justify-content: flex-start; }
    .chat-input-atalia {
        display: flex; padding: 10px; background: #eee;
        border-top: 1px solid #ddd;
        align-items: center;
    }
    .chat-input-atalia textarea {
        flex: 1; padding: 10px; border: 1px solid #ccc;
        border-radius: 5px; outline: none; resize: none;
        font-size: 14px; font-family: inherit;
        min-height: 40px; max-height: 150px;
    }
    .chat-input-atalia button {
        padding: 10px; background: var(--chat-primary-color); color: white;
        border: none; border-radius: 5px; cursor: pointer;
        margin-left: 5px;
    }
    .timestamp-atalia {
        font-size: 10px; color: gray; margin-top: 3px;
        position: absolute; bottom: -18px; /* Ajustado para no superponer */
        /* Alineación del timestamp basada en si es user o bot/operator */
    }
    .user-container-atalia .timestamp-atalia {
        right: 5px;
    }
    .bot-container-atalia .timestamp-atalia, .operator-container-atalia .timestamp-atalia {
        left: 5px;
    }
    .typing-indicator-atalia {
        font-style: italic; font-size: 13px; color: gray;
        margin: 10px 15px;
    }
    .typing-indicator-atalia .dot-atalia {
        animation: blink-atalia 1.4s infinite; opacity: 0;
        display: inline-block; margin-left: 2px;font-size: 30px;
    }
    .typing-indicator-atalia .dot-atalia:nth-child(1) { animation-delay: 0s; }
    .typing-indicator-atalia .dot-atalia:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator-atalia .dot-atalia:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink-atalia {
        0%, 20% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
    .char-count-atalia {
      font-size: 12px; color: gray; padding-left: 10px; margin-right: 5px; white-space: nowrap;
    }
    .action-button-atalia { /* Estilo para botones de acción */
        padding: 6px 12px;
        border-radius: 5px;
        border: none;
        background: var(--chat-primary-color);
        color: white;
        cursor: pointer;
        font-size: 13px;
    }
    .action-button-container-atalia {
        margin-top: 8px;
        display: flex;
        flex-wrap: wrap; /* Para que los botones se ajusten si son muchos */
        gap: 8px; /* Espacio entre botones */
    }
    `;

    // --- Variables del Widget ---
    let ws = null;
    let isTalkingToOperator = false;
    let inputBlocked = false;
    let user_id = localStorage.getItem("atalia_user_id") || (() => {
        const id = "user_" + crypto.randomUUID();
        localStorage.setItem("atalia_user_id", id);
        return id;
    })();

    // Elementos del DOM (se asignarán en createChatWidgetHTML)
    let chatToggleButton, chatGreeting, chatPopup, chatButtonIcon,
        chatBox, userInput, charCountEl, sendButton;

    // --- Funciones del Widget ---

    function loadMarked(callback) {
        if (typeof marked !== 'undefined') {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
        script.onload = callback;
        script.onerror = () => console.error("No se pudo cargar la librería marked.js");
        document.head.appendChild(script);
    }

    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    function createChatWidgetHTML() {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'chat-toggle-container-atalia';

        chatGreeting = document.createElement('p');
        chatGreeting.className = 'chat-greeting-atalia';
        chatGreeting.textContent = chatConfig.greetingMessage;
        // Inicialmente oculto, se mostrará después con animación

        chatToggleButton = document.createElement('button');
        chatToggleButton.className = 'chat-button-atalia';
        chatButtonIcon = document.createElement('span');
        chatButtonIcon.id = 'chat-button-icon-atalia';
        chatButtonIcon.innerHTML = '💬'; // Icono inicial
        chatToggleButton.appendChild(chatButtonIcon);
        chatToggleButton.addEventListener('click', toggleChat);

        toggleContainer.appendChild(chatGreeting);
        toggleContainer.appendChild(chatToggleButton);

        chatPopup = document.createElement('div');
        chatPopup.className = 'chat-popup-atalia';
        chatPopup.style.display = 'none'; // Oculto por defecto

        // Header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chat-header-atalia';
        const avatar = document.createElement('img');
        avatar.src = chatConfig.avatarUrl;
        avatar.alt = 'Avatar';
        avatar.className = 'chat-avatar-atalia';
        const headerText = document.createElement('div');
        headerText.className = 'chat-header-text-atalia';
        const h4 = document.createElement('h4');
        h4.textContent = chatConfig.botName;
        const p = document.createElement('p');
        p.textContent = chatConfig.botSubtitle;
        headerText.appendChild(h4);
        headerText.appendChild(p);
        chatHeader.appendChild(avatar);
        chatHeader.appendChild(headerText);

        // Chat Box
        chatBox = document.createElement('div');
        chatBox.id = 'chat-box-atalia';
        chatBox.className = 'chat-box-atalia';

        // Chat Input
        const chatInputContainer = document.createElement('div');
        chatInputContainer.className = 'chat-input-atalia';
        userInput = document.createElement('textarea');
        userInput.id = 'user-input-atalia';
        userInput.placeholder = chatConfig.inputPlaceholder;
        userInput.rows = 2;
        userInput.maxLength = chatConfig.charLimit;
        userInput.autofocus = true;
        charCountEl = document.createElement('small');
        charCountEl.id = 'char-count-atalia';
        charCountEl.className = 'char-count-atalia';
        charCountEl.textContent = `0 / ${chatConfig.charLimit}`;
        sendButton = document.createElement('button');
        sendButton.textContent = chatConfig.sendButtonText;
        sendButton.addEventListener('click', sendMessage);

        chatInputContainer.appendChild(userInput);
        chatInputContainer.appendChild(charCountEl);
        chatInputContainer.appendChild(sendButton);

        chatPopup.appendChild(chatHeader);
        chatPopup.appendChild(chatBox);
        chatPopup.appendChild(chatInputContainer);

        document.body.appendChild(toggleContainer);
        document.body.appendChild(chatPopup);

        // Event listeners para el input
        userInput.addEventListener("keydown", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        userInput.addEventListener("input", handleInputCharCount);
        handleInputCharCount(); // Llama para inicializar el estado del botón
    }

    function handleInputCharCount() {
        const currentLength = userInput.value.length;
        charCountEl.textContent = `${currentLength} / ${chatConfig.charLimit}`;
        // No es necesario limitar aquí porque el textarea tiene maxlength
        sendButton.disabled = currentLength === 0 || currentLength > chatConfig.charLimit || inputBlocked;
    }


    function connectWebSocket() {
        ws = new WebSocket(chatConfig.wsUrl);
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "register_user", user_id }));
            console.log("WebSocket connected for Atalia Chat.");
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                if (data.type === "typing" && (data.from === "operator" || data.from === "agent")) {
                    const isAgent = data.from === "agent";
                    if (data.status === "start") {
                        isTalkingToOperator = !isAgent;
                        showTypingIndicator();
                        if (isAgent) {
                            inputBlocked = true;
                            userInput.disabled = true;
                            sendButton.disabled = true;
                        }
                    } else if (data.status === "stop") {
                        isTalkingToOperator = false;
                        hideTypingIndicator();
                        if (isAgent) {
                            unblockInput();
                        }
                    }
                    return;
                }

                if (data.type === "action_buttons") {
                    appendButtonMessage(data.message, data.buttons);
                    hideTypingIndicator();
                    unblockInput();
                    return;
                }

                const isFromOperator = data.from === "operator";
                const isFromUser = data.from === "user";
                const text = data.response || data.message;
                if (typeof text !== "string") return;

                appendMessage(isFromOperator ? "Operador" : isFromUser ? "Tú" : "Agente", text, isFromUser);
                hideTypingIndicator();
                unblockInput();
            } catch (err) {
                console.error("Error processing message from WebSocket:", err);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected for Atalia Chat. Reconnecting in 3s...");
            setTimeout(connectWebSocket, 3000);
        };
        ws.onerror = (error) => {
            console.error("WebSocket Error for Atalia Chat:", error);
            // onclose se llamará, así que el reintento de conexión se manejará allí.
        };
    }

    function toggleChat() {
        const isClosed = chatPopup.style.display === "none" || chatPopup.style.display === "";
        chatPopup.style.display = isClosed ? "flex" : "none";
        chatButtonIcon.innerHTML = isClosed ? "❌" : "💬";

        if (chatGreeting) {
            if (isClosed) {
                // Si se abre el chat, oculta el saludo inmediatamente
                chatGreeting.classList.remove('visible-atalia');
            } else {
                // Si se cierra el chat, y no ha pasado el tiempo de auto-ocultación, muestra el saludo
                // Esto es opcional y puede requerir lógica más compleja si el saludo tiene su propio temporizador.
                // Por ahora, simplemente lo ocultamos al abrir.
            }
        }

        localStorage.setItem("atalia_chat_open", isClosed ? "true" : "false");

        if (isClosed) {
            setTimeout(() => {
                if (userInput) userInput.focus();
            }, 100); // Pequeño delay para asegurar que el popup es visible
        }
    }

    function sendMessage() {
        const msg = userInput.value.trim();
        if (!msg || inputBlocked) return;

        if (ws?.readyState === WebSocket.OPEN) {
            appendMessage("Tú", msg, true);
            ws.send(JSON.stringify({ type: "message", sender: "user", user_id, message: msg }));

            inputBlocked = true;
            userInput.disabled = true;
            sendButton.disabled = true;
            userInput.style.opacity = "0.6";
            sendButton.style.opacity = "0.6";
            sendButton.textContent = "⌛"; // Indicador de carga
            userInput.value = "";
            handleInputCharCount(); // Actualiza el contador
        } else {
            console.warn("WebSocket no está conectado. Intentando enviar mensaje:", msg);
            // Opcionalmente, encolar el mensaje o mostrar un error al usuario
            appendMessage("Sistema", "Error: No se pudo enviar el mensaje. Reintentando conexión.", false);
        }
    }

    function appendMessage(sender, text, isUser) {
        if (!chatBox || typeof marked === 'undefined') {
            console.error("ChatBox no está listo o marked.js no está cargado.");
            return;
        }

        const wrapper = document.createElement("div");
        wrapper.className = "message-atalia " + (isUser ? "user-container-atalia" : sender === "Operador" ? "operator-container-atalia" : "bot-container-atalia");

        const bubble = document.createElement("div");
        // Sanitizar el HTML generado por marked si es necesario, aunque marked tiene opciones para ello.
        // Por simplicidad, asumimos que el contenido del bot es seguro.
        bubble.innerHTML = marked.parse(text);
        bubble.className = isUser ? "user-message-atalia" : sender === "Operador" ? "operator-message-atalia" : "bot-message-atalia";

        const timestamp = document.createElement("div");
        timestamp.className = "timestamp-atalia";
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // wrapper.append(bubble, timestamp); // No, el timestamp va DENTRO del bubble o fuera pero posicionado
        bubble.appendChild(timestamp); // Poner el timestamp dentro del bubble simplifica la alineación
        wrapper.appendChild(bubble);

        chatBox.append(wrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function appendButtonMessage(text, buttons = []) {
        if (!chatBox || typeof marked === 'undefined') return;

        const wrapper = document.createElement("div");
        wrapper.className = "message-atalia bot-container-atalia";

        const bubble = document.createElement("div");
        bubble.className = "bot-message-atalia";
        bubble.innerHTML = `<p>${marked.parse(text)}</p>`; // Parsear texto principal también

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "action-button-container-atalia";

        buttons.forEach(btnData => {
            const button = document.createElement("button");
            button.textContent = btnData.label;
            button.className = "action-button-atalia"; // Clase para estilos
            button.onclick = () => {
                showTypingIndicator(); // Mostrar feedback inmediato
                // Deshabilitar todos los botones en este mensaje
                buttonContainer.querySelectorAll('.action-button-atalia').forEach(b => b.disabled = true);
                button.style.backgroundColor = "#ccc"; // Indicar que fue clickeado
                
                ws.send(JSON.stringify({
                    type: "transfer_response",
                    value: btnData.value,
                    user_id: user_id
                }));
                // Actualizar el mensaje para mostrar la opción seleccionada y quitar botones
                // Se podría mantener el texto original y añadir la selección,
                // o reemplazarlo completamente. Aquí, lo mantenemos y añadimos.
                const selectionText = document.createElement('p');
                selectionText.style.marginTop = '10px';
                selectionText.innerHTML = `✅ Opción seleccionada: <strong>${btnData.label}</strong>`;
                bubble.appendChild(selectionText);
                buttonContainer.remove(); // Eliminar los botones después de la selección
            };
            buttonContainer.appendChild(button);
        });

        bubble.appendChild(buttonContainer);
        wrapper.appendChild(bubble);
        chatBox.appendChild(wrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
        unblockInput(); // Asegurarse de que el input se desbloquee si estaba bloqueado por el bot
    }

    function unblockInput() {
        inputBlocked = false;
        userInput.disabled = false;
        sendButton.disabled = userInput.value.trim().length === 0; // Habilitar solo si hay texto
        userInput.style.opacity = "1";
        sendButton.style.opacity = "1";
        sendButton.textContent = chatConfig.sendButtonText;
        handleInputCharCount(); // Actualizar estado del botón
        if (chatPopup.style.display !== "none") { // Solo enfocar si el chat está visible
             userInput.focus();
        }
    }

    function showTypingIndicator() {
        if (document.getElementById("typing-indicator-atalia") || !chatBox) return;
        const div = document.createElement("div");
        div.id = "typing-indicator-atalia";
        div.className = "message-atalia bot-container-atalia"; // Para que se alinee a la izquierda
        div.innerHTML = `<div class="bot-message-atalia typing-indicator-atalia"><span class="dot-atalia">.</span><span class="dot-atalia">.</span><span class="dot-atalia">.</span></div>`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideTypingIndicator() {
        const typing = document.getElementById("typing-indicator-atalia");
        if (typing) typing.remove();
    }

    function initializeGreeting() {
        if (!chatGreeting) return;
        const chatWasOpen = localStorage.getItem("atalia_chat_open") === "true";
        
        if (!chatWasOpen) { // Solo mostrar saludo si el chat no estaba abierto previamente
            setTimeout(() => {
                chatGreeting.classList.add('visible-atalia');
                setTimeout(() => {
                    chatGreeting.classList.remove('visible-atalia');
                }, 10000); // Desaparecer después de 10 segundos
            }, 3000); // Aparecer después de 3 segundos
        }
    }


    // --- Inicialización del Widget ---
    function init() {
        injectStyles();
        createChatWidgetHTML();
        connectWebSocket();
        initializeGreeting(); // Muestra el saludo inicial con temporizador

        // Reabrir el chat si estaba abierto en la sesión anterior
        if (localStorage.getItem("atalia_chat_open") === "true") {
            // Pequeño timeout para asegurar que todo está renderizado
            setTimeout(() => {
                toggleChat();
                 // No mostramos el saludo si el chat se abre automáticamente
                if(chatGreeting) chatGreeting.classList.remove('visible-atalia');
            }, 100);
        }
    }

    // Esperar a que el DOM esté cargado y luego cargar marked.js
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => loadMarked(init));
    } else {
        // El DOM ya está cargado
        loadMarked(init);
    }

})();