## L9STK Chat — Chat Module for Laravel 9 Starter Kit

**English version:** [README.md](README.md)

**Данное приложение — рабочий прототип платформенного подхода на базе модульного монолита L9STK Core v0.4.0**
- Код и документация STK-сборки: https://github.com/src83/l9stk
- Версия STK-сборки: v0.4.0
- Версия приложения: v0.2.0
- Статус: Production
- Laravel: v9.52.21
- PHP: 8.2

---

### Назначение

- Реализация рабочего модуля чата
- Проверка модульной архитектуры
- Использование в production и demo

---

### Реализовано

- Отправка и автоподгрузка сообщений через AJAX
- Автоскролл окна
- Предотвращение дублирования сообщений
- Подсказки ограничений по вводу текста в поле сообщений
- Адаптивность под мобильные экраны

---

### UX / UI

- Автоматическое увеличение высоты поля ввода
- Отправка по Enter (Shift + Enter — новая строка)
- Ограничения ввода с визуальной обратной связью
- Предотвращение дублирования сообщений при отображении
- Автоматическая прокрутка к последнему сообщению
- Адаптивная вёрстка (под мобильные устройства)
- Вёрстка на основе Flexbox

---

### Иерархия flex-контейнеров (Flexbox)

```txt
html (height:100%)
 └── body (flex, column, height:100%)
     └── #app (flex, column, flex:1)
         ├── nav (flex:0 0 auto)
         └── main.py-md-4 (flex, flex:1)
             └── .container.application (flex, flex:1)
                 └── .conversation (flex, column, flex:1)
                     ├── .message (flex:1, overflow-y:auto)
                     └── .reply (flex:0 0 auto)
```

---

### Ограничения

- Нет регистрации пользователей (пользователи создаются вручную)
- Одна общая комната чата (глобальный чат)
- Нет поддержки WebSocket (используется polling)
- Нет отслеживания статусов доставки и прочтения (на стороне сервера)
- Нет push-уведомлений

---

### Roadmap

- Переход на актуальную стабильную версию Laravel
- Защита от повторных нажатий кнопки отправки (debounce)
- Интеграция WebSocket
- Поддержка статусов доставки и прочтения сообщений (backend)
- Согласованность данных между DOM и базой данных
- Push-уведомления
- Поддержка мульти-румов
- Улучшения аутентификации

---

### API

#### Отправка сообщения (запрос)

`POST /cabinet/chat/ajax/messages`

```json
{
  "text": "Message text",
  "client_id": "c_1775429886854_ob6idj40ub"
}
```

#### Отправка сообщения (ответ)

```json
{
  "code_http": 201,
  "code_text": "Created",
  "message_key": "chat.post_created",
  "data": {
    "user_id": 1,
    "client_id": "c_1775429886854_ob6idj40ub",
    "text": "Message text",
    "status": "sent",
    "updated_at": "2026-04-05T22:58:06.000000Z",
    "created_at": "2026-04-05T22:58:06.000000Z",
    "id": 4,
    "user": {
      "id": 1,
      "name": "my-user-name"
    }
  }
}
```

#### Подгрузка сообщения

`GET /cabinet/chat/ajax/messages?last_id=3`

Ответ:
```json
{
  "messages": [
    {
      "id": 4,
      "user_id": 1,
      "client_id": "c_1775429886854_ob6idj40ub",
      "text": "Message text",
      "status": "sent",
      "created_at": "2026-04-05T22:58:06.000000Z",
      "updated_at": "2026-04-05T22:58:06.000000Z",
      "user": {
        "id": 1,
        "name": "my-user-name"
      }
    }
  ]
}
```
