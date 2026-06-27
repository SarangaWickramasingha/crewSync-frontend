'use client';

import { useState } from 'react';
import StatusPill from './StatusPill';

export default function ProjectForum({
  title,
  meta,
  statusLabel,
  statusVariant = 'amber',
  initialPosts = [],
  currentUser,
  mineBubbleColor = '#FFF3E0',
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [input, setInput] = useState('');

  function postComment() {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `Today, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    setPosts((p) => [
      ...p,
      {
        id: Date.now(),
        initials: currentUser.initials,
        avatarBg: currentUser.avatarBg,
        avatarColor: currentUser.avatarColor,
        authorName: currentUser.name,
        authorTag: '(You)',
        text,
        time,
        mine: true,
      },
    ]);
    setInput('');
  }

  return (
    <div className="bg-white border border-black/10 rounded-xl p-6 mb-5">
      <div className="flex justify-between items-center flex-wrap gap-2 mb-5">
        <div>
          <h3 className="font-syne text-base font-bold">{title}</h3>
          <div className="text-xs text-[#8A8FA8] mt-0.5">{meta}</div>
        </div>
        <StatusPill variant={statusVariant}>{statusLabel}</StatusPill>
      </div>

      <div className="flex flex-col gap-2.5">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.72rem] flex-shrink-0"
              style={{ background: post.avatarBg, color: post.avatarColor }}
            >
              {post.initials}
            </div>
            <div
              className="flex-1 rounded-lg px-3 py-2.5"
              style={{ background: post.mine ? mineBubbleColor : '#F7F6F2' }}
            >
              <div className="text-xs font-semibold mb-0.5">
                {post.authorName}{' '}
                <span className="font-normal text-[#8A8FA8]">{post.authorTag}</span>
              </div>
              <div className="text-sm text-[#4A5068] leading-relaxed">{post.text}</div>
              <div className="text-[0.68rem] text-[#8A8FA8] mt-1">{post.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-black/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && postComment()}
          placeholder="Add a comment to this project thread…"
          className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
        />
        <button
          onClick={postComment}
          className="bg-[#E8820C] hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
        >
          Post
        </button>
      </div>
    </div>
  );
}