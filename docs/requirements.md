# TODO App Requirements

## 1. Overview

This document defines the product requirements for the TODO application.

Product behavior defined in this document is the source of truth.

Implementation details are intentionally excluded unless they affect observable behavior.

When a user request conflicts with this document, clarify the conflict before making product changes.

---

## 2. TODO Creation

### 2.1 Create TODO

- The user can create a TODO by entering text and submitting it.
- A TODO with empty or whitespace-only text must not be created.
- The user can submit a TODO using the "추가" button.
- The user can submit a TODO by pressing Enter in the input field.

### 2.2 Korean IME

- Pressing Enter while an IME composition is in progress must not create a TODO.
- After IME composition has completed, pressing Enter must create the TODO.
- A single user submission must create exactly one TODO.

---

## 3. TODO Completion

- The user can toggle a TODO between completed and incomplete.
- Clicking the TODO text toggles its completion state.

---

## 4. TODO Deletion

- The user can delete an existing TODO.
- Deleting a TODO removes it from the TODO list.

---

## 5. TODO Editing

- The user can enter edit mode for an existing TODO.
- Edit mode displays the current TODO text in an editable input.
- Pressing Enter saves the edited text.
- Pressing Enter during IME composition must not save the edit.
- Pressing Escape cancels editing.
- Clicking the cancel button cancels editing.
- Leaving the edit input without submitting cancels editing.
- Saving an empty or whitespace-only value must not change the existing TODO text.
- Cancelling editing must preserve the original TODO text.

---

## 6. Priority

### 6.1 Priority Values

Each TODO has exactly one priority:

- `high`
- `medium`
- `low`

### 6.2 Default Priority

- A newly created TODO has `medium` priority by default.

### 6.3 Setting Priority

- The user can select the priority when creating a TODO.
- The user can change the priority of an existing TODO.

### 6.4 Priority Ordering

TODOs are displayed in the following priority order:

1. `high`
2. `medium`
3. `low`

- TODOs with the same priority preserve their creation order.

### 6.5 Priority Persistence

- A TODO's priority must be persisted together with the TODO.
- Reloading the application must preserve the priority.

### 6.6 Legacy TODOs

- Existing TODO data that does not contain a priority must be treated as `medium`.

---

## 7. Persistence

- TODOs must persist across application reloads using localStorage.
- Creating, editing, completing, deleting, and changing the priority of a TODO must eventually be reflected in persisted data.
- Invalid or unreadable localStorage data must not prevent the application from starting.

---

## 8. Scope

The following behaviors are NOT currently required:

- Filtering TODOs by priority
- Searching TODOs
- Sorting TODOs by criteria other than the defined priority order
- Priority colors or visual indicators
- Notifications
- Deadlines or due dates
- Categories or tags
- Server-side persistence
- User accounts
- Multi-user synchronization

Do not implement these features unless explicitly requested.

---

## 9. Requirements vs Implementation

This document defines observable product behavior.

The following are implementation decisions and may be changed without modifying this document:

- React component structure
- Function and variable names
- File organization
- CSS implementation
- Testing library
- Internal state management
- Internal helper functions

When an implementation decision changes observable behavior, update the requirements first.

---

## 10. Handling Ambiguous Requests

When a user request is ambiguous and multiple reasonable product behaviors are possible, do not silently choose a product behavior.

Instead:

1. Identify the ambiguity.
2. Explain the possible choices briefly.
3. Ask the user to make the product decision.
4. Update this document if the decision becomes a permanent product requirement.

For example, if the user says:

> "Add priority support."

The agent must not independently decide:

- which priority levels exist
- the default priority
- whether priorities affect ordering
- whether users can change priority
- how legacy data is handled

unless these decisions are already defined here or explicitly provided by the user.