# Tasks Workspace — Personal Task Management Dashboard

A fast, minimalist, task management workspace designed to help you organize priorities, track active work, and stay ahead of deadlines directly in your browser—with zero account setup or cloud latency.

---

##  What You Can Do (User Guide)

### 1. Real-Time Progress Overview
At the top of your workspace, four live metric cards track your workload automatically as you create, update, or complete items:
* **Total Tasks:** Every task currently stored in your workspace.
* **To Do:** Upcoming tasks waiting in your backlog.
* **In Progress:** Tasks you are actively working on right now.
* **Completed:** Finished tasks (automatically crossed out on your board).

### 2. Create & Customize Tasks
Use the **New Task** panel on the left to add items to your board:
* **Title *(Required)*:** A clear name for your task. The form prevents blank submissions so your board stays clean.
* **Description *(Optional)*:** Add notes, sub-steps, or acceptance criteria.
* **Priority Level:** Tag tasks as **Low**, **Medium**, or **High** priority with color-coded badges.
* **Status:** Start tasks in **To Do**, **In Progress**, or **Completed**.
* **Due Date *(Optional)*:** Assign a deadline using the built-in date picker.

### 3. Automatic Overdue Alerts
Never miss a deadline. Any task with a past due date that has not yet been marked as **Completed** is automatically highlighted with a red border and an **Overdue** warning badge. The moment you mark an overdue task as Completed, the warning clears.

### 4. Instant Status Updates & Editing
* **Quick Status Switch:** Change a task's status directly from its card dropdown (`To Do` → `In Progress` → `Completed`) without opening the edit form.
* **Full Editing:** Click **Edit** on any task card to load its details back into the side panel, make changes, and save—or click **Cancel** to discard your edits.

### 5. Accidental Deletion Protection (5-Second Undo)
Clicking **Delete** removes a task immediately without annoying pop-up confirmation boxes, but displays a **5-second Undo notification** at the bottom right of your screen. Click **Undo** within 5 seconds to restore the task to its exact spot.

### 6. Combined Search, Filtering & Sorting
Find exactly what you need on busy boards using the filter bar. All controls work together simultaneously:
* **Live Title Search:** Type any keyword to filter tasks by title (case-insensitive).
* **Status & Priority Filters:** Narrow your view to specific statuses (e.g., *In Progress*) and priorities (e.g., *High*) at the same time.
* **Smart Sorting:** Order your filtered results by **Newest**, **Due Date** (soonest first), or **Priority** (High to Low).
* **One-Click Reset:** Click **Reset** to clear all search terms, filters, and sorting rules at once.

### 7. Theme Switching & Data Backup
* **Dark & Light Modes:** Opens in a high-contrast Deep Slate dark mode by default to reduce eye strain. Click **Light Mode** in the top bar anytime to switch themes.
* **Automatic Offline Saving:** Your tasks are saved automatically in your browser (`localStorage`). Refresh the page or restart your browser—your workspace stays intact.
* **Export to JSON:** Click **Export JSON** in the header to download a complete backup file (`tasks-backup.json`) of your tasks.
* **Self-Healing Storage:** If browser storage ever becomes corrupted by an extension or manual edit, the app safely resets bad data and notifies you with a recovery banner instead of crashing.

---

##  Project Structure

```text
task-dashboard/
├── index.html          # Main application layout and semantic structure
├── styles.css          # Deep slate & blue theme variables, responsive grid, and states
├── README.md           # User & setup documentation
├── features_list.md    # List of all features in this webapp
└── js/
    ├── app.js          # State controller, event listeners, search/filter/sort pipeline
    ├── components.js   # HTML card rendering, XSS escaping, and overdue date math
    └── storage.js      # Defensive localStorage read/write and schema validation
