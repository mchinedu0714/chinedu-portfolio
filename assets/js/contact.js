const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !phone || !message) {
    formStatus.textContent = 'Please complete every field before continuing.';
    formStatus.className = 'form-status error';
    return;
  }
  if (!emailPattern.test(email)) {
    formStatus.textContent = 'Enter an email address in a valid format.';
    formStatus.className = 'form-status error';
    return;
  }
  if (!/^\d+$/.test(phone)) {
    formStatus.textContent = 'Use digits only in the phone number field.';
    formStatus.className = 'form-status error';
    return;
  }

  // Open the visitor's email app with the message prepared; no server receives it.
  const subject = encodeURIComponent(`Website enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`);
  formStatus.textContent = 'Your details are valid. Your email app should open with the message prepared; review and send it there.';
  formStatus.className = 'form-status success';
  window.location.href = `mailto:Chipromzzy2000@gmail.com?subject=${subject}&body=${body}`;
});
