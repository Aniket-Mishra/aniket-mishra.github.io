import { renderHeader, renderFooter, setupReveal } from "/js/shared.js";

function renderPostList(posts) {
  if (posts.length === 0) return `<p>No posts yet. Soon.</p>`;
  const items = posts.map(post => `
    <li class="post-item reveal">
      <a href="/blog/${post.slug}.html">
        <span class="post-date">${post.displayDate}</span>
        <h3>${post.title}</h3>
        <p class="post-summary">${post.summary}</p>
      </a>
    </li>
  `).join("");
  return `<ul class="post-list">${items}</ul>`;
}

async function loadPosts() {
  try {
    const response = await fetch("/blog/posts.json");
    if (!response.ok) throw new Error("posts.json missing");
    return await response.json();
  } catch {
    return [];
  }
}

async function init() {
  renderHeader("blog");
  renderFooter();
  const posts = await loadPosts();
  document.getElementById("post-list-mount").innerHTML = renderPostList(posts);
  setupReveal();
}

init();
