/**
 * templates.js – Génération des templates de CV
 * Responsabilité : Produire le HTML du CV selon le modèle choisi
 */

const Templates = (() => {

  // ===== DONNÉES HELPERS =====
  function escHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fullName(p) {
    return `${escHtml(p.firstName)} ${escHtml(p.lastName)}`.trim();
  }

  function initials(p) {
    return `${(p.firstName||'').charAt(0)}${(p.lastName||'').charAt(0)}`.toUpperCase() || '?';
  }

  // ===== COMPOSANTS PARTAGÉS =====

  function renderExperiencesModern(experiences) {
    if (!experiences.length) return '';
    return `
      <div class="cv-section" style="margin-bottom:22px">
        <div class="cv-section-title">Expériences professionnelles</div>
        ${experiences.map(e => `
          <div class="cv-entry">
            <div class="cv-entry-header">
              <span class="cv-entry-title">${escHtml(e.poste)}</span>
              <span class="cv-entry-date">${escHtml(e.debut)}${e.fin ? ' – '+escHtml(e.fin) : ''}</span>
            </div>
            ${e.entreprise ? `<div class="cv-entry-subtitle">${escHtml(e.entreprise)}</div>` : ''}
            ${e.desc ? `<div class="cv-entry-desc">${escHtml(e.desc)}</div>` : ''}
          </div>
        `).join('')}
      </div>`;
  }

  function renderSkillsSidebar(skills) {
    if (!skills.length) return '';
    return `
      <div class="cv-section" style="margin-bottom:20px">
        <div class="cv-section-title" style="font-size:8.5pt">Compétences</div>
        ${skills.map(s => `
          <div class="cv-skill-item">
            <div class="cv-skill-name">${escHtml(s.name)} <span style="color:#888;font-size:7pt">${escHtml(s.category)}</span></div>
            <div class="cv-skill-bar">
              <div class="cv-skill-fill" style="width:${s.level}%"></div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  function renderInterestsSidebar(interests) {
    if (!interests.length) return '';
    return `
      <div class="cv-section">
        <div class="cv-section-title" style="font-size:8.5pt">Centres d'intérêt</div>
        <div class="cv-interests">
          ${interests.map(i => `<span class="cv-interest-tag">${escHtml(i.name)}</span>`).join('')}
        </div>
      </div>`;
  }

  function renderEducationSidebar(educations) {
    if (!educations.length) return '';
    return `
      <div class="cv-section" style="margin-bottom:20px">
        <div class="cv-section-title" style="font-size:8.5pt">Formations</div>
        ${educations.map(e => `
          <div class="cv-edu-item">
            <div class="cv-edu-degree">${escHtml(e.diplome)}</div>
            <div class="cv-edu-school">${escHtml(e.ecole)}</div>
            <div class="cv-edu-year">${escHtml(e.annee)}</div>
          </div>
        `).join('')}
      </div>`;
  }

  // ===================================================
  // TEMPLATE : MODERNE
  // ===================================================
  function renderModern(data) {
    const p = data.personal;
    const hasContent = p.firstName || p.lastName;

    return `
    <div class="cv-mod-header">
      <div style="display:flex;align-items:center;gap:20px">
        ${p.photo ? `<img src="${p.photo}" class="cv-photo" alt="Photo de profil" />` : ''}
        <div>
          <div class="cv-mod-name">${fullName(p) || 'Votre Nom'}</div>
          <div class="cv-mod-title">${escHtml(p.jobTitle) || 'Titre professionnel'}</div>
          <div class="cv-mod-contacts">
            ${p.email ? `<div class="cv-mod-contact-item"><span class="icon">✉</span>${escHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div class="cv-mod-contact-item"><span class="icon">📞</span>${escHtml(p.phone)}</div>` : ''}
            ${p.city  ? `<div class="cv-mod-contact-item"><span class="icon">📍</span>${escHtml(p.city)}</div>` : ''}
            ${p.linkedin ? `<div class="cv-mod-contact-item"><span class="icon">🔗</span>${escHtml(p.linkedin)}</div>` : ''}
          </div>
        </div>
      </div>
    </div>

    <div class="cv-mod-body">
      <!-- SIDEBAR -->
      <div class="cv-mod-sidebar">
        ${renderEducationSidebar(data.educations)}
        ${renderSkillsSidebar(data.skills)}
        ${renderInterestsSidebar(data.interests)}
      </div>

      <!-- MAIN -->
      <div class="cv-mod-main">
        ${p.summary ? `
          <div class="cv-section" style="margin-bottom:22px">
            <div class="cv-section-title">Profil</div>
            <div class="cv-summary">${escHtml(p.summary)}</div>
          </div>` : ''}
        ${renderExperiencesModern(data.experiences)}
      </div>
    </div>`;
  }

  // ===================================================
  // TEMPLATE : CLASSIQUE
  // ===================================================
  function renderClassic(data) {
    const p = data.personal;

    return `
    <div class="cv-cla-wrapper">
      <!-- SIDEBAR -->
      <div class="cv-cla-sidebar">
        ${p.photo
          ? `<img src="${p.photo}" class="cv-photo-classic" alt="Photo de profil" />`
          : `<div class="cv-cla-avatar">${initials(p)}</div>`
        }
        <div class="cv-cla-name">${fullName(p) || 'Votre Nom'}</div>
        <div class="cv-cla-title">${escHtml(p.jobTitle) || 'Titre professionnel'}</div>
        <div class="cv-cla-divider"></div>

        <!-- Contacts -->
        <div class="cv-cla-section-title">Contact</div>
        ${p.email ? `<div class="cv-cla-contact-item">✉ ${escHtml(p.email)}</div>` : ''}
        ${p.phone ? `<div class="cv-cla-contact-item">📞 ${escHtml(p.phone)}</div>` : ''}
        ${p.city  ? `<div class="cv-cla-contact-item">📍 ${escHtml(p.city)}</div>` : ''}
        ${p.linkedin ? `<div class="cv-cla-contact-item">🔗 ${escHtml(p.linkedin)}</div>` : ''}

        ${data.skills.length ? `
          <div class="cv-cla-divider"></div>
          <div class="cv-cla-section-title">Compétences</div>
          ${data.skills.map(s => `
            <div class="cv-cla-skill-item">
              <div class="cv-cla-skill-name">${escHtml(s.name)}</div>
              <div class="cv-cla-skill-bar">
                <div class="cv-cla-skill-fill" style="width:${s.level}%"></div>
              </div>
            </div>`).join('')}
        ` : ''}

        ${data.interests.length ? `
          <div class="cv-cla-divider"></div>
          <div class="cv-cla-section-title">Centres d'intérêt</div>
          ${data.interests.map(i => `<div class="cv-cla-interest">${escHtml(i.name)}</div>`).join('')}
        ` : ''}
      </div>

      <!-- MAIN -->
      <div class="cv-cla-main">

        ${p.summary ? `
          <div class="cv-cla-section">
            <div class="cv-cla-main-title">Profil</div>
            <div class="cv-cla-summary">${escHtml(p.summary)}</div>
          </div>` : ''}

        ${data.experiences.length ? `
          <div class="cv-cla-section">
            <div class="cv-cla-main-title">Expériences</div>
            ${data.experiences.map(e => `
              <div class="cv-cla-entry">
                <div class="cv-cla-entry-title">${escHtml(e.poste)}</div>
                ${e.entreprise ? `<div class="cv-cla-entry-sub">${escHtml(e.entreprise)}</div>` : ''}
                <div class="cv-cla-entry-date">${escHtml(e.debut)}${e.fin ? ' – '+escHtml(e.fin) : ''}</div>
                ${e.desc ? `<div class="cv-cla-entry-desc">${escHtml(e.desc)}</div>` : ''}
              </div>`).join('')}
          </div>` : ''}

        ${data.educations.length ? `
          <div class="cv-cla-section">
            <div class="cv-cla-main-title">Formations</div>
            ${data.educations.map(e => `
              <div class="cv-cla-entry">
                <div class="cv-cla-entry-title">${escHtml(e.diplome)}</div>
                <div class="cv-cla-entry-sub">${escHtml(e.ecole)}</div>
                <div class="cv-cla-entry-date">${escHtml(e.annee)}</div>
              </div>`).join('')}
          </div>` : ''}
      </div>
    </div>`;
  }

  // ===== RENDER PUBLIC =====
  function render(data) {
    const preview = document.getElementById('cvPreview');
    if (!preview) return;

    const template = data.template || 'modern';
    preview.className = `cv-document template-${template}`;

    let html = '';
    if (template === 'modern') html = renderModern(data);
    else if (template === 'classic') html = renderClassic(data);

    preview.innerHTML = html;
  }

  return { render };
})();
