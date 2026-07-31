# Firebase Security Specification & TDD Test Cases

## 1. Data Invariants
- **User Ownership Invariant**: Every entity (`Project`, `Task`, `Note`) must be owned by an authenticated user (`ownerId == request.auth.uid`). Users can only read, create, update, or delete their own data.
- **Identity Spoofing Guard**: On creation, `ownerId` must strictly match `request.auth.uid`. On update, `ownerId` must remain immutable (`incoming().ownerId == existing().ownerId`).
- **User Profile Isolation**: User documents (`/users/{userId}`) can only be read or written by the user matching `{userId}` (`request.auth.uid == userId`).
- **Input Validation**: Titles, descriptions, and statuses must comply with maximum string length constraints and valid enum values.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Read**: Request `get` or `list` on `/projects` or `/tasks` without auth token. Expected: `PERMISSION_DENIED`.
2. **Owner Spoofing on Create**: Authenticated user `user_A` sends `ownerId: "user_B"` when creating a project. Expected: `PERMISSION_DENIED`.
3. **Owner Hijacking on Update**: User `user_A` attempts to update an existing project's `ownerId` to `user_A` on `user_B`'s document. Expected: `PERMISSION_DENIED`.
4. **Cross-User Data Leak**: User `user_A` attempts to `get` document `/users/user_B`. Expected: `PERMISSION_DENIED`.
5. **Cross-User List Scrape**: User `user_A` performs a collection query for all tasks without a filter `where("ownerId", "==", "user_A")`. Expected: `PERMISSION_DENIED`.
6. **Malicious Ghost Field Injection**: User `user_A` includes `isAdmin: true` in task or project creation payload. Expected: `PERMISSION_DENIED`.
7. **Overlarge Payload Attack**: User attempts to store a 5MB payload string in a task title or description exceeding max length rules. Expected: `PERMISSION_DENIED`.
8. **Invalid Enum Poisoning**: User sets `status: "hacked_status"` on a task instead of allowed enum values (`todo`, `in_progress`, `completed`). Expected: `PERMISSION_DENIED`.
9. **User ID Path Tampering**: User `user_A` attempts to write to `/users/user_B` path. Expected: `PERMISSION_DENIED`.
10. **Modification of Immutable Field**: User attempts to modify `createdAt` timestamp on an existing note or task. Expected: `PERMISSION_DENIED`.
11. **Malicious ID Injection**: Document ID contains 500 characters or special script characters (`<script>`). Expected: `PERMISSION_DENIED`.
12. **Unauthorized Cross-Tenant Delete**: User `user_A` sends a `delete` request for `/notes/note_owned_by_user_B`. Expected: `PERMISSION_DENIED`.
