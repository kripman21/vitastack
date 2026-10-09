import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { GeneralDashboard } from './components/dashboard/GeneralDashboard';
import { ManagerMyTasksView } from './components/tasks/ManagerMyTasksView';
import { TeamVitalityView } from './components/team/TeamVitalityView';
import { MemberDetailTasksView } from './components/member/MemberDetailTasksView';
import { SettingsView } from './components/settings/SettingsView';
import { TaskModal } from './components/tasks/TaskModal';
import { TaskDetailDrawer } from './components/tasks/TaskDetailDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginView } from './components/auth/LoginView';
import { Task, TaskStatus } from './types';

const MainAppContent: React.FC = () => {
  const { activeView, tasks, theme, isAuthenticated, isManager } = useApp();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [initialStatusForModal, setInitialStatusForModal] = useState<TaskStatus>('POR_HACER');
  const [defaultAssigneeForModal, setDefaultAssigneeForModal] = useState<string | undefined>(undefined);

  const [selectedTaskForDrawer, setSelectedTaskForDrawer] = useState<Task | null>(null);

  // Handlers
  const handleOpenNewTaskModal = (status?: TaskStatus, assigneeId?: string) => {
    setTaskToEdit(null);
    setInitialStatusForModal(status || 'POR_HACER');
    setDefaultAssigneeForModal(assigneeId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleViewTaskDetails = (task: Task) => {
    setSelectedTaskForDrawer(task);
  };

  // Keep drawer in sync with updated task state if open
  const currentDrawerTask = selectedTaskForDrawer 
    ? tasks.find(t => t.id === selectedTaskForDrawer.id) || selectedTaskForDrawer 
    : null;

  // Si no está autenticado, mostrar pantalla de Login
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${
      theme === 'dark' ? 'bg-[#090d16] text-[#dfe2f1]' : 'bg-[#f8fafc] text-slate-900'
    } font-sans antialiased`}>
      {/* Sidebar with Navigation & Role Switcher */}
      <Sidebar />

      {/* Main Workbench Canvas Area */}
      <div className={`flex-1 flex flex-col h-screen min-w-0 overflow-hidden ${
        theme === 'dark' ? 'bg-[#0a0e18]' : 'bg-[#f1f5f9]'
      }`}>
        <main className="flex-1 overflow-y-auto flex flex-col relative">
          {activeView === 'dashboard' && (
            <GeneralDashboard
              onOpenNewTaskModal={() => handleOpenNewTaskModal()}
              onEditTask={handleEditTask}
              onViewTaskDetails={handleViewTaskDetails}
            />
          )}

          {activeView === 'my-tasks' && (
            <ManagerMyTasksView
              onOpenNewTaskModal={(status) => handleOpenNewTaskModal(status)}
              onEditTask={handleEditTask}
              onViewTaskDetails={handleViewTaskDetails}
            />
          )}

          {activeView === 'team' && isManager && (
            <TeamVitalityView />
          )}

          {activeView === 'member-tasks' && isManager && (
            <MemberDetailTasksView
              onOpenNewTaskModal={(status, memberId) => handleOpenNewTaskModal(status, memberId)}
              onEditTask={handleEditTask}
              onViewTaskDetails={handleViewTaskDetails}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        initialStatus={initialStatusForModal}
      />

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        task={currentDrawerTask}
        onClose={() => setSelectedTaskForDrawer(null)}
        onEdit={(task) => {
          setSelectedTaskForDrawer(null);
          handleEditTask(task);
        }}
      />

      {/* Notification Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
