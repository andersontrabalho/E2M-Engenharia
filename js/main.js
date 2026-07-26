document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initMobileMenu();
  initProjectCovers();
  initProjectModal();
  initFadeIn();
  initContactForm();
});

function initLanguage() {
  applyLanguage(getCurrentLang());

  document.querySelectorAll('.lang-switch__btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.setLang));
  });
}

function filterProjects(disc, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.project-card').forEach(card => {
    const match = disc === 'all' || card.dataset.disc === disc;
    card.classList.toggle('is-hidden', !match);
  });
}

let lightboxImages = [];
let lightboxIndex = 0;

function initProjectCovers() {
  document.querySelectorAll('.project-img').forEach(wrapper => {
    const img = wrapper.querySelector('.project-cover');
    if (!img) return;

    const test = new Image();
    test.onload = () => {
      img.src = test.src;
      wrapper.classList.add('has-cover');
    };
    test.onerror = () => img.remove();
    test.src = img.dataset.src || img.getAttribute('src');
  });
}

function initProjectModal() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openProjectModal(card));
  });

  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', closeProjectModal);
  });

  document.querySelectorAll('[data-close-lightbox]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.getElementById('lightboxPrev')?.addEventListener('click', () => stepLightbox(-1));
  document.getElementById('lightboxNext')?.addEventListener('click', () => stepLightbox(1));

  document.addEventListener('keydown', e => {
    const lightboxOpen = document.getElementById('lightbox')?.classList.contains('is-open');
    if (e.key === 'Escape') {
      if (lightboxOpen) closeLightbox();
      else closeProjectModal();
      return;
    }
    if (lightboxOpen && e.key === 'ArrowLeft') stepLightbox(-1);
    if (lightboxOpen && e.key === 'ArrowRight') stepLightbox(1);
  });
}

async function loadExistingImages(basePath) {
  const names = ['cover.jpg', '01.jpg', '02.jpg', '03.jpg'];
  const found = [];

  for (const name of names) {
    const src = `${basePath}/${name}`;
    const ok = await new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
    if (ok) found.push(src);
  }

  return found;
}

async function openProjectModal(card) {
  const projectId = card.dataset.project;
  if (!projectId) return;

  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');
  const lang = getCurrentLang();
  const basePath = `assets/projects/${projectId}`;

  const titleEl = card.querySelector('.project-title');
  const descEl = card.querySelector('.project-desc');
  const title = titleEl ? t(titleEl.dataset.i18n, lang) : '';
  const desc = descEl ? t(descEl.dataset.i18n, lang) : '';
  const client = card.querySelector('.project-client')?.textContent;
  const deliverables = [...card.querySelectorAll('.deliverable')].map(el => el.textContent);

  const images = await loadExistingImages(basePath);
  const galleryHtml = images.length
    ? images.map((src, i) => `
        <button type="button" class="modal__gallery-item" data-lightbox-index="${i}" aria-label="${t('modal.expand', lang)} ${i + 1}">
          <img src="${src}" alt="${title}" loading="lazy">
        </button>`).join('')
    : `<p style="color:var(--text3);font-size:0.875rem">${t('modal.imagesSoon', lang)}</p>`;

  content.innerHTML = `
    <div class="modal__header">
      <div class="modal__client">${client || ''}</div>
      <h2 class="modal__title">${title}</h2>
      <p class="modal__desc">${desc}</p>
      <div class="project-deliverables">${deliverables.map(d => `<span class="deliverable">${d}</span>`).join('')}</div>
      <div class="confidentiality-note confidentiality-note--modal">
        <span class="confidentiality-note__icon">🔒</span>
        <p>${t('modal.confidentiality', lang)}</p>
      </div>
    </div>
    <div class="modal__gallery">${galleryHtml}</div>
  `;

  lightboxImages = images;
  content.querySelectorAll('[data-lightbox-index]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openLightbox(Number(btn.dataset.lightboxIndex));
    });
  });

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openLightbox(index) {
  if (!lightboxImages.length) return;

  lightboxIndex = index;
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  const prev = document.getElementById('lightboxPrev');
  const next = document.getElementById('lightboxNext');

  img.src = lightboxImages[lightboxIndex];
  img.alt = document.querySelector('.modal__title')?.textContent || 'Project drawing';

  const multiple = lightboxImages.length > 1;
  prev.classList.toggle('is-hidden', !multiple);
  next.classList.toggle('is-hidden', !multiple);
  counter.textContent = multiple ? `${lightboxIndex + 1} / ${lightboxImages.length}` : '';
  counter.style.display = multiple ? 'block' : 'none';

  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
}

function stepLightbox(delta) {
  if (lightboxImages.length <= 1) return;
  lightboxIndex = (lightboxIndex + delta + lightboxImages.length) % lightboxImages.length;
  openLightbox(lightboxIndex);
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.getElementById('lightboxImg').src = '';
}

function closeProjectModal() {
  closeLightbox();
  const modal = document.getElementById('projectModal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImages = [];
}

function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });

  nav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });
}

function initFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const action = form.getAttribute('action');
    const lang = getCurrentLang();

    if (action.includes('YOUR_FORM_ID') || action.includes('PLACEHOLDER')) {
      status.hidden = false;
      status.className = 'form-status is-error';
      status.textContent = t('form.configError', lang);
      return;
    }

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      status.hidden = false;
      if (res.ok) {
        status.className = 'form-status is-success';
        status.textContent = t('form.success', lang);
        form.reset();
      } else {
        throw new Error('Form error');
      }
    } catch {
      status.hidden = false;
      status.className = 'form-status is-error';
      status.textContent = t('form.error', lang);
    }
  });
}
