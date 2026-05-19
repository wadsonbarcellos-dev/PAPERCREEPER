import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTasks, addTask, updateTask, deleteTask, toggleTaskCompletion, setFilterStatus, setFilterPriority } from '../../store/tasksSlice';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Calendar, CheckCircle2, Circle, AlertTriangle, X } from 'lucide-react';
import { format } from 'date-fns';

export const TaskManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, status, filterStatus, filterPriority } = useSelector((state: RootState) => state.tasks);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    dispatch(addTask({
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      status: 'pending',
      dueDate: newTaskDueDate || new Date().toISOString().split('T')[0],
    }));

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskPriority('Medium');
    setNewTaskDueDate('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-zinc-300 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl relative">
      <div className="p-4 border-b border-zinc-800 bg-[#252525] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-purple-400" />
            Task Manager
          </h2>
          <p className="text-xs text-zinc-500">Organize your workload and priorities</p>
        </div>
        <div className="flex items-center gap-3">
           <select 
              value={filterStatus}
              onChange={(e) => dispatch(setFilterStatus(e.target.value as any))}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">Status: All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select 
              value={filterPriority}
              onChange={(e) => dispatch(setFilterPriority(e.target.value as any))}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {/* ADD TASK FORM */}
        <form onSubmit={handleAddTask} className="bg-[#2a2a2a] p-4 rounded-xl border border-zinc-700/50 flex flex-col gap-3">
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Task Title..." 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
              <Plus size={16} /> Add Task
            </button>
          </div>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Task Details (optional)..." 
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500"
            />
            <select 
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500 w-32"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <input 
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-purple-500 color-scheme-dark"
            />
          </div>
        </form>

        {/* TASK LIST */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
             <div className="text-center py-12 text-zinc-500 text-sm">
                No tasks found. Create one above!
             </div>
          ) : (
             <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={task.id}
                  className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                    task.status === 'completed' 
                    ? 'bg-zinc-900/50 border-zinc-800 opacity-60 hover:opacity-100' 
                    : 'bg-[#2a2a2a] border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <button 
                    onClick={() => dispatch(toggleTaskCompletion(task))}
                    className="mt-1 relative flex-shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                         <CheckCircle2 size={24} className="text-purple-500" />
                      </motion.div>
                    ) : (
                      <Circle size={24} className="text-zinc-500 hover:text-purple-400 transition-colors" />
                    )}
                  </button>

                  <div className={`flex-1 ${task.status === 'completed' ? 'line-through text-zinc-500' : ''}`}>
                    <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                    {task.description && (
                      <p className="text-xs mt-1 max-w-2xl">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 mt-3">
                       <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                         {task.priority}
                       </span>
                       <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                         <Calendar size={12} />
                         {task.dueDate}
                       </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setTaskToDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-500/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
             </AnimatePresence>
          )}
        </div>
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      <AnimatePresence>
        {taskToDelete && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={() => setTaskToDelete(null)}
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-[#242424] border border-zinc-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-50 flex flex-col items-center text-center"
             >
               <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
                 <AlertTriangle size={24} className="text-rose-500" />
               </div>
               <h3 className="text-lg font-bold text-white mb-2">Delete Task?</h3>
               <p className="text-zinc-400 text-sm mb-6">
                 This action cannot be undone. Are you sure you want to permanently remove this task?
               </p>
               
               <div className="flex gap-3 w-full">
                 <button 
                   onClick={() => setTaskToDelete(null)}
                   className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-semibold text-sm hover:bg-zinc-700 transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={() => {
                     dispatch(deleteTask(taskToDelete));
                     setTaskToDelete(null);
                   }}
                   className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-sm hover:bg-rose-500 transition-colors"
                 >
                   Delete
                 </button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
