'use strict';

const FALLBACK_CONTENT = {"site": {"studioName": "Madik Studio", "heroTitle": "Пространства, в которых хочется оставаться", "heroSubtitle": "Интерьеры и экстерьеры с ясной архитектурой, естественными материалами и вниманием к повседневной жизни.", "introTitle": "Проекты без визуального шума", "introText": "Madik Studio создаёт спокойные, выразительные пространства. В основе каждого проекта — точная работа с пропорциями, светом, материалами и контекстом.", "aboutTitle": "Мадик — дизайнер интерьеров и экстерьеров", "aboutText": "Проектирует жилые и общественные пространства от первой идеи до цельного визуального образа. Главная задача — соединить эстетику, функциональность и характер заказчика без лишнего декора.", "email": "hello@madikstudio.com", "phone": "+7 000 000-00-00", "location": "Россия", "instagram": "", "behance": ""}, "projects": [{"slug": "kvartira-u-gor", "title": "Квартира у гор", "subtitle": "Тёплый минимализм и тактильные материалы", "category": "Интерьер", "year": 2026, "location": "Карачаево-Черкесия", "area": "124 м²", "excerpt": "Спокойный жилой интерьер, построенный на естественном свете, древесине, камне и мягких переходах между общими и приватными пространствами.", "cover": "images/placeholders/project-01.svg", "gallery": ["images/placeholders/project-01-detail.svg", "images/placeholders/project-02.svg", "images/placeholders/project-03.svg"], "body": "Планировка раскрывает длинные видовые оси и сохраняет ощущение свободного пространства. Центральная зона объединяет кухню, столовую и гостиную, но каждое место получает собственный характер за счёт света и материалов.\n\nВ отделке использованы спокойные натуральные фактуры. Архитектурные детали почти не отделяются от функциональных элементов, поэтому интерьер воспринимается цельным и не перегруженным.", "featured": true, "published": true, "order": 1}, {"slug": "dom-s-vnutrennim-dvorom", "title": "Дом с внутренним двором", "subtitle": "Архитектура вокруг приватного сада", "category": "Экстерьер", "year": 2026, "location": "Северный Кавказ", "area": "286 м²", "excerpt": "Одноэтажный дом, организованный вокруг защищённого внутреннего двора и системы открытых террас.", "cover": "images/placeholders/project-02.svg", "gallery": ["images/placeholders/project-02-detail.svg", "images/placeholders/project-03.svg"], "body": "Объём дома формирует спокойную границу между улицей и приватной жизнью семьи. Основные помещения обращены во внутренний сад, где архитектура постепенно переходит в ландшафт.\n\nКаменное основание, глубокие проёмы и деревянные поверхности подчёркивают связь здания с местом и защищают интерьер от избыточного солнца.", "featured": true, "published": true, "order": 2}, {"slug": "tihiy-ofis", "title": "Тихий офис", "subtitle": "Рабочее пространство без визуального шума", "category": "Интерьер", "year": 2025, "location": "Москва", "area": "210 м²", "excerpt": "Сдержанный офис с гибкими рабочими зонами, мягкой акустикой и ясной системой навигации.", "cover": "images/placeholders/project-03.svg", "gallery": [], "body": "Пространство построено как последовательность открытых рабочих зон и небольших комнат для сосредоточенной работы. Мебель и свет задают ритм, не дробя помещение постоянными перегородками.", "featured": true, "published": true, "order": 3}], "posts": []};

const state = {
  site: FALLBACK_CONTENT.site,
  projects: FALLBACK_CONTENT.projects,
  posts: FALLBACK_CONTENT.posts
};

const dataCache = new Map();

