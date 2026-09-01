'use client';

import React, { Fragment, useMemo } from 'react';

// Renders a notification message WITHOUT dangerouslySetInnerHTML.
// The server already sanitizes to an inline subset (<strong>/<b>/<em>/<i>/<u>
// /<span>/<a href="...">/<br>), but we still render through a strict allow-list
// so nothing the server can't control ever reaches the DOM as markup.
const ALLOWED_TAGS = new Set(['strong', 'b', 'em', 'i', 'u', 'span', 'a', 'br']);
const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'iframe',
  'object',
  'embed',
  'form',
  'link',
  'meta',
  'base',
  'svg',
  'math',
  'template',
]);

function isSafeHref(href) {
  if (!href || /\s/.test(href)) return false;
  return /^#/.test(href) || /^\//.test(href) || /^https?:\/\//i.test(href);
}

function reactify(node, key) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const tag = node.tagName.toLowerCase();
  if (BLOCKED_TAGS.has(tag)) return null;

  const children = [...node.childNodes].map((child, i) => reactify(child, `${key}-${i}`));

  if (!ALLOWED_TAGS.has(tag)) {
    return <Fragment key={key}>{children}</Fragment>;
  }

  if (tag === 'a') {
    const href = node.getAttribute('href') || '';
    return isSafeHref(href) ? (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <span key={key}>{children}</span>
    );
  }

  return React.createElement(tag, { key }, children);
}

export default function NotificationText({ html }) {
  const content = useMemo(() => {
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') {
      return html || '';
    }
    const doc = new DOMParser().parseFromString(html || '', 'text/html');
    return reactify(doc.body, 'root');
  }, [html]);

  return <>{content}</>;
}