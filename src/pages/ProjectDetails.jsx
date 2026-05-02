import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, MoreVertical, Clock, AlertCircle, Trash2 } from 'lucide-react';
import TaskModal from '../components/TaskModal';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-primary-500' },
  { id: 'done', title: 'Completed', color: 'bg-success' }
];

export default function ProjectDetails() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        api.get(`/api/projects/${id}`),
        api.get(`/api/projects/${id}/tasks`)
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user?.token]);

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      const { data } = await api.put(`/api/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? data : t));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  if (loading) return <div className="p-8 text-slate-400 flex items-center gap-3">
    <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
    Loading workspace...
  </div>;

  return (
    <div className="h-full flex flex-col space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">{project?.name}</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">{project?.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {project?.members?.map((member, i) => (
              <div key={member._id} className="w-10 h-10 rounded-full border-2 border-dark bg-primary-600 flex items-center justify-center text-xs font-bold" title={member.name}>
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            <button className="w-10 h-10 rounded-full border-2 border-dark bg-dark-card flex items-center justify-center hover:bg-white/5 transition-colors">
              <Plus className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 flex-1 items-start">
        {columns.map(column => (
          <div key={column.id} className="min-w-[320px] w-[320px] flex flex-col h-full bg-white/[0.02] rounded-3xl border border-white/[0.05] overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${column.color} shadow-lg ${column.color}/40`}></div>
                <h3 className="font-bold text-slate-300 uppercase tracking-widest text-[11px]">{column.title}</h3>
                <span className="bg-white/5 px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-500">{getTasksByStatus(column.id).length}</span>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] scrollbar-hide">
              {getTasksByStatus(column.id).map(task => (
                <div key={task._id} className="glass-card p-5 rounded-2xl group border-transparent hover:border-primary-500/30">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 
                      task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {task.priority}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1 text-slate-600 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-semibold text-slate-200 mb-1">{task.title}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-1.5 bg-primary-500/10 text-primary-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                        <div className="w-3.5 h-3.5 rounded-full bg-primary-500 flex items-center justify-center text-[8px] text-white">
                          {task.assignedTo.name?.charAt(0).toUpperCase()}
                        </div>
                        {task.assignedTo.name}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 italic">Unassigned</div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                    <select 
                      className={`bg-transparent text-[10px] text-slate-400 outline-none cursor-pointer ${!isAdmin && task.assignedTo?._id !== user?._id ? 'pointer-events-none' : ''}`}
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task._id, e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {getTasksByStatus(column.id).length === 0 && (
                <div className="border-2 border-dashed border-dark-border rounded-xl p-6 text-center">
                  <p className="text-xs text-slate-600">No tasks in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectId={id}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
