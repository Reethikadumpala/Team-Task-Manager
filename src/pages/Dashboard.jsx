import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Folder, Users, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProjectModal from '../components/ProjectModal';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAdmin } = useAuth();

  const fetchDashboardData = async () => {
    try {
      const { data: projData } = await api.get('/api/projects');
      setProjects(projData);

      if (isAdmin) {
        const { data: taskData } = await api.get('/api/tasks');
        setRecentTasks(taskData.slice(0, 5)); // Get top 5 recent tasks
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.token, isAdmin]);

  const handleProjectCreated = (newProject) => {
    setProjects([newProject, ...projects]);
  };

  if (loading) return <div className="p-8 text-slate-400 flex items-center gap-3">
    <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
    Loading projects...
  </div>;

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient">Your Projects</h1>
          <p className="text-slate-400 mt-2 font-medium">Manage and track your team's progress with precision</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link 
            key={project._id} 
            to={`/project/${project._id}`}
            className="glass-card p-7 rounded-3xl group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-primary-400 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-slate-400 text-sm mb-6 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Users className="w-4 h-4" />
                <span>{project.members?.length || 1} Members</span>
              </div>
              <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-xs font-semibold">Active</span>
            </div>
          </Link>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center glass rounded-2xl">
            <div className="mb-4 flex justify-center">
              <Folder className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-slate-400 mb-8">Create your first project to start managing tasks.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="space-y-6 pt-8 fade-in stagger-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary-500 rounded-full"></div>
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          </div>
          <div className="glass rounded-3xl overflow-hidden border border-white/[0.05] shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-semibold">Task</th>
                    <th className="px-6 py-4 font-semibold">Project</th>
                    <th className="px-6 py-4 font-semibold">Assigned To</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Last Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-200">{task.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{task.project?.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-bold">
                              {task.assignedTo.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-slate-300">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          task.status === 'done' ? 'bg-success/10 text-success' : 
                          task.status === 'in-progress' ? 'bg-primary-500/10 text-primary-500' : 
                          'bg-slate-500/10 text-slate-400'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-slate-500">{new Date(task.updatedAt).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))}
                  {recentTasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">No recent activity</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}
