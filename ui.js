/**
 * ui.js – Manipulation de l'interface utilisateur
 * Responsabilité : Créer / modifier / supprimer les entrées dynamiques
 */

const UI = (() => {

  let expCounter = 0, eduCounter = 0, skillCounter = 0, interestCounter = 0;

  // ===== TOAST =====
  function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    setTimeout(() => toast.classList.add('hidden'), duration);
  }

  // ===== EXPÉRIENCES =====
  function addExperience(data = {}) {
    expCounter++;
    const id = `exp-${expCounter}`;
    const container = document.getElementById('experienceList');
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.id = id;
    card.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">Expérience #${expCounter}</span>
        <div class="entry-actions">
          <button class="btn-icon" title="Supprimer" onclick="UI.removeEntry('${id}','experienceList')">🗑</button>
        </div>
      </div>
      <div class="entry-grid">
        <div class="entry-field">
          <label>Poste</label>
          <input type="text" class="exp-poste" placeholder="Développeur Frontend" value="${data.poste||''}" />
        </div>
        <div class="entry-field">
          <label>Entreprise</label>
          <input type="text" class="exp-entreprise" placeholder="Orange Sénégal" value="${data.entreprise||''}" />
        </div>
        <div class="entry-field">
          <label>Début</label>
          <input type="text" class="exp-debut" placeholder="Jan 2022" value="${data.debut||''}" />
        </div>
        <div class="entry-field">
          <label>Fin</label>
          <input type="text" class="exp-fin" placeholder="Présent" value="${data.fin||''}" />
        </div>
        <div class="entry-field full">
          <label>Description</label>
          <textarea class="exp-desc" rows="2" placeholder="Développement d'applications React...">${data.desc||''}</textarea>
        </div>
      </div>
    `;
    container.appendChild(card);
    return card;
  }

  function getExperiences() {
    return Array.from(document.querySelectorAll('#experienceList .entry-card')).map(card => ({
      poste: card.querySelector('.exp-poste')?.value || '',
      entreprise: card.querySelector('.exp-entreprise')?.value || '',
      debut: card.querySelector('.exp-debut')?.value || '',
      fin: card.querySelector('.exp-fin')?.value || '',
      desc: card.querySelector('.exp-desc')?.value || ''
    }));
  }

  // ===== FORMATIONS =====
  function addEducation(data = {}) {
    eduCounter++;
    const id = `edu-${eduCounter}`;
    const container = document.getElementById('educationList');
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.id = id;
    card.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">Formation #${eduCounter}</span>
        <div class="entry-actions">
          <button class="btn-icon" title="Supprimer" onclick="UI.removeEntry('${id}','educationList')">🗑</button>
        </div>
      </div>
      <div class="entry-grid">
        <div class="entry-field full">
          <label>Diplôme / Titre</label>
          <input type="text" class="edu-diplome" placeholder="Licence en Informatique" value="${data.diplome||''}" />
        </div>
        <div class="entry-field">
          <label>Établissement</label>
          <input type="text" class="edu-ecole" placeholder="IAM Dakar" value="${data.ecole||''}" />
        </div>
        <div class="entry-field">
          <label>Année</label>
          <input type="text" class="edu-annee" placeholder="2022 – 2025" value="${data.annee||''}" />
        </div>
      </div>
    `;
    container.appendChild(card);
    return card;
  }

  function getEducations() {
    return Array.from(document.querySelectorAll('#educationList .entry-card')).map(card => ({
      diplome: card.querySelector('.edu-diplome')?.value || '',
      ecole: card.querySelector('.edu-ecole')?.value || '',
      annee: card.querySelector('.edu-annee')?.value || ''
    }));
  }

  // ===== COMPÉTENCES =====
  function addSkill(data = {}) {
    skillCounter++;
    const id = `skill-${skillCounter}`;
    const container = document.getElementById('skillsList');
    const level = data.level !== undefined ? data.level : 75;
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.id = id;
    card.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">Compétence #${skillCounter}</span>
        <div class="entry-actions">
          <button class="btn-icon" title="Supprimer" onclick="UI.removeEntry('${id}','skillsList')">🗑</button>
        </div>
      </div>
      <div class="entry-grid">
        <div class="entry-field">
          <label>Compétence</label>
          <input type="text" class="skill-name" placeholder="JavaScript" value="${data.name||''}" />
        </div>
        <div class="entry-field">
          <label>Catégorie</label>
          <input type="text" class="skill-cat" placeholder="Langage" value="${data.category||''}" />
        </div>
        <div class="entry-field full">
          <label>Niveau (${level}%)</label>
          <input type="range" class="skill-level" min="10" max="100" step="5" value="${level}"
            oninput="this.previousElementSibling.textContent='Niveau ('+this.value+'%)'" />
        </div>
      </div>
    `;
    container.appendChild(card);
    return card;
  }

  function getSkills() {
    return Array.from(document.querySelectorAll('#skillsList .entry-card')).map(card => ({
      name: card.querySelector('.skill-name')?.value || '',
      category: card.querySelector('.skill-cat')?.value || '',
      level: card.querySelector('.skill-level')?.value || 75
    }));
  }

  // ===== CENTRES D'INTÉRÊT =====
  function addInterest(data = {}) {
    interestCounter++;
    const id = `interest-${interestCounter}`;
    const container = document.getElementById('interestsList');
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.dataset.id = id;
    card.innerHTML = `
      <div class="entry-header">
        <span class="entry-title">Centre d'intérêt #${interestCounter}</span>
        <div class="entry-actions">
          <button class="btn-icon" title="Supprimer" onclick="UI.removeEntry('${id}','interestsList')">🗑</button>
        </div>
      </div>
      <div class="entry-grid">
        <div class="entry-field full">
          <label>Centre d'intérêt</label>
          <input type="text" class="interest-name" placeholder="Football, Lecture, Photographie..." value="${data.name||''}" />
        </div>
      </div>
    `;
    container.appendChild(card);
    return card;
  }

  function getInterests() {
    return Array.from(document.querySelectorAll('#interestsList .entry-card')).map(card => ({
      name: card.querySelector('.interest-name')?.value || ''
    }));
  }

  // ===== SUPPRIMER ENTRÉE =====
  function removeEntry(id, containerId) {
    const container = document.getElementById(containerId);
    const card = container.querySelector(`[data-id="${id}"]`);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(-8px)';
      card.style.transition = 'all 0.2s';
      setTimeout(() => card.remove(), 200);
    }
  }

  // ===== REMPLIR FORMULAIRE (depuis données sauvegardées) =====
  function fillPersonalForm(personal) {
    const fields = ['firstName','lastName','jobTitle','email','phone','city','linkedin','summary','cvPassword'];
    fields.forEach(f => {
      const el = document.getElementById(f);
      if (el && personal[f] !== undefined) el.value = personal[f];
    });
  }

  function fillDynamicSections(data) {
    document.getElementById('experienceList').innerHTML = '';
    document.getElementById('educationList').innerHTML = '';
    document.getElementById('skillsList').innerHTML = '';
    document.getElementById('interestsList').innerHTML = '';
    expCounter = 0; eduCounter = 0; skillCounter = 0; interestCounter = 0;

    (data.experiences || []).forEach(e => addExperience(e));
    (data.educations || []).forEach(e => addEducation(e));
    (data.skills || []).forEach(e => addSkill(e));
    (data.interests || []).forEach(e => addInterest(e));
  }

  // ===== PHOTO DE PROFIL =====
  let _photoBase64 = '';

  function initPhotoUpload(onChangeCallback) {
    const input = document.getElementById('photoInput');
    const preview = document.getElementById('photoPreview');
    const removeBtn = document.getElementById('btnRemovePhoto');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Vérification taille max 2 Mo
      if (file.size > 2 * 1024 * 1024) {
        showToast('⚠ Photo trop lourde (max 2 Mo)', 'error');
        return;
      }
      // Vérification type
      if (!file.type.startsWith('image/')) {
        showToast('⚠ Format invalide. JPG, PNG ou WEBP requis.', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        _photoBase64 = ev.target.result;
        _renderPhotoPreview(_photoBase64);
        removeBtn.style.display = 'inline-block';
        showToast('✅ Photo chargée avec succès !', 'success');
        if (onChangeCallback) onChangeCallback(_photoBase64);
      };
      reader.readAsDataURL(file);
    });

    removeBtn.addEventListener('click', () => {
      _photoBase64 = '';
      preview.innerHTML = '<span class="photo-placeholder-icon">📷</span>';
      removeBtn.style.display = 'none';
      input.value = '';
      if (onChangeCallback) onChangeCallback('');
    });
  }

  function _renderPhotoPreview(base64) {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = `<img src="${base64}" alt="Photo de profil" />`;
  }

  function setPhoto(base64) {
    _photoBase64 = base64 || '';
    const removeBtn = document.getElementById('btnRemovePhoto');
    if (_photoBase64) {
      _renderPhotoPreview(_photoBase64);
      if (removeBtn) removeBtn.style.display = 'inline-block';
    } else {
      const preview = document.getElementById('photoPreview');
      if (preview) preview.innerHTML = '<span class="photo-placeholder-icon">📷</span>';
      if (removeBtn) removeBtn.style.display = 'none';
    }
  }

  function getPhoto() {
    return _photoBase64;
  }

  // ===== MOB TABS =====
  function switchMobileTab(tab) {
    const form = document.getElementById('panelForm');
    const preview = document.getElementById('panelPreview');
    if (tab === 'editor') {
      form.classList.remove('hide');
      preview.classList.remove('show');
    } else {
      form.classList.add('hide');
      preview.classList.add('show');
    }
  }

  return {
    showToast,
    addExperience, getExperiences,
    addEducation, getEducations,
    addSkill, getSkills,
    addInterest, getInterests,
    removeEntry,
    fillPersonalForm, fillDynamicSections,
    initPhotoUpload, setPhoto, getPhoto,
    switchMobileTab
  };
})();
