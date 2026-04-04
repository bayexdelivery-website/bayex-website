/* =============================================================
   Bay Area Express — Script
   Mobile nav toggle + Supabase form submissions.
   ============================================================= */

// ===== Supabase client =====
var supabase = window.supabase.createClient(
  'https://kwkrbxgnbcbqqmdznobf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3a3JieGduYmNicXFtZHpub2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjY5MTAsImV4cCI6MjA5MDkwMjkxMH0.XZTTHIGc9hy7j9Fm-m8dZrxTCUU55f2STlObCs8lI9M'
);

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

// ===== Contact form =====
var form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check — bots fill this in, real users don't
    if (document.getElementById('website').value) return;

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var { error } = await supabase.from('contact_submissions').insert({
      name: document.getElementById('name').value,
      company: document.getElementById('company').value || null,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value || null,
      details: document.getElementById('details').value || null
    });

    btn.disabled = false;
    btn.textContent = 'Submit Request';

    if (error) {
      showToast('Something went wrong. Please call us at (707) 265-7702.');
      console.error('Supabase error:', error);
    } else {
      var name = document.getElementById('name').value;
      showToast('Thank you, ' + name + '. We\'ll be in touch shortly.');
      form.reset();
    }
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

  deliveryForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot check
    if (document.getElementById('req-website').value) return;

    var btn = deliveryForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var { error } = await supabase.from('delivery_requests').insert({
      name: document.getElementById('req-name').value,
      company: document.getElementById('req-company').value || null,
      phone: document.getElementById('req-phone').value,
      email: document.getElementById('req-email').value || null,
      pickup_address: document.getElementById('req-pickup').value,
      delivery_address: document.getElementById('req-delivery').value,
      pickup_time: document.getElementById('req-pickup-time').value,
      service_type: document.getElementById('req-service').value,
      custom_service: document.getElementById('req-custom-service').value || null,
      notes: document.getElementById('req-notes').value || null
    });

    btn.disabled = false;
    btn.textContent = 'Submit Delivery Request';

    if (error) {
      showToast('Something went wrong. Please call us at (707) 265-7702.');
      console.error('Supabase error:', error);
    } else {
      var name = document.getElementById('req-name').value;
      showToast('Request received, ' + name + '. We\'ll confirm your pickup shortly.');
      deliveryForm.reset();
      customGroup.hidden = true;
      customInput.required = false;
    }
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
