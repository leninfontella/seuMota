/**
 * seuMota — termos-de-uso.js
 * Active TOC item highlight on scroll
 */

const sections = document.querySelectorAll('.section[id]');
const tocLinks  = document.querySelectorAll('.toc-list a');

function updateActiveToc() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 100) current = sec.id;
  });

  tocLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveToc, { passive: true });
updateActiveToc();