async function loadJson(path, fallback) {
  if (dataCache.has(path)) return dataCache.get(path);
  const promise = fetch(path, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Не удалось загрузить ${path}: ${response.status}`);
      return response.json();
    })
    .catch((error) => {
      console.warn(error.message, 'Используются встроенные резервные данные.');
      return fallback;
    });
  dataCache.set(path, promise);
  return promise;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeUrl(value = '') {
  const url = String(value).trim();
  if (!url) return '';
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url;
  if (url.startsWith('/MadikStudio/')) return `./${url.slice('/MadikStudio/'.length)}`;
  if (url.startsWith('/')) return `.${url}`;
  return url;
}

function imagePath(value = '') {
  return safeUrl(value) || 'images/placeholders/project-01.svg';
}

function normalizeSlug(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё-]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

function formatDate(value = '') {
  if (!value) return '';
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(parsed);
}

function inlineMarkdown(value = '') {
  let text = escapeHtml(value);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return text;
}

function renderMarkdown(value = '') {
  const lines = String(value).replace(/\r/g, '').split('\n');
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith('### ')) {
      flushParagraph(); flushList();
      blocks.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph(); flushList();
      blocks.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith('- ')) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return blocks.join('');
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name) || '';
}

function projectLink(project) {
  const slug = normalizeSlug(project.slug || project.title);
  return `project.html?id=${encodeURIComponent(slug)}`;
}

function postLink(post) {
  const slug = normalizeSlug(post.slug || post.title);
  return `post.html?id=${encodeURIComponent(slug)}`;
}

function renderProjectCard(project, index = 0) {
  const href = projectLink(project);
  const cover = imagePath(project.cover);
  return `
    <article class="project-card" style="--delay:${Math.min(index * 55, 330)}ms">
      <a class="project-card__image" href="${href}">
        <img src="${escapeHtml(cover)}" alt="Проект «${escapeHtml(project.title)}»" loading="${index > 1 ? 'lazy' : 'eager'}">
      </a>
      <div class="project-card__meta">
        <div>
          <h2><a href="${href}">${escapeHtml(project.title)}</a></h2>
          <p>${escapeHtml(project.category || '')}${project.location ? ` · ${escapeHtml(project.location)}` : ''}</p>
        </div>
        <span>${escapeHtml(project.year || '')}</span>
      </div>
    </article>`;
}

function renderPostCard(post, index = 0) {
  const href = postLink(post);
  const cover = imagePath(post.cover);
  return `
    <article class="post-card" style="--delay:${Math.min(index * 55, 330)}ms">
      <a class="post-card__image" href="${href}">
        <img src="${escapeHtml(cover)}" alt="${escapeHtml(post.title)}" loading="${index > 1 ? 'lazy' : 'eager'}">
      </a>
      <div class="post-card__meta">
        <div>
          <h2><a href="${href}">${escapeHtml(post.title)}</a></h2>
          <p>${escapeHtml(post.category || 'Публикация')}</p>
        </div>
        <span>${escapeHtml(formatDate(post.date))}</span>
      </div>
    </article>`;
}

function sortedPublished(items) {
  return [...items]
    .filter((item) => item && item.published !== false)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0) || String(b.date || '').localeCompare(String(a.date || '')) || Number(b.year || 0) - Number(a.year || 0));
}

function applySiteData(site) {
  document.querySelectorAll('[data-site-text]').forEach((element) => {
    const key = element.dataset.siteText;
    if (key && site[key] !== undefined) element.textContent = site[key];
  });

  document.querySelectorAll('[data-site-email]').forEach((element) => {
    element.textContent = site.email || '';
    element.setAttribute('href', `mailto:${site.email || ''}`);
  });

  document.querySelectorAll('[data-site-phone]').forEach((element) => {
    element.textContent = site.phone || '';
    element.setAttribute('href', `tel:${String(site.phone || '').replace(/[^+\d]/g, '')}`);
  });

  document.querySelectorAll('[data-site-location]').forEach((element) => {
    element.textContent = site.location || '';
  });

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
}

function setupNavigation() {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  if (!button || !nav) return;

  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    nav.removeAttribute('data-open');
    document.body.classList.remove('nav-open');
  };

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.toggleAttribute('data-open', !open);
    document.body.classList.toggle('nav-open', !open);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) close();
  });
}

function setActiveNavigation() {
  const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const href = (link.getAttribute('href') || '').split('?')[0].toLowerCase();
    const active =
      (file === 'index.html' && href === 'index.html') ||
      (['projects.html', 'project.html'].includes(file) && href === 'projects.html') ||
      (['posts.html', 'post.html'].includes(file) && href === 'posts.html') ||
      file === href;
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function updatePostsNavigation(posts) {
  const hasPosts = sortedPublished(posts).length > 0;
  document.querySelectorAll('.dynamic-nav-link').forEach((link) => {
    link.hidden = !hasPosts;
  });
}

function renderHomeProjects(projects) {
  const grid = document.querySelector('[data-home-projects]');
  if (!grid) return;
  const visible = sortedPublished(projects).filter((item) => item.featured !== false);
  grid.innerHTML = visible.length
    ? visible.map(renderProjectCard).join('')
    : '<div class="empty-state"><h2>Проекты скоро появятся</h2><p>Новые работы можно добавить через Pages CMS без изменения HTML-кода.</p></div>';
}

function renderProjectsPage(projects) {
  const grid = document.querySelector('[data-projects-grid]');
  if (!grid) return;
  const visible = sortedPublished(projects);
  grid.innerHTML = visible.length
    ? visible.map(renderProjectCard).join('')
    : '<div class="empty-state"><h2>Проектов пока нет</h2><p>Добавьте первый проект через Pages CMS.</p></div>';
}

function renderPostsPage(posts) {
  const grid = document.querySelector('[data-posts-grid]');
  if (!grid) return;
  const visible = sortedPublished(posts);
  grid.innerHTML = visible.length
    ? visible.map(renderPostCard).join('')
    : '<div class="empty-state"><h2>Публикаций пока нет</h2><p>Раздел уже готов. Первый пост можно добавить через Pages CMS.</p></div>';
}

function renderProjectPage(projects) {
  const container = document.querySelector('[data-project-page]');
  if (!container) return;
  const requested = normalizeSlug(getQueryParam('id'));
  const project = sortedPublished(projects).find((item) => normalizeSlug(item.slug || item.title) === requested);

  if (!project) {
    document.title = 'Проект не найден — Madik Studio';
    container.innerHTML = `
      <section class="not-found shell">
        <p class="eyebrow">Ошибка 404</p>
        <h1>Проект не найден</h1>
        <a class="text-link" href="projects.html">Все проекты <span>↗</span></a>
      </section>`;
    return;
  }

  document.title = `${project.title} — Madik Studio`;
  const gallery = Array.isArray(project.gallery) ? project.gallery.filter(Boolean) : [];
  container.innerHTML = `
    <article class="project-page">
      <header class="project-hero shell">
        <p class="eyebrow">${escapeHtml(project.category || 'Проект')}</p>
        <h1>${escapeHtml(project.title)}</h1>
        ${project.subtitle ? `<p class="project-subtitle">${escapeHtml(project.subtitle)}</p>` : ''}
        <dl class="project-facts">
          ${project.year ? `<div><dt>Год</dt><dd>${escapeHtml(project.year)}</dd></div>` : ''}
          ${project.location ? `<div><dt>Локация</dt><dd>${escapeHtml(project.location)}</dd></div>` : ''}
          ${project.area ? `<div><dt>Площадь</dt><dd>${escapeHtml(project.area)}</dd></div>` : ''}
        </dl>
      </header>
      <figure class="project-cover shell shell--wide">
        <img src="${escapeHtml(imagePath(project.cover))}" alt="Проект «${escapeHtml(project.title)}»">
      </figure>
      <div class="project-story shell">
        <p class="lead">${escapeHtml(project.excerpt || '')}</p>
        <div class="prose">${renderMarkdown(project.body || '')}</div>
      </div>
      ${gallery.length ? `
        <section class="project-gallery shell shell--wide" aria-label="Фотографии проекта «${escapeHtml(project.title)}»">
          ${gallery.map((image, index) => `
            <figure class="gallery-item ${index % 3 === 2 ? 'gallery-item--narrow' : ''}">
              <img src="${escapeHtml(imagePath(image))}" alt="${escapeHtml(project.title)}, фотография ${index + 1}" loading="lazy">
            </figure>`).join('')}
        </section>` : ''}
    </article>`;
}

function renderPostPage(posts) {
  const container = document.querySelector('[data-post-page]');
  if (!container) return;
  const requested = normalizeSlug(getQueryParam('id'));
  const post = sortedPublished(posts).find((item) => normalizeSlug(item.slug || item.title) === requested);

  if (!post) {
    document.title = 'Публикация не найдена — Madik Studio';
    container.innerHTML = `
      <section class="not-found shell">
        <p class="eyebrow">Ошибка 404</p>
        <h1>Публикация не найдена</h1>
        <a class="text-link" href="posts.html">Все публикации <span>↗</span></a>
      </section>`;
    return;
  }

  document.title = `${post.title} — Madik Studio`;
  const gallery = Array.isArray(post.gallery) ? post.gallery.filter(Boolean) : [];
  container.innerHTML = `
    <article class="post-page">
      <header class="post-hero shell">
        <p class="eyebrow">${escapeHtml(post.category || 'Публикация')}</p>
        <h1>${escapeHtml(post.title)}</h1>
        ${post.subtitle ? `<p class="post-subtitle">${escapeHtml(post.subtitle)}</p>` : ''}
        <dl class="post-facts">
          ${post.date ? `<div><dt>Дата</dt><dd>${escapeHtml(formatDate(post.date))}</dd></div>` : ''}
        </dl>
      </header>
      ${post.cover ? `<figure class="post-cover shell shell--wide"><img src="${escapeHtml(imagePath(post.cover))}" alt="${escapeHtml(post.title)}"></figure>` : ''}
      <div class="post-story shell">
        <p class="lead">${escapeHtml(post.excerpt || '')}</p>
        <div class="prose">${renderMarkdown(post.body || '')}</div>
      </div>
      ${gallery.length ? `
        <section class="post-gallery shell shell--wide" aria-label="Фотографии публикации «${escapeHtml(post.title)}»">
          ${gallery.map((image, index) => `
            <figure class="gallery-item ${index % 3 === 2 ? 'gallery-item--narrow' : ''}">
              <img src="${escapeHtml(imagePath(image))}" alt="${escapeHtml(post.title)}, фотография ${index + 1}" loading="lazy">
            </figure>`).join('')}
        </section>` : ''}
    </article>`;
}

async function init() {
  setupNavigation();
  setActiveNavigation();

  const [site, projects, posts] = await Promise.all([
    loadJson('data/site.json', FALLBACK_CONTENT.site),
    loadJson('data/projects.json', FALLBACK_CONTENT.projects),
    loadJson('data/posts.json', FALLBACK_CONTENT.posts)
  ]);

  state.site = site;
  state.projects = Array.isArray(projects) ? projects : [];
  state.posts = Array.isArray(posts) ? posts : [];

  applySiteData(state.site);
  updatePostsNavigation(state.posts);
  renderHomeProjects(state.projects);
  renderProjectsPage(state.projects);
  renderProjectPage(state.projects);
  renderPostsPage(state.posts);
  renderPostPage(state.posts);
}

document.addEventListener('DOMContentLoaded', init);
