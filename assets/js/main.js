document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initMobileWhatsAppCta();
  initGenericLinks();
  initCollectionCards();
  initFabricGallery();
  initReadyWearGallery();
  initTraditionalGallery();
  initForms();
  initHomeCollectionCards();
  initFeaturedFabrics();
  updateYear();
});

function updateYear() {
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav-menu]');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initMobileWhatsAppCta() {
  const contact = window.ayanfeData?.contact || {};
  const link = document.createElement('a');
  link.className = 'mobile-whatsapp-cta';
  link.href = buildWhatsAppLink(contact.whatsappMessage || 'Hello Ayanfe Couture, I would like to make an enquiry.', '');
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = 'Enquire on WhatsApp';
  link.setAttribute('aria-label', 'Enquire with Ayanfe Couture on WhatsApp');
  document.body.appendChild(link);
}

function buildWhatsAppLink(message, itemName, referenceCode) {
  const base = window.ayanfeData?.contact?.whatsapp || 'https://wa.me/2349054178927';
  const finalMessage = itemName && referenceCode
    ? `${message} I am interested in ${itemName}, reference ${referenceCode}.`
    : message;
  return `${base}?text=${encodeURIComponent(finalMessage)}`;
}

function initGenericLinks() {
  const contactInfo = window.ayanfeData?.contact || {};
  document.querySelectorAll('[data-contact-phone]').forEach((el) => {
    el.href = contactInfo.phoneHref || 'tel:+2349054178927';
    el.textContent = contactInfo.phoneDisplay || '+234 905 417 8927';
  });

  document.querySelectorAll('[data-whatsapp-general]').forEach((el) => {
    el.href = buildWhatsAppLink(contactInfo.whatsappMessage || 'Hello Ayanfe Couture, I would like to enquire about your services.', '');
  });

  document.querySelectorAll('[data-email-general]').forEach((el) => {
    el.href = `mailto:${contactInfo.email || 'ayanfecouture@gmail.com'}?subject=${encodeURIComponent(contactInfo.emailSubject || 'Ayanfe Couture — Fashion Enquiry')}&body=${encodeURIComponent(contactInfo.emailBody || 'Hello Ayanfe Couture, I would like to enquire about your services.')}`;
  });
}

function initHomeCollectionCards() {
  const container = document.querySelector('[data-home-collections]');
  if (!container) return;

  const items = window.ayanfeData?.collections || [];
  container.innerHTML = items.slice(0, 5).map((item) => `
    <article class="feature-card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="feature-card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <a href="collections.html">Explore Collection</a>
      </div>
    </article>
  `).join('');
}

function initFeaturedFabrics() {
  const container = document.querySelector('[data-featured-fabrics]');
  if (!container) return;

  const fabrics = window.ayanfeData?.fabrics || [];
  container.innerHTML = fabrics.slice(0, 4).map((fabric) => `
    <article class="feature-card">
      <img src="${fabric.image}" alt="${fabric.name}" loading="lazy">
      <div class="feature-card-body">
        <h3>${fabric.name}</h3>
        <p>${fabric.category}</p>
        <a href="fabrics.html">Discover Fabric</a>
      </div>
    </article>
  `).join('');
}

