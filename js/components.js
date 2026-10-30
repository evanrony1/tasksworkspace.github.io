export function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isTaskOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  return due < today;
}

export function renderStatsHTML(tasks) {
  const total = tasks.length;
  const todo = tasks.filter(t => t.status === 'To Do').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  return `
    <div class="stat-card">
      <span class="stat-label">Total Tasks</span>
      <span class="stat-value">${total}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">To Do</span>
      <span class="stat-value" style="color: var(--todo-text)">${todo}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">In Progress</span>
      <span class="stat-value" style="color: var(--prog-text)">${inProgress}</span>
    </div>
    <div class="stat-card">
      <span class="stat-label">Completed</span>
      <span class="stat-value" style="color: var(--comp-text)">${completed}</span>
    </div>
  `;
}

export function renderTaskCardHTML(task) {
  const overdue = isTaskOverdue(task.dueDate, task.status);
  const priorityClass = `badge-${task.priority.toLowerCase()}`;
  const isCompleted = task.status === 'Completed';
  const hasLongDesc = task.description && task.description.length > 300;

  return `
    <article class="task-card ${overdue ? 'overdue' : ''}" data-id="${escapeHTML(task.id)}">
      <div>
        <div class="task-header">
          <h3 class="task-title ${isCompleted ? 'completed-text' : ''}">${escapeHTML(task.title)}</h3>
        </div>
        
        <div class="badges">
          <span class="badge ${priorityClass}">${escapeHTML(task.priority)}</span>
          ${overdue ? '<span class="badge badge-overdue">Overdue</span>' : ''}
          ${task.dueDate ? `<span class="badge">Due ${escapeHTML(task.dueDate)}</span>` : ''}
        </div>

        ${task.description ? `
          <p class="task-desc ${hasLongDesc ? 'clamped' : ''}">${escapeHTML(task.description)}</p>
          ${hasLongDesc ? `<button type="button" class="read-more-btn" data-action="toggle-desc">Read More</button>` : ''}
        ` : ''}
      </div>

      <div class="task-footer">
        <select class="status-select" data-action="status" aria-label="Change task status">
          <option value="To Do" ${task.status === 'To Do' ? 'selected' : ''}>To Do</option>
          <option value="In Progress" ${task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Completed" ${task.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>

        <div class="card-actions">
          <button type="button" class="btn btn-ghost btn-sm" data-action="edit">Edit</button>
          <button type="button" class="btn btn-ghost-danger btn-sm" data-action="delete">Delete</button>
        </div>
      </div>
    </article>
  `;
}

export function renderEmptyStateHTML(hasFilters) {
  return `
    <div class="empty-state">
      <h3>${hasFilters ? 'No tasks match your active filters' : 'Your workspace is empty'}</h3>
      <p>${hasFilters ? 'Try clearing your search or filter criteria.' : 'Use the form on the left to create your first task.'}</p>
    </div>
  `;
}