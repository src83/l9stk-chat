# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

## [v0.1.0] - 2026-04-05

**Overview:** Initial release of the Chat module built on top of L9STK Core v0.3.0.

### Added
- Chat module (`/Modules/Chat`)
- Message sending via AJAX
- Incremental message loading using `last_id`
- Chat API endpoints:
    - `POST /cabinet/chat/ajax/messages`
    - `GET /cabinet/chat/ajax/messages`
- Database migrations for chat messages

### UX / UI
- Auto-growing textarea
- Enter to send (Shift + Enter for newline)
- Input limits with visual feedback
- Automatic scroll to latest message
- Prevention of duplicate message rendering
- Responsive layout (mobile-friendly)
- Flexbox-based layout

### Changed
- Base project initialized from L9STK Core v0.3.0
- Minor layout adjustments for module integration

### Notes
- Chat implementation added in a single feature commit
- Uses HTTP polling (no WebSocket support)
- Single global chat room
- No delivery/read status tracking on backend

[v0.1.0]: https://github.com/src83/l9stk-chat/commit/5f805ab02a36b14ee1ff65c17a44ac0cd2630b1e
