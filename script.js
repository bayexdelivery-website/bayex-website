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

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    showToast('Thank you, ' + name + '. We\'ll be in touch shortly.');
    form.reset();
  });
}

// ===== Delivery request form =====
var deliveryForm = document.getElementById('deliveryForm');

if (deliveryForm) {
  // Show/hide custom service field when "Other" is selected
  var serviceSelect = document.getElementById('req-service');
  var customGroup   = document.getElementById('customServiceGroup');
  var customInput   = document.getElementById('req-custom-service');

  serviceSelect.addEventListener('change', function () {
    var isOther = this.value === 'Other';
    customGroup.hidden = !isOther;
    customInput.required = isOther;
    if (!isOther) customInput.value = '';
  });

  deliveryForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('req-name').value;
    showToast('Request received, ' + name + '. We\'ll confirm your pickup shortly.');
    deliveryForm.reset();
    customGroup.hidden = true;
    customInput.required = false;
  });
}

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
