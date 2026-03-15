/**
 * main.js – Logique principale de l'application
 * Responsabilité : Initialiser, orchestrer, écouter les événements
 */

(function () {
  'use strict';

  let currentTemplate = 'modern';
  let autoSaveTimer = null;

  // ===== INITIALISATION =====
  function init() {
    const saved = DataManager.load();

    // Restaurer les données
    UI.fillPersonalForm(saved.personal);
    UI.fillDynamicSections(saved);
    UI.setPhoto(saved.personal.photo || '');
    currentTemplate = saved.template || 'modern';
    setTemplate(currentTemplate);

    // Photo upload listener
    UI.initPhotoUpload(() => triggerRender());

    // Valider au blur chaque champ personnel
    setupRealtimeValidation();

    // Rendu initial
    triggerRender();

    // Écouter les events
    bindEvents();

    // Auto-save
    startAutoSave();

    console.log('✅ CV Studio initialisé.');
  }

  // ===== VALIDATION EN TEMPS RÉEL =====
  function setupRealtimeValidation() {
    Validator.attachRealtime(document.getElementById('firstName'),  { required: true });
    Validator.attachRealtime(document.getElementById('lastName'),   { required: true });
    Validator.attachRealtime(document.getElementById('jobTitle'),   { required: true });
    Validator.attachRealtime(document.getElementById('email'),      { required: true, email: true });
    Validator.attachRealtime(document.getElementById('phone'),      { required: true, phone: true });
    Validator.attachRealtime(document.getElementById('cvPassword'), { required: true, password: true });
  }

  // ===== BIND EVENTS =====
  function bindEvents() {

    // Bouton générer
    document.getElementById('btnGenerate').addEventListener('click', handleGenerate);

    // Bouton reset
    document.getElementById('btnReset').addEventListener('click', handleReset);

    // Export PDF
    document.getElementById('btnExportPDF').addEventListener('click', handleExportPDF);

    // Boutons ajouter sections dynamiques
    document.getElementById('btnAddExp').addEventListener('click', () => {
      UI.addExperience(); triggerRender();
    });
    document.getElementById('btnAddEdu').addEventListener('click', () => {
      UI.addEducation(); triggerRender();
    });
    document.getElementById('btnAddSkill').addEventListener('click', () => {
      UI.addSkill(); triggerRender();
    });
    document.getElementById('btnAddInterest').addEventListener('click', () => {
      UI.addInterest(); triggerRender();
    });

    // Template selector (form)
    document.querySelectorAll('input[name="template"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        setTemplate(e.target.value);
      });
    });
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Template selector (pills preview)
    document.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        setTemplate(pill.dataset.template);
        // Sync radios
        const radio = document.querySelector(`input[name="template"][value="${pill.dataset.template}"]`);
        if (radio) radio.checked = true;
        document.querySelectorAll('.template-card').forEach(c => {
          c.classList.toggle('active', c.dataset.template === pill.dataset.template);
        });
      });
    });

    // Toggle password visibility
    document.getElementById('togglePwd').addEventListener('click', () => {
      const input = document.getElementById('cvPassword');
      input.type = input.type === 'password' ? 'text' : 'password';
    });

    // Nav mobile tabs
    document.querySelectorAll('.btn-nav').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        UI.switchMobileTab(btn.dataset.tab);
      });
    });

    // Auto-render sur changement dans le formulaire
    document.getElementById('panelForm').addEventListener('input', () => {
      clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(() => {
        triggerRender();
        autoSave();
      }, 400);
    });

    // Supprimer entrée → re-render
    document.getElementById('panelForm').addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-icon')) {
        setTimeout(triggerRender, 250);
      }
    });
  }

  // ===== CHANGER TEMPLATE =====
  function setTemplate(tpl) {
    currentTemplate = tpl;
    document.querySelectorAll('.pill').forEach(p => {
      p.classList.toggle('active', p.dataset.template === tpl);
    });
    DataManager.saveTemplate(tpl);
    triggerRender();
  }

  // ===== COLLECTER LES DONNÉES =====
  function collectData() {
    return {
      personal: {
        firstName:   document.getElementById('firstName').value,
        lastName:    document.getElementById('lastName').value,
        jobTitle:    document.getElementById('jobTitle').value,
        email:       document.getElementById('email').value,
        phone:       document.getElementById('phone').value,
        city:        document.getElementById('city').value,
        linkedin:    document.getElementById('linkedin').value,
        summary:     document.getElementById('summary').value,
        cvPassword:  document.getElementById('cvPassword').value,
        photo:       UI.getPhoto()
      },
      experiences: UI.getExperiences(),
      educations:  UI.getEducations(),
      skills:      UI.getSkills(),
      interests:   UI.getInterests(),
      template:    currentTemplate
    };
  }

  // ===== RENDU DU CV =====
  function triggerRender() {
    const data = collectData();
    Templates.render(data);
  }

  // ===== GÉNÉRATION (avec validation complète) =====
  function handleGenerate() {
    const { valid, errors } = Validator.validatePersonalForm();
    Validator.displayErrors(errors);

    if (!valid) {
      UI.showToast('⚠ Veuillez corriger les erreurs avant de générer.', 'error');
      // Scroll vers la première erreur
      const firstError = document.querySelector('.invalid');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const data = collectData();
    Templates.render(data);
    autoSave();

    UI.showToast('✅ CV généré avec succès !', 'success');

    // Switch to preview on mobile
    if (window.innerWidth <= 900) {
      document.querySelectorAll('.btn-nav').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === 'preview');
      });
      UI.switchMobileTab('preview');
    }
  }

  // ===== AUTO-SAVE =====
  function autoSave() {
    const data = collectData();
    DataManager.savePersonal(data.personal);
    DataManager.saveSection('experiences', data.experiences);
    DataManager.saveSection('educations', data.educations);
    DataManager.saveSection('skills', data.skills);
    DataManager.saveSection('interests', data.interests);
  }

  function startAutoSave() {
    setInterval(() => {
      autoSave();
    }, 10000); // Sauvegarde toutes les 10s
  }

  // ===== RESET =====
  function handleReset() {
    if (!confirm('Réinitialiser toutes les données ? Cette action est irréversible.')) return;
    DataManager.reset();
    location.reload();
  }

  // ===== EXPORT PDF =====
  function handleExportPDF() {
    const { valid, errors } = Validator.validatePersonalForm();
    Validator.displayErrors(errors);

    if (!valid) {
      UI.showToast('⚠ Remplissez les champs obligatoires avant d\'exporter.', 'error');
      return;
    }

    const data = collectData();
    Templates.render(data);

    UI.showToast('🖨 Impression du PDF en cours...', 'info', 2000);
    setTimeout(() => window.print(), 400);
  }

  // ===== DÉMARRAGE =====
  document.addEventListener('DOMContentLoaded', init);

})();
