const textarea   = document.getElementById('comment');
const counter    = document.getElementById('counter');
const sendBtn    = document.getElementById('sendBtn');
const messageBox = document.getElementById('messageBox');

const max = textarea.maxLength;
const SHOW_AFTER = Math.floor(max * 0.75);  // 450 symbols
const BOTTOM_THRESHOLD = 100; // px
const MAX_MESSAGES = 200;
const STATUS_UPDATE_TIMEOUT = 600; // ms

const iconMap = {
    sending: 'check',
    sent: 'done_all',
    read: 'done_all',
    failed: 'cloud_off'
};

const userId = Number(document
    .querySelector('meta[name="_userId"]')
    ?.getAttribute('content')
);

const userName = document
    .querySelector('meta[name="_userName"]')
    ?.getAttribute('content');

let baseHeight   = textarea.scrollHeight;
let userAtBottom = true;

textarea.focus();

// при открытии чата, когда получаем реальный layout
requestAnimationFrame(() => {
    scrollToBottom(true);
});

let lastMessageId = null;
let polling = false;
fetchMessages();  // первый запрос сразу
setInterval(fetchMessages, 5000);  // дальше — polling

// ----------------------------------------------------------------------------- //

textarea.addEventListener('input', () => {

    // autoresize
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    // safety net
    if (textarea.value.length > max) {
        textarea.value = textarea.value.slice(0, max);
    }

    // counter
    const len = textarea.value.length;
    counter.textContent = `${len} / ${max}`;

    const expanded = textarea.scrollHeight > baseHeight;
    const shouldShow = expanded && len >= SHOW_AFTER;

    counter.classList.toggle('visible', shouldShow);
    counter.classList.toggle('warning', len >= max * 0.9);
    counter.classList.toggle('limit', len >= max);

    updateSendButtonAvailability();
});

textarea.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', e => {
    e.preventDefault();
    if (sendBtn.classList.contains('disabled')) {
        textarea.focus();
        return;
    }
    sendMessage();
    textarea.focus();
});

// Флаг 'пользователь внизу'
messageBox.addEventListener('scroll', () => {
    userAtBottom =
        (messageBox.scrollTop + messageBox.clientHeight) >=
        (messageBox.scrollHeight - BOTTOM_THRESHOLD);
});

// ----------------------------------------------------------------------------- //

function sendMessage() {
    // открытие чата и/или отправка своего сообщения - scrollToBottom(true)
    // получение чужого сообщения - scrollToBottom()

    let text = textarea.value.trim();
    if (!text) return;

    const clientId = generateClientId();

    // optimistic UI
    appendMessage({
        clientId: clientId,
        text: text,
        author: userName,
        time: formatTime(),
        isMine: true,
        status: 'sending'
    });

    scrollToBottom(true);  // возврат в контекст диалога

    sendMessageToBackend(text, clientId);

    textarea.value = '';
    textarea.style.height = 'auto';
    baseHeight = textarea.scrollHeight;

    counter.textContent = `0 / ${max}`;
    counter.classList.remove('visible', 'warning', 'limit');
    sendBtn.classList.add('disabled');
}

function appendMessage({ clientId, serverId, text, author, time, isMine, status = 'sent' }) {

    const messageBody = document.createElement('div');
    messageBody.className = 'message-body';
    if (clientId) {
        messageBody.dataset.clientId = clientId;
    }
    if (serverId) {
        messageBody.dataset.serverId = serverId;
    }
    messageBody.dataset.status = status;

    const main = document.createElement('div');
    main.className = isMine
        ? 'message-main-sender'
        : 'message-main-receiver';

    const bubble = document.createElement('div');
    bubble.className = isMine ? 'sender' : 'receiver';

    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.textContent = text;

    bubble.appendChild(messageText);

    if (!isMine) {
        const authorSpan = document.createElement('span');
        authorSpan.className = 'message-author pull-left';
        authorSpan.textContent = author;
        bubble.appendChild(authorSpan);
    }

    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;

    bubble.appendChild(timeSpan);

    if (isMine) {
        const statusSpan = document.createElement('span');
        statusSpan.className = 'sender-status-icon material-symbols-outlined';
        statusSpan.textContent = iconMap[status] ?? 'check';
        statusSpan.classList.add(`status-${status}`);
        bubble.appendChild(statusSpan);
    }

    main.appendChild(bubble);
    messageBody.appendChild(main);

    messageBox.appendChild(messageBody);

    pruneOldMessages();
}

function sendMessageToBackend(text, clientId) {

    $.ajax({
        url: '/cabinet/chat/ajax/messages',
        type: 'POST',
        data: {
            client_id: clientId,
            text: text,
        },
        dataType: 'json',
        cache: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        },
        error: function(errors) {
            // markMessageFailed(clientId);
        },
        success: function(res) {
            syncMessageFromServer(res.data);
        }
    });
}

function fetchMessages() {

    if (polling) return;
    polling = true;

    $.get('/cabinet/chat/ajax/messages', { last_id: lastMessageId })
        .done(res => {
            if (!res.messages.length) { return; }

            res.messages.forEach(msg => {

                if (messageExists(msg.id, msg.client_id)) {
                    lastMessageId = msg.id;
                    return;
                }

                appendMessage({
                    clientId: msg.client_id,
                    serverId: msg.id,
                    text: msg.text,
                    author: msg.user.name,
                    time: formatTime(msg.created_at),
                    isMine: Number(msg.user_id) === userId,
                    status: msg.status,
                });

                lastMessageId = msg.id;
            });

            scrollToBottom();
        })
        .always(() => {
            polling = false;
        });
}

// ----------------------------------------------------------------------------- //

// Универсальная функция скролла
function scrollToBottom(force = false) {
    if (force || userAtBottom) {
        messageBox.scrollTop = messageBox.scrollHeight;
    }
}

function updateSendButtonAvailability() {
    const hasText = textarea.value.trim().length > 0;
    sendBtn.classList.toggle('disabled', !hasText);
}

function formatTime(ts = Date.now()) {
    const d = new Date(ts);

    const date = d.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    const time = d.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return `${date} ${time}`;
}

function pruneOldMessages() {
    const messages = messageBox.children;
    const excess = messages.length - MAX_MESSAGES;

    if (excess <= 0) return;

    for (let i = 0; i < excess; i++) {
        messageBox.removeChild(messages[0]);
    }
}

function generateClientId() {
    return 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2);
}

function syncMessageFromServer(message) {
    if (!message.client_id) return;

    const el = document.querySelector(
        `.message-body[data-client-id="${message.client_id}"]`
    );

    if (!el) return;

    el.dataset.serverId = message.id;
    el.dataset.status = message.status;

    setTimeout(() => {
        updateMessageStatus(el, message.status);
    }, STATUS_UPDATE_TIMEOUT);
}

function updateMessageStatus(messageEl, newStatus) {
    const icon = messageEl.querySelector('.sender-status-icon');
    if (!icon) return;

    icon.classList.remove(
        'status-sending',
        'status-sent',
        'status-read',
        'status-failed'
    );

    icon.classList.add(`status-${newStatus}`);
    icon.textContent = iconMap[newStatus];
}

function messageExists(serverId, clientId) {
    if (clientId) {
        return document.querySelector(
            `.message-body[data-client-id="${clientId}"]`
        );
    }

    return document.querySelector(
        `.message-body[data-server-id="${serverId}"]`
    );
}

