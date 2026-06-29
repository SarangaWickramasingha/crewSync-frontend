'use client';

import { useState, useEffect } from 'react';
import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import ProjectForum from '@/Components/dashboard/propertyOwner/ProjectForum';
import Card from '@/Components/dashboard/propertyOwner/Card';

const CURRENT_USER = {
  name: 'Nimal Kumarasinghe',
  initials: 'NK',
  avatarBg: '#FFF3E0',
  avatarColor: '#B85A00',
};

const DEFAULT_THREADS = [
  {
    id: 'task-3',
    title: 'Task 3 – Roofing',
    meta: '3 participants · Last activity: Today 10:42 AM',
    statusLabel: 'Active',
    statusVariant: 'amber',
    initialPosts: [
      { id: 1, initials: 'NK', avatarBg: '#FFF3E0', avatarColor: '#B85A00', authorName: 'Nimal Kumarasinghe', authorTag: '(You)', text: 'Just checking in on the roofing progress. Are we on schedule?', time: 'Today, 10:30 AM', mine: true },
      { id: 2, initials: 'SK', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', authorName: 'Sunil Karunaratne', authorTag: '· Mason', text: "Yes, we've completed about 55% of the roofing. The remaining work should be done by May 22.", time: 'Today, 10:38 AM', mine: false },
      { id: 3, initials: 'SK', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', authorName: 'Sunil Karunaratne', authorTag: '· Mason', text: 'We need one more bundle of roofing tiles — can you arrange?', time: 'Today, 10:42 AM', mine: false },
    ],
  },
  {
    id: 'task-1',
    title: 'Task 1 – Foundation',
    meta: '2 participants · Last activity: April 2, 2026',
    statusLabel: 'Completed',
    statusVariant: 'green',
    initialPosts: [
      { id: 1, initials: 'NK', avatarBg: '#FFF3E0', avatarColor: '#B85A00', authorName: 'Nimal Kumarasinghe', authorTag: '(You)', text: 'Great work on the foundation! Everything looks solid. Ready to proceed to Task 2.', time: 'April 2, 2026', mine: true },
      { id: 2, initials: 'SK', avatarBg: '#E6F4EC', avatarColor: '#1B6E3A', authorName: 'Sunil Karunaratne', authorTag: '· Mason', text: 'Thank you! The foundation depth is 1.2m with proper reinforcement. All curing is complete.', time: 'April 2, 2026', mine: false },
    ],
  },
];

export default function PropertyOwnerForumPage() {
  const [threads, setThreads] = useState(DEFAULT_THREADS);
  const [activeThreadId, setActiveThreadId] = useState('task-3');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load threads list from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crewsync_forum_threads');
      if (saved) {
        try {
          setThreads(JSON.parse(saved));
        } catch (e) {
          setThreads(DEFAULT_THREADS);
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save threads list to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('crewsync_forum_threads', JSON.stringify(threads));
    }
  }, [threads, isLoaded]);

  function handleCreateThread() {
    const title = newThreadTitle.trim();
    if (!title) return;
    const newId = `task-${Date.now()}`;
    const newT = {
      id: newId,
      title: title.startsWith('Task') ? title : `Task: ${title}`,
      meta: '1 participant · Last activity: Just now',
      statusLabel: 'Active',
      statusVariant: 'amber',
      initialPosts: [],
    };
    setThreads((prev) => [...prev, newT]);
    setActiveThreadId(newId);
    setNewThreadTitle('');
  }

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  return (
    <div>
      <DashHeader
        title="Project Forum"
        subtitle="Communicate with your service providers on each task"
      />

      <div className="grid md:grid-cols-[250px_1fr] gap-5 items-start">
        {/* Threads Sidebar */}
        <Card className="p-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8FA8] mb-3 px-2">Task Threads</h4>
          <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThreadId(t.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all border ${
                  activeThreadId === t.id
                    ? 'bg-[#FFF3E0] border-[#E8820C]/20 text-[#B85A00] font-medium'
                    : 'bg-white border-transparent hover:bg-[#F7F6F2] text-[#4A5068]'
                }`}
              >
                <div className="text-sm truncate">{t.title}</div>
                <div className="text-[10px] text-[#8A8FA8] mt-0.5 truncate">{t.meta}</div>
              </button>
            ))}
          </div>

          <div className="border-t border-black/10 mt-3 pt-3">
            <input
              type="text"
              placeholder="New task thread name..."
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateThread()}
              className="w-full border border-black/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-[#E8820C] mb-2 bg-[#F7F6F2]"
            />
            <button
              onClick={handleCreateThread}
              className="w-full bg-[#E8820C] hover:bg-[#B85A00] text-white text-xs font-semibold py-1.5 rounded-lg text-center transition-colors cursor-pointer"
            >
              + Create Thread
            </button>
          </div>
        </Card>

        {/* Selected Thread Forum */}
        <div>
          {activeThread && (
            <ProjectForum
              key={activeThread.id}
              title={activeThread.title}
              meta={activeThread.meta}
              statusLabel={activeThread.statusLabel}
              statusVariant={activeThread.statusVariant}
              currentUser={CURRENT_USER}
              mineBubbleColor="#FFF3E0"
              initialPosts={activeThread.initialPosts}
            />
          )}
        </div>
      </div>
    </div>
  );
}