# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

## [v0.2.0] - 2026-04-12

**Overview:** Synchronization with platform updates, introduction of configurable cabinet behavior and layout refactoring.

### Added
- Cabinet configuration file (config/cabinet.php)
- Support for configurable routes:
  - `CABINET_DEFAULT_ROUTE` (post-login redirect)
  - `CABINET_BRAND_ROUTE` (navbar brand link)
- Blade helper:
  - `isMenuItemVisible()` for menu visibility control 
- Composer autoload for Blade helpers

### Changed
- Switched login redirect to named routes via `route()` helper
- Improved authentication logic:
  - Removed duplicate queries
  - Replaced insecure password check with `Hash::check`
- Refactored cabinet layout structure:
  - Replaced `.container.app` with `.application`
  - Moved application wrapper into child views
- Updated CSS selectors to match new layout structure
- Updated environment configuration for chat-specific project setup

### Fixed
- Incorrect password validation using `bcrypt()` comparison
- Potential null return in authentication middleware

### UX / UI
- Improved layout consistency via `.application` wrapper
- Introduced config-driven menu item visibility

### Notes
- Legacy `$redirectTo` property retained as fallback (not used when `redirectTo()` is defined)
- Menu visibility currently controlled via config (`menu.items_hidden`)


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
[v0.2.0]: https://github.com/src83/l9stk-chat/commit/
