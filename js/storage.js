const STORAGE_KEY = 'task_dashboard_v1';

const VALID_STATUSES = ['To Do', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

const DEFAULT_SEED_TASKS = [
  {
    id: 'seed-1',
    title: 'Test1 inprogress normal Type',
    description: 'This task is in progress and not due yet',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now() - 86400000
  },
  {
    id: 'seed-2',
    title: 'Test2 in complete past due Type',
    description: 'This task has a past due date and is not completed, triggering the overdue highlight.',
    priority: 'High',
    status: 'To Do',
    dueDate: '2026-01-01',
    createdAt: Date.now() - 172800000
  },
  {
    id: 'seed-3',
    title: 'Test3 Completed Type',
    description: 'Task is completed and striked through.',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '',
    createdAt: Date.now() - 259200000
  }
];

function isValidTaskSchema(item) {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.title === 'string' &&
    item.title.trim().length > 0 &&
    VALID_STATUSES.includes(item.status) &&
    VALID_PRIORITIES.includes(item.priority)
  );
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      saveTasks(DEFAULT_SEED_TASKS);
      return { tasks: DEFAULT_SEED_TASKS, corrupted: false };
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error('Stored root value is not an array.');
    }

    const validTasks = parsed.filter(isValidTaskSchema);
    const hadCorruptedItems = validTasks.length !== parsed.length;

    if (hadCorruptedItems) {
      saveTasks(validTasks);
    }

    return { tasks: validTasks, corrupted: hadCorruptedItems };
  } catch (err) {
    console.warn('Corrupted localStorage detected. Resetting cleanly:', err);
    saveTasks([]);
    return { tasks: [], corrupted: true };
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to write to localStorage:', err);
  }
}

export function injectCorruptData() {
  localStorage.setItem(STORAGE_KEY, '{corrupted_json_payload:[unclosed');
}
