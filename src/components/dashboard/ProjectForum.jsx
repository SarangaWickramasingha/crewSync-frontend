'use client';

import { useState } from 'react';
import StatusPill from '@/src/components/ui/StatusPill';
import { useComments, usePostComment } from '@/src/hooks/project/useProject';

const AVATAR_STYLES = [
  { bg: '#FFF3E0', color: '#B85A00' },
  { bg: '#E6F4EC', color: '#1B6E3A' },
  { bg: '#E8F0FB', color: '#1A56A0' },
  { bg: '#F3E8FB', color: '#6B3FA0' },
];

function initialsOf(name) {
  return (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function avatarFor(userId) {
  return AVATAR_STYLES[userId % AVATAR_STYLES.length];
}

function fmtTime(mysqlTs) {
  const d = new Date(mysqlTs.replace(' ', 'T'));
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  if (sameDay) return `Today, ${h}:${m} ${ampm}`;
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${h}:${m} ${ampm}`;
}

export default function ProjectForum({
  projectId,
  title,
  meta,
  statusLabel,
  statusVariant = 'amber',
  mineBubbleColor = '#FFF3E0',
}) {
  const [input, setInput] = useState('');

  const { data, isPending } = useComments(projectId);
  const postComment = usePostComment(projectId);

  const posts = data?.comments ?? [];
  const currentUserId = data?.current_user_id ?? null;
  const loading = isPending;
  const posting = postComment.isPending;

  async function handlePostComment() {
    const text = input.trim();
    if (!text || !projectId || posting) return;
    try {
      await postComment.mutateAsync(text);
      setInput('');
    } catch (e) {
      console.error('Failed to post comment:', e);
    }
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
        {loading && <div className="text-sm text-[#8A8FA8] py-4 text-center">Loading comments…</div>}
        {!loading && posts.length === 0 && (
          <div className="text-sm text-[#8A8FA8] py-4 text-center">
            No comments yet — start the discussion below.
          </div>
        )}
        {posts.map((post) => {
          const mine = post.user_id === currentUserId;
          const av = avatarFor(post.user_id);
          return (
            <div key={post.comment_id} className="flex gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[0.72rem] flex-shrink-0"
                style={{ background: av.bg, color: av.color }}
              >
                {initialsOf(post.author_name)}
              </div>
              <div
                className="flex-1 rounded-lg px-3 py-2.5"
                style={{ background: mine ? mineBubbleColor : '#F7F6F2' }}
              >
                <div className="text-xs font-semibold mb-0.5">
                  {post.author_name}{' '}
                  <span className="font-normal text-[#8A8FA8]">
                    {mine ? '(You)' : post.author_role ? `· ${post.author_role}` : ''}
                  </span>
                </div>
                <div className="text-sm text-[#4A5068] leading-relaxed">{post.comment}</div>
                <div className="text-[0.68rem] text-[#8A8FA8] mt-1">{fmtTime(post.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-black/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
          placeholder="Add a comment to this project thread…"
          className="flex-1 border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8820C]"
          disabled={!projectId}
        />
        <button
          onClick={handlePostComment}
          disabled={posting || !projectId}
          className="bg-[#E8820C] hover:opacity-90 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-lg whitespace-nowrap"
        >
          {posting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  );
}