function initCollectionCards() {
  const container = document.querySelector('[data-collection-cards]');
  if (!container) return;

  const items = window.ayanfeData?.collections || [];
  const filterButtons = document.querySelectorAll('[data-collection-filter]');
  const searchInput = document.querySelector('[data-collection-search]');

  function renderCards(list) {
    container.innerHTML = list.map((item) => `
      <article class="shop-card" data-name="${item.name.toLowerCase()}" data-category="${item.category.toLowerCase()}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="card-body">
          <div class="meta">
            <span>${item.id}</span>
          </div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <div class="card-actions">
            <button class="btn btn-secondary" type="button" data-preview-item="${item.id}">View Design</button>
            <a class="btn btn-primary" href="${buildWhatsAppLink('Hello Ayanfe Couture, I am interested in your design.', item.name, item.id)}" target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
          </div>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('[data-preview-item]').forEach((button) => {
      button.addEventListener('click', () => openModal(button.dataset.previewItem));
    });
  }

  let activeFilter = 'All';

  const filterList = () => {
    const value = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filtered = items.filter((item) => {
      const matchCategory = activeFilter === 'All' || item.category === activeFilter;
      const matchSearch = !value || item.name.toLowerCase().includes(value) || item.category.toLowerCase().includes(value) || item.id.toLowerCase().includes(value);
      return matchCategory && matchSearch;
    });
    renderCards(filtered);
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.collectionFilter;
      filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
      filterList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterList);
  }

  renderCards(items);
}

function initFabricGallery() {
  const container = document.querySelector('[data-fabric-cards]');
  if (!container) return;

  const items = window.ayanfeData?.fabrics || [];
  const filters = document.querySelectorAll('[data-fabric-filter]');
  const searchInput = document.querySelector('[data-fabric-search]');

  function renderCards(list) {
    container.innerHTML = list.map((fabric) => `
      <article class="fabric-card" data-fabric-name="${fabric.name.toLowerCase()}" data-fabric-ref="${fabric.id.toLowerCase()}">
        <img src="${fabric.image}" alt="${fabric.name}" loading="lazy">
        <div class="card-body">
          <div class="meta">
            <span>${fabric.id}</span>
          </div>
          <h3>${fabric.name}</h3>
          <p>${fabric.category}</p>
          <p>${fabric.description}</p>
          <div class="card-actions">
            <button class="btn btn-secondary" type="button" data-preview-fabric="${fabric.id}">Preview</button>
            <a class="btn btn-primary" href="${buildWhatsAppLink('Hello Ayanfe Couture, I am interested in your fabric.', fabric.name, fabric.id)}" target="_blank" rel="noreferrer">Enquire</a>
          </div>
        </div>
      </article>
    `).join('');

    document.querySelectorAll('[data-preview-fabric]').forEach((button) => {
      button.addEventListener('click', () => openFabricPreview(button.dataset.previewFabric));
    });
  }

  let activeFilter = 'All';

  const filterList = () => {
    const value = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filtered = items.filter((item) => {
      const matchCategory = activeFilter === 'All' || item.category === activeFilter;
      const matchSearch = !value || item.name.toLowerCase().includes(value) || item.id.toLowerCase().includes(value) || item.category.toLowerCase().includes(value);
      return matchCategory && matchSearch;
    });
    renderCards(filtered);
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.fabricFilter;
      filters.forEach((btn) => btn.classList.toggle('active', btn === button));
      filterList();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterList);
  }

  renderCards(items);
}

function initReadyWearGallery() {
  const container = document.querySelector('[data-readywear-cards]');
  if (!container) return;

  const items = window.ayanfeData?.readyWear || [];
  container.innerHTML = items.map((item) => `
    <article class="shop-card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="card-body">
        <div class="meta">
          <span>${item.category}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <ul class="list-inline">
          <li>Sizes: ${item.sizes}</li>
          <li>Colours: ${item.colours}</li>
        </ul>
        <div class="card-actions">
          <button class="btn btn-secondary" type="button" data-preview-item="${item.id}">Explore Design</button>
          <a class="btn btn-primary" href="${buildWhatsAppLink('Hello Ayanfe Couture, I would like to ask about this ready-to-wear design.', item.name, item.id)}" target="_blank" rel="noreferrer">Ask About Availability</a>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('[data-preview-item]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.previewItem));
  });
}

function initTraditionalGallery() {
  const container = document.querySelector('[data-traditional-cards]');
  if (!container) return;

  const items = window.ayanfeData?.traditions || [];
  container.innerHTML = items.map((item) => `
    <article class="shop-card">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="card-body">
        <div class="meta">
          <span>${item.category}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="card-actions">
          <button class="btn btn-secondary" type="button" data-preview-item="${item.id}">View Design</button>
          <a class="btn btn-primary" href="${buildWhatsAppLink('Hello Ayanfe Couture, I would like to enquire about this traditional design.', item.name, item.id)}" target="_blank" rel="noreferrer">Enquire on WhatsApp</a>
        </div>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('[data-preview-item]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.previewItem));
  });
}

function openModal(itemId) {
  const modal = document.querySelector('[data-modal]');
  const item = [...(window.ayanfeData?.collections || []), ...(window.ayanfeData?.readyWear || []), ...(window.ayanfeData?.traditions || [])].find((entry) => entry.id === itemId);
  if (!modal || !item) return;

  modal.classList.add('open');
  modal.querySelector('[data-modal-title]').textContent = item.name;
  modal.querySelector('[data-modal-image]').src = item.image;
  modal.querySelector('[data-modal-description]').textContent = item.description || 'Beautifully crafted for your next statement look.';
  modal.querySelector('[data-modal-meta]').innerHTML = `
    <span>${item.category || 'Fashion'} </span>
    <span>${item.id}</span>
  `;
  const whatsappLink = buildWhatsAppLink('Hello Ayanfe Couture, I am interested in learning more about this design.', item.name, item.id);
  modal.querySelector('[data-modal-whatsapp]').href = whatsappLink;
  modal.querySelector('[data-modal-email]').href = `mailto:${window.ayanfeData.contact.email}?subject=${encodeURIComponent('Ayanfe Couture — Design Enquiry: ' + item.name)}&body=${encodeURIComponent(`Hello Ayanfe Couture,\n\nI am interested in ${item.name} (reference ${item.id}). Please tell me more about the design, available fabrics, and pricing.\n\nThank you.`)}`;

  modal.querySelector('[data-modal-close]').addEventListener('click', () => modal.classList.remove('open'), { once: true });
}

function openFabricPreview(fabricId) {
  const modal = document.querySelector('[data-modal]');
  const fabric = (window.ayanfeData?.fabrics || []).find((entry) => entry.id === fabricId);
  if (!modal || !fabric) return;

  modal.classList.add('open');
  modal.querySelector('[data-modal-title]').textContent = fabric.name;
  modal.querySelector('[data-modal-image]').src = fabric.image;
  modal.querySelector('[data-modal-description]').textContent = fabric.description;
  modal.querySelector('[data-modal-meta]').innerHTML = `
    <span>${fabric.category}</span>
    <span>${fabric.id}</span>
  `;
  modal.querySelector('[data-modal-whatsapp]').href = buildWhatsAppLink('Hello Ayanfe Couture, I am interested in your fabric.', fabric.name, fabric.id);
  modal.querySelector('[data-modal-email]').href = `mailto:${window.ayanfeData.contact.email}?subject=${encodeURIComponent('Ayanfe Couture — Fabric Enquiry: ' + fabric.name)}&body=${encodeURIComponent(`Hello Ayanfe Couture,\n\nI would like to enquire about ${fabric.name} (reference ${fabric.id}). Please share more details on availability, price, and suitability for my outfit.\n\nThank you.`)}`;

  modal.querySelector('[data-modal-close]').addEventListener('click', () => modal.classList.remove('open'), { once: true });
}

function initForms() {
  const tailoringForm = document.querySelector('[data-tailoring-form]');
  if (tailoringForm) {
    tailoringForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(tailoringForm);
      const fullName = (formData.get('fullName') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const outfitType = (formData.get('outfitType') || '').toString().trim();
      const preferredContact = (formData.get('preferredContactMethod') || '').toString().trim();

      if (!fullName || !phone || !outfitType || !preferredContact) {
        showNotice(tailoringForm, 'Please complete the required fields before submitting your enquiry.', 'error');
        return;
      }

      const message = `Hello Ayanfe Couture, I am interested in custom tailoring. My name is ${fullName}. I would like ${outfitType} for ${preferredContact}. My phone number is ${phone}. Please contact me with the next steps. Additional details: ${formData.get('additionalRequirements') || 'No additional requirements provided.'}`;
      const whatsappUrl = buildWhatsAppLink(message, '', '');
      const emailSubject = 'Ayanfe Couture — Custom Tailoring Enquiry';
      const emailBody = `Hello Ayanfe Couture,\n\nI would like to request a custom tailoring consultation.\nName: ${fullName}\nPhone: ${phone}\nEmail: ${formData.get('email') || 'Not provided'}\nPreferred contact: ${preferredContact}\nType of outfit: ${outfitType}\nPreferred fabric: ${formData.get('preferredFabric') || 'Not specified'}\nPreferred colour: ${formData.get('preferredColour') || 'Not specified'}\nOccasion: ${formData.get('occasion') || 'Not specified'}\nAppointment date: ${formData.get('appointmentDate') || 'Flexible'}\nAdditional requirements: ${formData.get('additionalRequirements') || 'None provided'}\n\nThank you.`;

      showNotice(tailoringForm, `Your enquiry is ready. Continue through WhatsApp or email to send it.`, 'success');
      tailoringForm.querySelector('[data-continue-whatsapp]').href = whatsappUrl;
      tailoringForm.querySelector('[data-continue-email]').href = `mailto:${window.ayanfeData.contact.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      tailoringForm.reset();
    });
  }

  const appointmentForm = document.querySelector('[data-appointment-form]');
  if (appointmentForm) {
    const dateField = appointmentForm.querySelector('input[type="date"]');
    if (dateField) {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 1);
      dateField.min = minDate.toISOString().split('T')[0];
    }

    appointmentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(appointmentForm);
      const name = (formData.get('fullName') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const purpose = (formData.get('appointmentPurpose') || '').toString().trim();
      const date = (formData.get('preferredDate') || '').toString().trim();
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 1);
      const chosenDate = date ? new Date(date) : null;

      if (!name || !phone || !purpose || !date || !chosenDate || chosenDate < minDate) {
        showNotice(appointmentForm, 'Please provide a valid appointment request with a future date.', 'error');
        return;
      }

      const message = `Hello Ayanfe Couture, I would like to request an appointment for ${purpose}. My name is ${name} and my phone number is ${phone}. Preferred date: ${date}. Additional notes: ${formData.get('additionalNotes') || 'No notes provided.'}`;
      showNotice(appointmentForm, 'Your appointment request has been prepared. Please confirm through WhatsApp or email once you are ready. The request is not confirmed until the business responds.', 'success');
      appointmentForm.querySelector('[data-continue-whatsapp]').href = buildWhatsAppLink(message, '', '');
      appointmentForm.querySelector('[data-continue-email]').href = `mailto:${window.ayanfeData.contact.email}?subject=${encodeURIComponent('Ayanfe Couture — Appointment Request')}&body=${encodeURIComponent(`Hello Ayanfe Couture,\n\nI would like to request an appointment.\nName: ${name}\nPhone: ${phone}\nEmail: ${formData.get('email') || 'Not provided'}\nPurpose: ${purpose}\nPreferred date: ${date}\nPreferred time: ${formData.get('preferredTime') || 'Not specified'}\nAdditional notes: ${formData.get('additionalNotes') || 'None'}\n\nThis appointment is a request and is not confirmed until the business responds.`)}`;
      appointmentForm.reset();
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const fullName = (formData.get('fullName') || '').toString().trim();
      const contactValue = (formData.get('emailOrPhone') || '').toString().trim();
      const topic = (formData.get('enquiryTopic') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!fullName || !contactValue || !topic || !message) {
        showNotice(contactForm, 'Please complete all required contact form fields.', 'error');
        return;
      }

      const whatsappUrl = buildWhatsAppLink(`Hello Ayanfe Couture, my name is ${fullName}. I would like to make an enquiry about ${topic}. My contact details are ${contactValue}. Message: ${message}`, '', '');
      showNotice(contactForm, 'Your enquiry is ready to send. Please continue through WhatsApp or email.', 'success');
      contactForm.querySelector('[data-continue-whatsapp]').href = whatsappUrl;
      contactForm.querySelector('[data-continue-email]').href = `mailto:${window.ayanfeData.contact.email}?subject=${encodeURIComponent('Ayanfe Couture — Contact Enquiry: ' + topic)}&body=${encodeURIComponent(`Hello Ayanfe Couture,\n\nName: ${fullName}\nContact: ${contactValue}\nEnquiry topic: ${topic}\n\n${message}\n\nThank you.`)}`;
      contactForm.reset();
    });
  }
}

function showNotice(form, message, type) {
  const notice = form.querySelector('.notice');
  if (!notice) return;
  notice.textContent = message;
  notice.className = 'notice ' + type;
}

const modalClose = document.querySelector('[data-modal-close]');
if (modalClose) {
  modalClose.addEventListener('click', () => {
    modalClose.closest('[data-modal]')?.classList.remove('open');
  });
}

const modalBackdrop = document.querySelector('[data-modal]');
if (modalBackdrop) {
  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) modalBackdrop.classList.remove('open');
  });
}
