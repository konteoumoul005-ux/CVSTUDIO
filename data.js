/**
 * data.js – Gestion des données et localStorage
 * Responsabilité : Sauvegarder, charger et réinitialiser les données du CV
 */

const STORAGE_KEY = 'cvStudio_data';

const DataManager = (() => {

  // Structure de données par défaut
  const defaultData = () => ({
    personal: {
      firstName: '', lastName: '', jobTitle: '',
      email: '', phone: '', city: '',
      linkedin: '', summary: '', cvPassword: '',
      photo: ''   // base64 de la photo de profil
    },
    experiences: [],
    educations: [],
    skills: [],
    interests: [],
    template: 'modern'
  });

  let _data = defaultData();

  /** Charger les données depuis le localStorage */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        _data = { ...defaultData(), ...JSON.parse(raw) };
      }
    } catch (e) {
      console.warn('Erreur de chargement localStorage:', e);
      _data = defaultData();
    }
    return _data;
  }

  /** Sauvegarder les données dans le localStorage */
  function save(data) {
    try {
      _data = { ..._data, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
    } catch (e) {
      console.warn('Erreur de sauvegarde localStorage:', e);
    }
  }

  /** Mettre à jour les infos personnelles */
  function savePersonal(personal) {
    _data.personal = { ..._data.personal, ...personal };
    _persist();
  }

  /** Mettre à jour une section dynamique */
  function saveSection(section, items) {
    if (['experiences', 'educations', 'skills', 'interests'].includes(section)) {
      _data[section] = items;
      _persist();
    }
  }

  /** Sauvegarder le template choisi */
  function saveTemplate(template) {
    _data.template = template;
    _persist();
  }

  /** Réinitialiser toutes les données */
  function reset() {
    _data = defaultData();
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Obtenir une copie des données actuelles */
  function get() {
    return JSON.parse(JSON.stringify(_data));
  }

  /** Persister en interne */
  function _persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
    } catch (e) {
      console.warn('Erreur persistence:', e);
    }
  }

  return { load, save, savePersonal, saveSection, saveTemplate, reset, get };
})();
