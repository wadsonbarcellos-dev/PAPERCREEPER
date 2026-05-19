import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'completed';
  dueDate: string;
  createdAt: number;
}

interface TasksState {
  tasks: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filterStatus: 'all' | 'pending' | 'completed';
  filterPriority: 'all' | 'High' | 'Medium' | 'Low';
}

const initialState: TasksState = {
  tasks: [],
  status: 'idle',
  error: null,
  filterStatus: 'all',
  filterPriority: 'all',
};

// Async thunks for backend interaction
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('/api/tasks');
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return (await response.json()) as Task[];
});

export const addTask = createAsyncThunk('tasks/addTask', async (task: Omit<Task, 'id' | 'createdAt'>) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to add task');
  return (await response.json()) as Task;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return (await response.json()) as Task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete task');
  return id;
});

export const toggleTaskCompletion = createAsyncThunk('tasks/toggle', async (task: Task) => {
  const updatedTask = { ...task, status: task.status === 'completed' ? 'pending' : 'completed' };
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: 'PUT', // or PATCH
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask),
  });
  if (!response.ok) throw new Error('Failed to update task');
  return (await response.json()) as Task;
});


const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<'all' | 'pending' | 'completed'>) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<'all' | 'High' | 'Medium' | 'Low'>) => {
      state.filterPriority = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
      });
  },
});

export const { setFilterStatus, setFilterPriority } = tasksSlice.actions;

export default tasksSlice.reducer;
