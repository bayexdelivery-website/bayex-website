/* =============================================================
   Bay Area Express — Script
   Mobile nav toggle + contact form feedback. Nothing else.
   ============================================================= */

// ===== Mobile navigation toggle =====
var toggle = document.getElementById('mobileToggle');
var nav = document.getElementById('nav');

toggle.addEventListener('click', function () {
  nav.classList.toggle('open');
});

// Close mobile nav when a link is tapped
var navLinks = nav.querySelectorAll('a');
for (var i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener('click', function () {
    nav.classList.remove('open');
  });
}

// ===== Contact form feedback =====
var form = document.getElementById('contactForm');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  showToast('Thank you, ' + name + '. We\'ll be in touch shortly.');
  form.reset();
});

// ===== Toast helper =====
function showToast(message) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(function () { toast.classList.remove('show'); }, 4000);
}
