import { loadTasks, saveTasks } from './storage.js';
import { renderStatsHTML, renderTaskCardHTML, renderEmptyStateHTML } from './components.js';

let state = {
  tasks: [],
  searchQuery: '',
  statusFilter: 'All',
  priorityFilter: 'All',
  sortBy: 'newest',
  deletedTaskBuffer: null,
  undoTimer: null
};

const statsContainer = document.getElementById('stats-container');
const tasksContainer = document.getElementById('tasks-container');
const storageAlert = document.getElementById('storage-alert');
const taskForm = document.getElementById('task-form');
const formTitle = document.getElementById('form-title');
const taskIdInput = document.getElementById('task-id');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const priorityInput = document.getElementById('task-priority');
const statusInput = document.getElementById('task-status');
const dueInput = document.getElementById('task-due');
const titleError = document.getElementById('title-error');
const submitBtn = document.getElementById('submit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterPriority = document.getElementById('filter-priority');
const sortBySelect = document.getElementById('sort-by');
const clearFiltersBtn = document.getElementById('clear-filters-btn');

const undoToast = document.getElementById('undo-toast');
const undoBtn = document.getElementById('undo-btn');

function init() {
  const { tasks, corrupted } = loadTasks();
  state.tasks = tasks;
  if (corrupted) {
    storageAlert.classList.remove('hidden');
  }
  render();
  attachEventListeners();
}

function getProcessedTasks() {
  const priorityRank = { High: 3, Medium: 2, Low: 1 };

  return state.tasks
    .filter(task => {
      const matchesTitle = task.title.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesStatus = state.statusFilter === 'All' || task.status === state.statusFilter;
      const matchesPriority = state.priorityFilter === 'All' || task.priority === state.priorityFilter;
      return matchesTitle && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (state.sortBy === 'priority') {
        return priorityRank[b.priority] - priorityRank[a.priority];
      }
      if (state.sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
}

function render() {
  statsContainer.innerHTML = renderStatsHTML(state.tasks);

  const visibleTasks = getProcessedTasks();
  if (visibleTasks.length === 0) {
    const hasFilters = state.searchQuery || state.statusFilter !== 'All' || state.priorityFilter !== 'All';
    tasksContainer.innerHTML = renderEmptyStateHTML(hasFilters);
  } else {
    tasksContainer.innerHTML = visibleTasks.map(renderTaskCardHTML).join('');
  }
}

function resetForm() {
  taskForm.reset();
  taskIdInput.value = '';
  formTitle.textContent = 'Create New Task';
  submitBtn.textContent = 'Add Task';
  cancelEditBtn.classList.add('hidden');
  titleError.classList.add('hidden');
}

function attachEventListeners() {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cleanTitle = titleInput.value.trim();

    if (!cleanTitle) {
      titleError.classList.remove('hidden');
      titleInput.focus();
      return;
    }
    titleError.classList.add('hidden');

    const editingId = taskIdInput.value;
    const taskPayload = {
      title: cleanTitle,
      description: descInput.value.trim(),
      priority: priorityInput.value,
      status: statusInput.value,
      dueDate: dueInput.value
    };

    if (editingId) {
      state.tasks = state.tasks.map(t => t.id === editingId ? { ...t, ...taskPayload } : t);
    } else {
      state.tasks.unshift({
        id: 'task-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
        ...taskPayload,
        createdAt: Date.now()
      });

      // Reset filters to All upon creating a new task
      state.searchQuery = '';
      state.statusFilter = 'All';
      state.priorityFilter = 'All';
      if (searchInput) searchInput.value = '';
      if (filterStatus) filterStatus.value = 'All';
      if (filterPriority) filterPriority.value = 'All';
    }

    saveTasks(state.tasks);
    resetForm();
    render();
  });

  cancelEditBtn.addEventListener('click', resetForm);

  tasksContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const card = btn.closest('.task-card');
    const id = card.dataset.id;
    const action = btn.dataset.action;

    if (action === 'toggle-desc') {
      const descEl = card.querySelector('.task-desc');
      const isClamped = descEl.classList.toggle('clamped');
      btn.textContent = isClamped ? 'Read More' : 'Show Less';
      return;
    }

    if (action === 'edit') {
      const task = state.tasks.find(t => t.id === id);
      if (!task) return;
      taskIdInput.value = task.id;
      titleInput.value = task.title;
      descInput.value = task.description || '';
      priorityInput.value = task.priority;
      statusInput.value = task.status;
      dueInput.value = task.dueDate || '';
      formTitle.textContent = 'Edit Task';
      submitBtn.textContent = 'Update Task';
      cancelEditBtn.classList.remove('hidden');
      titleInput.focus();
    }

    if (action === 'delete') {
      const index = state.tasks.findIndex(t => t.id === id);
      if (index === -1) return;

      state.deletedTaskBuffer = { task: state.tasks[index], index };
      state.tasks.splice(index, 1);
      saveTasks(state.tasks);
      render();

      undoToast.classList.remove('hidden');
      clearTimeout(state.undoTimer);
      state.undoTimer = setTimeout(() => {
        undoToast.classList.add('hidden');
        state.deletedTaskBuffer = null;
      }, 5000);
    }
  });

  tasksContainer.addEventListener('change', (e) => {
    if (e.target.matches('select.status-select')) {
      const card = e.target.closest('.task-card');
      const id = card.dataset.id;
      const newStatus = e.target.value;
      state.tasks = state.tasks.map(t => t.id === id ? { ...t, status: newStatus } : t);
      saveTasks(state.tasks);
      render();
    }
  });

  undoBtn.addEventListener('click', () => {
    if (!state.deletedTaskBuffer) return;
    const { task, index } = state.deletedTaskBuffer;
    state.tasks.splice(index, 0, task);
    state.deletedTaskBuffer = null;
    clearTimeout(state.undoTimer);
    undoToast.classList.add('hidden');
    saveTasks(state.tasks);
    render();
  });

  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
  });

  filterStatus.addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    render();
  });

  filterPriority.addEventListener('change', (e) => {
    state.priorityFilter = e.target.value;
    render();
  });

  sortBySelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    render();
  });

  clearFiltersBtn.addEventListener('click', () => {
    state.searchQuery = '';
    state.statusFilter = 'All';
    state.priorityFilter = 'All';
    state.sortBy = 'newest';
    searchInput.value = '';
    filterStatus.value = 'All';
    filterPriority.value = 'All';
    sortBySelect.value = 'newest';
    render();
  });

  document.getElementById('theme-toggle').addEventListener('click', (e) => {
    document.body.classList.toggle('light-mode');
    e.target.textContent = document.body.classList.contains('light-mode') ? 'Dark Mode' : 'Light Mode';
  });

  document.getElementById('export-btn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.tasks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('dismiss-alert').addEventListener('click', () => {
    storageAlert.classList.add('hidden');
  });
}
init();
