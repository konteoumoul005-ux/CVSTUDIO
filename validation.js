/**
 * validation.js – Validation des données du formulaire
 * Responsabilité : Valider les champs selon des règles métier
 */

const Validator = (() => {

  /** Regex de validation */
  const RULES = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    // Numéro sénégalais : 77, 78, 70, 76, 75, 33 suivi de 7 chiffres (avec ou sans espaces/tirets)
    phone: /^((\+221|00221)?[\s\-]?)?(77|78|70|76|75|33)[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/,
    password: /^.{6,}$/
  };

  const MESSAGES = {
    required: 'Ce champ est obligatoire.',
    email: 'Adresse email invalide (ex: nom@domaine.com).',
    phone: 'Numéro sénégalais invalide (ex: 77 123 45 67).',
    password: 'Le mot de passe doit comporter au moins 6 caractères.'
  };

  /**
   * Valider un champ unique
   * @returns {string} Message d'erreur ou chaîne vide si valide
   */
  function validateField(value, rules = {}) {
    const v = value.trim();

    if (rules.required && !v) {
      return MESSAGES.required;
    }
    if (!v) return ''; // champ vide non requis = OK

    if (rules.email && !RULES.email.test(v)) {
      return MESSAGES.email;
    }
    if (rules.phone && !RULES.phone.test(v)) {
      return MESSAGES.phone;
    }
    if (rules.password && !RULES.password.test(v)) {
      return MESSAGES.password;
    }
    return '';
  }

  /**
   * Valider le formulaire complet des infos personnelles
   * @returns {{ valid: boolean, errors: object }}
   */
  function validatePersonalForm() {
    const fields = [
      { id: 'firstName',   rules: { required: true } },
      { id: 'lastName',    rules: { required: true } },
      { id: 'jobTitle',    rules: { required: true } },
      { id: 'email',       rules: { required: true, email: true } },
      { id: 'phone',       rules: { required: true, phone: true } },
      { id: 'cvPassword',  rules: { required: true, password: true } }
    ];

    let valid = true;
    const errors = {};

    fields.forEach(({ id, rules }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const msg = validateField(el.value, rules);
      errors[id] = msg;
      if (msg) valid = false;
    });

    return { valid, errors };
  }

  /**
   * Afficher les erreurs dans l'interface
   */
  function displayErrors(errors) {
    Object.entries(errors).forEach(([id, msg]) => {
      const errEl = document.getElementById(`err-${id}`);
      const inputEl = document.getElementById(id);
      if (errEl) errEl.textContent = msg;
      if (inputEl) {
        inputEl.classList.toggle('invalid', !!msg);
      }
    });
  }

  /**
   * Effacer toutes les erreurs
   */
  function clearErrors() {
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
  }

  /**
   * Attacher la validation en temps réel à un champ
   */
  function attachRealtime(inputEl, rules) {
    inputEl.addEventListener('blur', () => {
      const msg = validateField(inputEl.value, rules);
      const errEl = document.getElementById(`err-${inputEl.id}`);
      if (errEl) errEl.textContent = msg;
      inputEl.classList.toggle('invalid', !!msg);
    });
    inputEl.addEventListener('input', () => {
      if (inputEl.classList.contains('invalid')) {
        const msg = validateField(inputEl.value, rules);
        const errEl = document.getElementById(`err-${inputEl.id}`);
        if (errEl) errEl.textContent = msg;
        inputEl.classList.toggle('invalid', !!msg);
      }
    });
  }

  return { validateField, validatePersonalForm, displayErrors, clearErrors, attachRealtime };
})();
