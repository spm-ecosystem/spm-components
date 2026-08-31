// @vitest-environment jsdom
import { createRoot } from 'react-dom/client';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
  UiCommentListPage,
  UiCommentCard,
  UiCommentReply,
  CommentThread,
  CommentItem,
  TagItem,
} from '../dedicated/UiCommentListPage';

const waitForUpdate = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('UiCommentListPage & Sub-components', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('UiCommentReply', () => {
    it('renders comment author, date, and body correctly', async () => {
      const comment: CommentItem = {
        author: 'JohnDoe',
        authorUrl: '/user/johndoe',
        date: '2026-08-31',
        body: 'This is a sample comment reply.',
      };

      const root = createRoot(container);
      root.render(<UiCommentReply comment={comment} />);
      await waitForUpdate();

      const authorLink = container.querySelector('a');
      expect(authorLink).toBeTruthy();
      expect(authorLink?.textContent).toBe('JohnDoe');
      expect(authorLink?.getAttribute('href')).toBe('/user/johndoe');

      const dateSpan = container.querySelector('.spm-comment-reply-header span');
      expect(dateSpan).toBeTruthy();
      expect(dateSpan?.textContent).toBe('2026-08-31');

      const bodyP = container.querySelector('p');
      expect(bodyP?.textContent).toBe('This is a sample comment reply.');
    });

    it('defaults missing or empty author to Anonymous without dangling prefixes', async () => {
      const commentWithEmptyAuthor: CommentItem = {
        author: '',
        body: 'Anonymous comment.',
      };

      const root = createRoot(container);
      root.render(<UiCommentReply comment={commentWithEmptyAuthor} />);
      await waitForUpdate();

      const authorLink = container.querySelector('a');
      expect(authorLink?.textContent).toBe('Anonymous');
      expect(authorLink?.getAttribute('href')).toBe('#');

      const commentWithPrefixOnly: CommentItem = {
        author: 'Posted by: ',
        body: 'Another anonymous comment.',
      };

      root.render(<UiCommentReply comment={commentWithPrefixOnly} />);
      await waitForUpdate();

      const authorLink2 = container.querySelector('a');
      expect(authorLink2?.textContent).toBe('Anonymous');
      expect(authorLink2?.textContent).not.toContain('Posted by:');
    });

    it('omits timestamp when date is missing without rendering empty span or dangling bullet', async () => {
      const commentWithoutDate: CommentItem = {
        author: 'Alice',
        body: 'No date comment.',
      };

      const root = createRoot(container);
      root.render(<UiCommentReply comment={commentWithoutDate} />);
      await waitForUpdate();

      const spans = container.querySelectorAll('.spm-comment-reply-header span');
      expect(spans.length).toBe(0);
      expect(container.textContent).not.toContain('•');
    });

    it('strips leading bullets or Date prefixes from timestamp string', async () => {
      const commentWithBulletDate: CommentItem = {
        author: 'Alice',
        date: '• Date: 2026-08-31',
        body: 'Bullet date comment.',
      };

      const root = createRoot(container);
      root.render(<UiCommentReply comment={commentWithBulletDate} />);
      await waitForUpdate();

      const dateSpan = container.querySelector('.spm-comment-reply-header span');
      expect(dateSpan?.textContent).toBe('2026-08-31');
      expect(dateSpan?.textContent).not.toContain('•');
      expect(dateSpan?.textContent).not.toContain('Date:');
    });
  });

  describe('UiCommentCard', () => {
    const sampleThread: CommentThread = {
      id: 'thread-1',
      thumbnailUrl: 'https://example.com/thumb.jpg',
      postUrl: '/post/1',
      postDate: '2026-08-30',
      postUser: 'admin_user',
      postRating: 'Safe',
      postScore: '42',
      tags: [
        { label: 'artist_name', url: '/tag/artist', type: 'artist' },
        { label: 'character_name', url: '/tag/char', type: 'character' },
        { label: 'series_name', url: '/tag/copy', type: 'copyright' },
        { label: 'meta_tag', url: '/tag/meta', type: 'metadata' },
        { label: 'general_tag', url: '/tag/gen', type: 'general' },
      ],
      comments: [
        { author: 'User1', date: '2026-08-30', body: 'First comment' },
        { author: 'User2', date: '2026-08-31', body: 'Second comment' },
      ],
    };

    it('renders thumbnail, metadata, tags, and comment replies when all data is present', async () => {
      const root = createRoot(container);
      root.render(<UiCommentCard thread={sampleThread} />);
      await waitForUpdate();

      // Check thumbnail
      const thumbnailCol = container.querySelector('.spm-comment-card-thumbnail');
      expect(thumbnailCol).toBeTruthy();
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.src).toBe('https://example.com/thumb.jpg');

      // Check post header metadata
      const header = container.querySelector('.spm-comment-card-header');
      expect(header).toBeTruthy();
      expect(header?.textContent).toContain('Date: 2026-08-30');
      expect(header?.textContent).toContain('Posted by: admin_user');
      expect(header?.textContent).toContain('Rating: Safe');
      expect(header?.textContent).toContain('Score: 42');

      // Check tags
      const tagLinks = container.querySelectorAll('.spm-comment-card-content > div:last-child a');
      expect(tagLinks.length).toBe(5);

      // Check replies
      const replies = container.querySelectorAll('.spm-comment-reply');
      expect(replies.length).toBe(2);
    });

    it('does NOT render img tag or 130px column when thumbnailUrl is undefined or empty string', async () => {
      const threadNoThumb: CommentThread = {
        ...sampleThread,
        thumbnailUrl: '',
      };

      const root = createRoot(container);
      root.render(<UiCommentCard thread={threadNoThumb} />);
      await waitForUpdate();

      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelector('.spm-comment-card-thumbnail')).toBeNull();
      // Verify no element with 130px width
      const elementsWith130px = Array.from(container.querySelectorAll('*')).filter((el) => {
        return (el as HTMLElement).style?.width === '130px';
      });
      expect(elementsWith130px.length).toBe(0);

      // Also test with undefined thumbnailUrl
      const threadUndefinedThumb: CommentThread = {
        ...sampleThread,
        thumbnailUrl: undefined,
      };
      root.render(<UiCommentCard thread={threadUndefinedThumb} />);
      await waitForUpdate();

      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelector('.spm-comment-card-thumbnail')).toBeNull();
    });

    it('does NOT render thumbnail when showThumbnails is false even if thumbnailUrl is provided', async () => {
      const root = createRoot(container);
      root.render(<UiCommentCard thread={sampleThread} showThumbnails={false} />);
      await waitForUpdate();

      expect(container.querySelector('img')).toBeNull();
      expect(container.querySelector('.spm-comment-card-thumbnail')).toBeNull();
    });

    it('defaults missing postUser to Anonymous and safely omits missing date/rating/score', async () => {
      const threadMissingMeta: CommentThread = {
        id: 'thread-2',
        postUrl: '/post/2',
        postUser: '',
        postDate: '',
        postRating: '',
        postScore: '',
      };

      const root = createRoot(container);
      root.render(<UiCommentCard thread={threadMissingMeta} />);
      await waitForUpdate();

      const header = container.querySelector('.spm-comment-card-header');
      expect(header).toBeTruthy();
      expect(header?.textContent).toContain('Posted by: Anonymous');
      expect(header?.textContent).not.toContain('Date:');
      expect(header?.textContent).not.toContain('Rating:');
      expect(header?.textContent).not.toContain('Score:');

      // Test with postUser = "Posted by: "
      const threadWithPrefix: CommentThread = {
        ...threadMissingMeta,
        postUser: 'Posted by: ',
      };
      root.render(<UiCommentCard thread={threadWithPrefix} />);
      await waitForUpdate();

      const header2 = container.querySelector('.spm-comment-card-header');
      expect(header2?.textContent).toContain('Posted by: Anonymous');
    });

    it('handles hover states on thumbnail container', async () => {
      const root = createRoot(container);
      root.render(<UiCommentCard thread={sampleThread} />);
      await waitForUpdate();

      const thumbAnchor = container.querySelector('.spm-comment-card-thumbnail a') as HTMLElement;
      expect(thumbAnchor).toBeTruthy();

      thumbAnchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      thumbAnchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await waitForUpdate();
      expect(thumbAnchor.style.borderColor).toContain('var(--spm-accent)');

      thumbAnchor.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
      thumbAnchor.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      await waitForUpdate();
      expect(thumbAnchor.style.borderColor).toContain('var(--spm-border)');
    });
  });

  describe('UiCommentListPage Component', () => {
    it('renders pageTitle, header, and pagination links', async () => {
      const pageLinks = [
        { label: '1', url: '/comments?pid=0' },
        { label: '2', url: '/comments?pid=10' },
      ];

      const root = createRoot(container);
      root.render(
        <UiCommentListPage
          pageTitle="Discussion Feed"
          threads={[]}
          pageLinks={pageLinks}
        />
      );
      await waitForUpdate();

      const titleEl = container.querySelector('h1');
      expect(titleEl?.textContent).toBe('Discussion Feed');

      const paginationNav = container.querySelector('nav[aria-label="Pagination"]');
      expect(paginationNav).toBeTruthy();

      // Empty state
      expect(container.textContent).toContain('No comments found.');
    });

    it('renders threads and respects showThumbnails prop', async () => {
      const threads: CommentThread[] = [
        {
          id: 't-1',
          thumbnailUrl: 'https://example.com/t1.jpg',
          postUrl: '/post/1',
          postUser: 'User1',
          comments: [{ author: 'User1', body: 'Hello world' }],
        },
        {
          id: 't-2',
          thumbnailUrl: 'https://example.com/t2.jpg',
          postUrl: '/post/2',
          postUser: 'User2',
          comments: [{ author: 'User2', body: 'Second post' }],
        },
      ];

      const root = createRoot(container);
      root.render(<UiCommentListPage threads={threads} showThumbnails={false} />);
      await waitForUpdate();

      const cards = container.querySelectorAll('.spm-comment-card');
      expect(cards.length).toBe(2);

      // Verify no thumbnails are rendered
      expect(container.querySelectorAll('img').length).toBe(0);
      expect(container.querySelectorAll('.spm-comment-card-thumbnail').length).toBe(0);

      // Re-render with showThumbnails = true (default)
      root.render(<UiCommentListPage threads={threads} showThumbnails={true} />);
      await waitForUpdate();

      expect(container.querySelectorAll('img').length).toBe(2);
      expect(container.querySelectorAll('.spm-comment-card-thumbnail').length).toBe(2);
    });

    it('applies custom className and inline style to root element', async () => {
      const root = createRoot(container);
      root.render(
        <UiCommentListPage
          className="custom-feed-class"
          style={{ backgroundColor: 'rgb(10, 10, 10)' }}
        />
      );
      await waitForUpdate();

      const rootEl = container.querySelector('.spm-comment-list-page');
      expect(rootEl?.classList.contains('custom-feed-class')).toBe(true);
      expect((rootEl as HTMLElement).style.backgroundColor).toBe('rgb(10, 10, 10)');
    });
  });
});
