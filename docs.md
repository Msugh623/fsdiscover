# Permission System Documentation

## New Implementations

This document describes the new permission system introduced in FSdiscover. The current implementation replaces the older implicit auth checks with a lightweight, session-bound permission token model stored in `pem.config.json` and enforced by the request pipeline in `utils/usePem.js` and `utils/handlers.js`.

The new system is designed to allow controlled access for specific visitors without exposing the full admin credential model. It is especially useful for file browsing, downloads, and one-off access flows that must stay bound to a browser session or a specific client identity.

---

## Overview

The permission layer is implemented by `PemManager` in `utils/usePem.js`.

Core responsibilities:

- Generate permission tokens (`pem.create(...)`)
- Validate them against the requesting client (`pem.findValid(...)`)
- Expire stale or invalid permissions automatically
- Enforce one-time consumption for temporary access
- Persist token state in `pem.config.json`

At runtime, request handlers attach a valid permission to `req.pem` and allow the request to proceed when the request matches the permission’s session constraints.

---

## Permission Token Lifecycle

### 1. Creation

A permission is created via:

```js
const permission = pem.create({
  useragent: req.user?.agent,
  addr: req.user?.addr,
  session: body.session || null,
  oneTime: body.oneTime !== false,
  durationMs: body.durationMs,
});
```

The generated object contains:

- `id`: a UUID-based token identifier
- `useragent`: the requesting browser user-agent
- `ip` / `addr`: client address metadata
- `dateCreated` and `createdAt`: creation timestamp
- `expiresAt`: optional expiry timestamp for time-limited permissions
- `oneTime`: whether the permission is consumed after first valid use
- `session`: optional session snapshot tracking browser identity

### 2. Validation

The validation flow is:

```js
const permission = pem.findValid(req.query?.pem, uInfo);
if (permission) {
  req.pem = permission;
}
```

`findValid` checks:

- the permission exists
- it has not expired
- if a session was attached, it matches the current request session by `useragent` and `addr`

This means the token is not just a random string; it is bound to the original session identity.

### 3. Consumption

If a permission is marked as `oneTime`, it is removed from storage after use:

```js
if (req.pem?.oneTime) {
  pem.consume(req.pem);
}
```

This makes the permission useful for temporary links or controlled single-use access without leaving an active credential behind.

---

## Session and Identity Binding

The permission system uses the same identity model the server already tracks in visitor records:

- `user-agent`
- remote `addr`
- `deviceName`
- optional `uuid`

When a permission is created with `session`, the token is bound to the existing visitor session. On validation, the code compares the current request metadata to the stored session fields:

```js
if (
  pem.session &&
  (pem.session.useragent !== user?.agent || pem.session.addr !== user?.addr)
) {
  return null;
}
```

This prevents a token from being replayed from another browser, another device, or a different network source.

---

## Storage Model

Permissions are stored in `pem.config.json` under a `pems` array.

The file is managed by `PemManager`:

- `load()`: loads the persisted list
- `save()`: writes the list back to disk
- `removeExpired()`: removes expired or stale permissions

The manager also enforces a fallback expiration threshold for legacy entries. If a token does not have an explicit `expiresAt`, it is treated as valid only until the fallback age window expires.

---

## Enforcement Points

### Request authentication checks

The permission token is checked in the request authentication flow before standard file access checks are allowed:

- `checkAuth` for REST requests
- `checkDirAuth` for directory listing access
- file view/download routes such as `getPath`, `downloadFile`, and `zipDir`

Example logic:

```js
const permission = pem.findValid(req.query?.pem, uInfo);
if (permission) {
  req.pem = permission;
}
```

This means a valid permission can satisfy access requirements even when the visitor is not fully authenticated via the admin login flow.

### Read access rules

The route checks use the permission token like this:

```js
if ((!runtimeConfig.config.noAuthFsRead || runtimeConfig.config.safeMode) && !theToken && !req.pem) {
  return res.status(401).send(...);
}
```

If a valid permission is present, the request can continue without the user being logged in as an admin or having a token-based authorization.

### Download protections

Downloads also check for a valid permission before serving files:

```js
if (!runtimeConfig.config.noAuthFsRead && !theToken && !req.pem) {
  return res.status(401).send(...);
}
```

The server additionally validates the target path and blocks traversal attempts such as `..` sequences before transmitting the file.

---

## Permission Behavior Modes

### One-time permissions

These are intended for short-lived access. Once used, they are deleted from storage.

Use case:

- a temporary explorer link
- a short-lived file share
- a controlled guest session

### Time-limited permissions

A permission can be created with `durationMs`.

If a duration is provided, the token expires after that period unless `oneTime` forces immediate consumption. This is useful when a permission should remain valid for a specific window but not indefinitely.

### Session-bound permissions

When `session` is provided, the permission tracks the browser or client identity at creation time. This prevents token reuse from a different session or user-agent.

---

## Security Characteristics

The new permission system adds a practical access layer without exposing a reusable admin login. Its security model is intentionally narrow:

- tokens are stored in a local config file
- tokens are checked against request metadata
- session-bound permissions reject mismatched browsers/devices
- expired permissions are pruned automatically
- one-time permissions are consumed as soon as they are used

Important note:

This is a lightweight access-control layer, not a replacement for strong admin authentication. It is best suited for time-limited or session-scoped access to the file system and associated UI features, while regular admin protections should still be enforced where sensitive operations are involved.

---

## Example Flow

1. A client generates a permission from the current user session.
2. The server stores the token in `pem.config.json`.
3. The client uses the token in a request query such as `?pem=<id>`.
4. The server validates the token and ensures the session matches.
5. If the token is one-time, it is removed after the first successful use.
6. The route is allowed through the normal file access controls.

---

## Files Involved

- `utils/usePem.js` — permission token manager and storage logic
- `utils/handlers.js` — request validation and access enforcement
- `pem.config.json` — persisted permission registry

---

## Operational Guidance

- Use one-time permissions for temporary access.
- Use `durationMs` for time-bounded, non-permanent access.
- Bind permissions to known client identities when the operation requires session integrity.
- Remove stale permissions by keeping `pem.config.json` under review if long-lived tokens are used in testing or debugging.
- Keep admin password and authorization tokens separate from guest or temporary file permissions.

---

## Summary

The new permission system gives FSdiscover a focused, temporary access mechanism that can authorize file reads and downloads without full login or a broad admin credential. It is session-aware, expiry-aware, and supports single-use access patterns, making it a strong fit for controlled file-sharing and scoped guest access flows.
