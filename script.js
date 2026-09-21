/* ================= SITE CONFIG: edit these ================= */
const CONFIG = {
  // Paste the client's Facebook Page URL, e.g. "https://www.facebook.com/CoastlinePropertyHoldings"
  FACEBOOK_PAGE_URL: "",
  // Business email: leave blank until confirmed
  EMAIL: ""
};
/* ============================================================ */

// Year
document.getElementById('yr').textContent = new Date().getFullYear();

// Nav: scrolled state + mobile menu + active link
const nav = document.getElementById('nav');
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); toggle.classList.remove('open');
  toggle.setAttribute('aria-expanded', false); document.body.style.overflow = '';
}));
const sections = [...document.querySelectorAll('main section[id]')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Reveal on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + 'ms';
  io.observe(el);
});

// Lightbox
const figs = [...document.querySelectorAll('#gallery .g')];
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const lbCap = lb.querySelector('.lightbox__cap');
let idx = 0;
const show = i => {
  idx = (i + figs.length) % figs.length;
  const f = figs[idx];
  lbImg.src = f.dataset.full; lbImg.alt = f.querySelector('img').alt;
  lbCap.textContent = f.querySelector('figcaption').textContent;
};
figs.forEach((f, i) => f.addEventListener('click', () => { show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; }));
const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
lb.querySelector('.lightbox__close').onclick = close;
lb.querySelector('.lightbox__prev').onclick = e => { e.stopPropagation(); show(idx - 1); };
lb.querySelector('.lightbox__next').onclick = e => { e.stopPropagation(); show(idx + 1); };
lb.addEventListener('click', e => { if (e.target === lb) close(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowLeft') show(idx - 1);
  if (e.key === 'ArrowRight') show(idx + 1);
});

// Facebook Page Plugin (or a styled placeholder until the URL is set)
const fbWrap = document.getElementById('fbEmbed');
const fbUrl = CONFIG.FACEBOOK_PAGE_URL.trim();
document.querySelectorAll('[data-fb-link]').forEach(a => a.href = fbUrl || 'https://www.facebook.com/');
document.querySelectorAll('[data-fb-review]').forEach(a => a.href = fbUrl ? fbUrl.replace(/\/$/, '') + '/reviews' : 'https://www.facebook.com/');
if (fbUrl) {
  const w = Math.min(500, fbWrap.clientWidth || 500);
  const src = 'https://www.facebook.com/plugins/page.php?href=' + encodeURIComponent(fbUrl) +
    `&tabs=timeline&width=${w}&height=620&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`;
  fbWrap.innerHTML = `<iframe src="${src}" width="${w}" height="620" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="Coastline on Facebook" loading="lazy"></iframe>`;
} else {
  fbWrap.innerHTML = `
    <div class="fb-placeholder">
      <div class="fb-placeholder__top"></div>
      <div class="fb-placeholder__body">
        <div class="fb-placeholder__pic"></div>
        <h4>Coastline Property Holdings LLC</h4>
        <small>Roofing contractor · Facebook</small>
        <div class="fb-post"><img src="images/shingles-crew-sm.jpg" alt=""><div class="fb-lines"><div class="ph"></div><div class="ph" style="width:70%"></div><div class="ph" style="width:45%"></div></div></div>
        <div class="fb-post"><img src="images/tearoff-dry-in-sm.jpg" alt=""><div class="fb-lines"><div class="ph"></div><div class="ph" style="width:60%"></div></div></div>
        <p class="fb-note">The live Facebook feed will appear here once the page URL is added.</p>
      </div>
    </div>`;
}

// Email
const emailLink = document.querySelector('[data-email-link]');
if (CONFIG.EMAIL) {
  emailLink.href = 'mailto:' + CONFIG.EMAIL; emailLink.textContent = CONFIG.EMAIL; emailLink.classList.remove('email-empty');
} else {
  emailLink.removeAttribute('href');
}

// Contact form: opens the visitor's email app addressed to CONFIG.EMAIL
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach(el => {
    const bad = !el.value.trim(); el.classList.toggle('invalid', bad); if (bad) ok = false;
  });
  if (!ok) { note.innerHTML = 'Please add your name and phone number.'; return; }
  const d = Object.fromEntries(new FormData(form));
  if (!CONFIG.EMAIL) {
    note.innerHTML = `Thanks, ${d.name.split(' ')[0]}! Online requests are almost ready. For now, please call <a href="tel:+12037700048">(203) 770-0048</a>.`;
    return;
  }
  const body = `Name: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email}\nService: ${d.service}\n\n${d.message}`;
  location.href = `mailto:${CONFIG.EMAIL}?subject=${encodeURIComponent('Estimate request: ' + d.service)}&body=${encodeURIComponent(body)}`;
  note.innerHTML = 'Opening your email app. You can also call <a href="tel:+12037700048">(203) 770-0048</a>.';
});
