/* ==========================================================================
   RICHWASH - INTERACTIVE SCRIPTS & COMPONENT BEHAVIORS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. STICKY HEADER SCROLL EFFECT
     -------------------------------------------------------------------------- */
  const mainHeader = document.getElementById('main-header');
  
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Run initially in case of reload mid-page


  /* --------------------------------------------------------------------------
     2. MOBILE NAVIGATION DRAWER
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const toggleMobileMenu = () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  };

  const closeMobileMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
  };

  menuToggle.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking on any mobile nav link
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });



  /* --------------------------------------------------------------------------
     4. SERVICE CHECKBOX INTERACTION
     -------------------------------------------------------------------------- */
  const checkboxLabels = document.querySelectorAll('.checkbox-label');
  
  checkboxLabels.forEach(label => {
    const checkbox = label.querySelector('input[type="checkbox"]');
    
    // Highlight pre-checked boxes if any
    if (checkbox.checked) {
      label.classList.add('is-checked');
    }
    
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        label.classList.add('is-checked');
      } else {
        label.classList.remove('is-checked');
      }
    });
  });


  /* --------------------------------------------------------------------------
     5. ESTIMATE FORM VALIDATION & SUBMISSION
     -------------------------------------------------------------------------- */
  const form = document.getElementById('quote-request-form');
  const successCard = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  const resetBtn = document.getElementById('reset-form-btn');
  
  if (form) {
    const fields = {
      name: document.getElementById('form-name'),
      phone: document.getElementById('form-phone'),
      email: document.getElementById('form-email'),
      property: document.getElementById('form-property')
    };

    const errors = {
      name: document.getElementById('name-error'),
      phone: document.getElementById('phone-error'),
      email: document.getElementById('email-error'),
      property: document.getElementById('property-error'),
      services: document.getElementById('services-error')
    };

    // Auto-format phone input e.g. (770) 823-6404
    fields.phone.addEventListener('input', (e) => {
      let x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    const validateField = (field, errorEl, condition) => {
      const group = field.closest('.form-group');
      if (condition) {
        group.classList.remove('has-error');
        return true;
      } else {
        group.classList.add('has-error');
        return false;
      }
    };

    // Check email pattern
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Check phone pattern (requires 10 digits total)
    const isValidPhone = (phone) => {
      const digits = phone.replace(/\D/g, '');
      return digits.length === 10;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate inputs
      const isNameValid = validateField(fields.name, errors.name, fields.name.value.trim() !== '');
      const isPhoneValid = validateField(fields.phone, errors.phone, isValidPhone(fields.phone.value));
      const isEmailValid = validateField(fields.email, errors.email, isValidEmail(fields.email.value));
      const isPropertyValid = validateField(fields.property, errors.property, fields.property.value !== '');

      // Validate service checkbox selection (at least 1 must be checked)
      const checkedServices = document.querySelectorAll('input[name="services"]:checked');
      const servicesGroup = document.querySelector('.select-services-group');
      const isServicesValid = checkedServices.length > 0;
      
      if (isServicesValid) {
        servicesGroup.classList.remove('has-error');
      } else {
        servicesGroup.classList.add('has-error');
      }

      const isFormValid = isNameValid && isPhoneValid && isEmailValid && isPropertyValid && isServicesValid;

      if (isFormValid) {
        // Trigger visual loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate API network request
        setTimeout(() => {
          // Revert loader
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;

          // Collect checked service labels
          const selectedSvcNames = Array.from(checkedServices).map(cb => cb.value).join(', ');

          // Fill summary info card details
          document.getElementById('summary-name').textContent = fields.name.value.trim();
          document.getElementById('summary-property').textContent = fields.property.value;
          document.getElementById('summary-services').textContent = selectedSvcNames;

          // Transition: hide form, show success state card
          form.style.display = 'none';
          successCard.style.display = 'flex';
          
          // Smooth scroll to top of form section
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 1500);
      }
    });

    // Reset Quote Form Button
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        
        // Remove checked highlight styles
        checkboxLabels.forEach(label => {
          label.classList.remove('is-checked');
        });

        // Hide success card, show original form
        successCard.style.display = 'none';
        form.style.display = 'block';

        // Clear error classes
        Object.values(fields).forEach(field => {
          field.closest('.form-group').classList.remove('has-error');
        });
        document.querySelector('.select-services-group').classList.remove('has-error');
      });
    }
  }

  /* --------------------------------------------------------------------------
     6. LIGHTBOX PHOTO GALLERY SLIDESHOW
     -------------------------------------------------------------------------- */
  const openGalleryBtn = document.getElementById('open-gallery-btn');
  const galleryModal = document.getElementById('gallery-modal');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay-close');
  const prevSlideBtn = document.getElementById('prev-slide');
  const nextSlideBtn = document.getElementById('next-slide');
  const slides = document.querySelectorAll('.gallery-slide');
  
  if (openGalleryBtn && galleryModal && slides.length > 0) {
    let currentSlideIndex = 0;

    const showSlide = (index) => {
      // Deactivate current active slide
      slides[currentSlideIndex].classList.remove('active');
      
      // Calculate new index with boundary wrapping
      currentSlideIndex = (index + slides.length) % slides.length;
      
      // Activate new slide
      slides[currentSlideIndex].classList.add('active');
    };

    const openModal = () => {
      galleryModal.classList.add('open');
      galleryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
      showSlide(0); // Reset to first slide on open
    };

    const closeModal = () => {
      galleryModal.classList.remove('open');
      galleryModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Unlock background scrolling
    };

    // Event listeners for open and close
    openGalleryBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Arrow navigation clicks
    nextSlideBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
    prevSlideBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));

    // Keyboard navigation (Arrow keys and Escape key support)
    document.addEventListener('keydown', (e) => {
      if (!galleryModal.classList.contains('open')) return;
      
      if (e.key === 'ArrowRight') {
        showSlide(currentSlideIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        showSlide(currentSlideIndex - 1);
      } else if (e.key === 'Escape') {
        closeModal();
      }
    });
  }

});
