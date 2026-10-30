# Tasks Workspace — Feature List

### Core Task Management
* **Real-Time Task Metrics:** Automatically calculates and updates counts for Total, To Do, In Progress, and Completed tasks upon any state change.
* **Task Creation:** Allows users to create new tasks with a required title, optional description, priority level, status, and optional due date.
* **Input Validation:** Prevents blank or whitespace-only task titles from being submitted and displays inline error feedback.
* **Full Task Editing:** Populates existing task data back into the form panel for seamless updates, complete with a cancel option to discard changes.
* **Instant Status Switching:** Lets users update a task's status directly from the task card dropdown without opening the edit form.
* **5-Second Undo Deletion:** Removes deleted tasks immediately while providing a 5-second toast notification to restore accidentally deleted items.
* **Automatic Overdue Highlighting:** Flags uncompleted tasks past their due date with a distinct red border and an "Overdue" warning badge.
* **Long Description Expander:** Truncates descriptions over 300 characters with a "Read More / Show Less" toggle that expands cards strictly vertically.

### Search, Filtering & Sorting
* **Case-Insensitive Title Search:** Filters visible tasks in real time as the user types keywords into the search bar.
* **Status & Priority Filtering:** Narrows down displayed tasks by specific workflow statuses (`To Do`, `In Progress`, `Completed`) and priority levels (`Low`, `Medium`, `High`).
* **Combined Search & Filter Pipeline:** Processes search queries, status filters, priority filters, and sorting rules simultaneously without state conflicts.
* **Multi-Option Sorting:** Orders tasks dynamically by Newest Added, Due Date (earliest first), or Priority (High to Low).
* **Auto-Reset on New Task:** Automatically resets active search and dropdown filters to "All" when a new task is created so it is immediately visible.
* **One-Click Filter Reset:** Clears all active search terms, filters, and custom sort orders back to their defaults with a single button click.

### Data Persistence & Security
* **Automatic `localStorage` Sync:** Preserves all tasks across page refreshes and browser restarts without requiring a backend database.
* **Self-Healing Storage Recovery:** Detects corrupted or malformed `localStorage` JSON data via defensive `try...catch` parsing and safely resets to a clean state with an alert banner.
* **Corrupt Storage Test Utility:** Includes a built-in diagnostic trigger to simulate malformed storage data and verify graceful error recovery.
* **JSON Backup Export:** Exports the entire current task list as a downloadable `tasks-backup.json` file for external safekeeping.
* **XSS HTML Escaping:** Sanitizes all user-inputted titles and descriptions before rendering to prevent cross-site scripting injection.

### UI, Theme & Architecture
* **Dark-First Deep Slate Theme:** Launches by default in a low-glare charcoal and slate color palette with high-contrast blue interactive accents.
* **Light / Dark Mode Toggle:** Switches seamlessly between Deep Slate dark mode and high-contrast light mode at the click of a button.
* **Responsive Grid Layout:** Adapts smoothly across desktop and mobile viewports with independent vertical card expansion and overflow protection.
* **Contextual Empty States:** Displays helpful guidance messages depending on whether the workspace has zero tasks or no tasks matching active filters.
* **Zero-Build ES6 Module Architecture:** Organizes code cleanly into native JavaScript modules (`app.js`, `storage.js`, `components.js`) that run directly on VS Code Live Server.