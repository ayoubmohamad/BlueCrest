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
     3. INTERACTIVE BEFORE & AFTER SLIDER
     -------------------------------------------------------------------------- */
  const slider = document.getElementById('before-after-slider');
  const beforeWrap = document.getElementById('before-image-wrap');
  const handle = document.getElementById('slider-handle');
  
  if (slider && beforeWrap && handle) {
    let isSliding = false;

    // Core positioning calculator function
    const slideTo = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      
      // Keep boundaries strictly between 0% and 100%
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      // Update element layouts
      beforeWrap.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    // Desktop Mouse Event Listeners
    const startSlideMouse = (e) => {
      isSliding = true;
      slideTo(e.clientX);
    };

    const slideMoveMouse = (e) => {
      if (!isSliding) return;
      slideTo(e.clientX);
    };

    const stopSlideMouse = () => {
      isSliding = false;
    };

    handle.addEventListener('mousedown', startSlideMouse);
    slider.addEventListener('mousemove', slideMoveMouse);
    window.addEventListener('mouseup', stopSlideMouse);
    
    // Allow clicking anywhere on the slider container to move it
    slider.addEventListener('mousedown', (e) => {
      if (e.target !== handle && !handle.contains(e.target)) {
        slideTo(e.clientX);
        isSliding = true;
      }
    });

    // Mobile / Tablet Touch Event Listeners
    const startSlideTouch = (e) => {
      isSliding = true;
      slideTo(e.touches[0].clientX);
    };

    const slideMoveTouch = (e) => {
      if (!isSliding) return;
      slideTo(e.touches[0].clientX);
    };

    const stopSlideTouch = () => {
      isSliding = false;
    };

    handle.addEventListener('touchstart', startSlideTouch, { passive: true });
    slider.addEventListener('touchmove', slideMoveTouch, { passive: true });
    window.addEventListener('touchend', stopSlideTouch);
  }


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

    // Auto-format phone input e.g. (123) 456-7890
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

});
