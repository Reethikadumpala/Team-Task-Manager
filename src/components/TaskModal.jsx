import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TaskModal({ isOpen, onClose, projectId, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/api/auth/users');
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    if (isOpen && isAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return setError('Please enter a task title');
    
    setIsSubmitting(true);
    setError('');

    try {
      const { data } = await api.post(`/api/projects/${projectId}/tasks`, {
        title,
        description,
        priority,
        dueDate,
        assignedTo: isAdmin ? assignedTo : user?._id
      });
      onTaskCreated(data);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-2xl overflow-hidden shadow-2xl scale-in">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Task Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Design Landing Page" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Description (Optional)</label>
            <textarea 
              className="input-field min-h-[80px] resize-none text-sm" 
              placeholder="Describe the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
              <select 
                className="input-field appearance-none cursor-pointer"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Due Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Assign To</label>
              <select 
                className="input-field appearance-none cursor-pointer"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <option value="">Select User (Optional)</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-slate-400 font-semibold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-2 btn-primary px-8 py-2.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
