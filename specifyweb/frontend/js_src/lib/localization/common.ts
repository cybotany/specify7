/**
 * Localization strings that are shared across components
 *
 * @module
 */

import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

export const commonText = createDictionary({
  specifySeven: {
    comment: `
      This is an example of how to provide comments. Comments are visible to
      translators.
    `,
    'en-us': 'Specify 7',
    'ru-ru': 'Specify 7',
    'es-es': 'Specify 7',
    'fr-fr': 'Specify 7',
    'uk-ua': 'Specify 7',
    'de-ch': 'Specify 7',
  },
  no: {
    'en-us': 'No',
    'ru-ru': 'Нет',
    'es-es': 'No',
    'fr-fr': 'Non',
    'uk-ua': 'Ні',
    'de-ch': 'Nein',
  },
  cancel: {
    'en-us': 'Cancel',
    'ru-ru': 'Отмена',
    'es-es': 'Cancelar',
    'fr-fr': 'Annuler',
    'uk-ua': 'Скасувати',
    'de-ch': 'Abbrechen',
  },
  back: {
    'en-us': 'Back',
    'ru-ru': 'Назад',
    'es-es': 'Atrás',
    'fr-fr': 'Retour',
    'uk-ua': 'Назад',
    'de-ch': 'Zurück',
  },
  skip: {
    'en-us': 'Skip',
    'ru-ru': 'Пропустить',
    'es-es': 'Omitir',
    'fr-fr': 'Passer',
    'uk-ua': 'Пропустити',
    'de-ch': 'Überspringen',
  },
  create: {
    'en-us': 'Create',
    'ru-ru': 'Создать',
    'es-es': 'Crear',
    'fr-fr': 'Créer',
    'uk-ua': 'Створити',
    'de-ch': 'Erstellen',
  },
  close: {
    'en-us': 'Close',
    'ru-ru': 'Закрыть',
    'es-es': 'Cerrar',
    'fr-fr': 'Fermer',
    'uk-ua': 'Закрити',
    'de-ch': 'Schliessen',
  },
  apply: {
    'en-us': 'Apply',
    'ru-ru': 'Применить',
    'es-es': 'Aplicar',
    'fr-fr': 'Appliquer',
    'uk-ua': 'Застосувати',
    'de-ch': 'Anwenden',
  },
  applyAll: {
    'en-us': 'Apply All',
    'ru-ru': 'Применить все',
    'es-es': 'Aplicar todo',
    'fr-fr': 'Appliquer tout',
    'uk-ua': 'Застосувати до всіх',
    'de-ch': 'Alle Anwenden',
  },
  clearAll: {
    'en-us': 'Clear all',
    'ru-ru': 'Очистить все',
    'es-es': 'Limpiar todo',
    'fr-fr': 'Tout effacer',
    'uk-ua': 'Очистити все',
    'de-ch': 'Alles löschen',
  },
  save: {
    'en-us': 'Save',
    'ru-ru': 'Сохранить',
    'es-es': 'Guardar',
    'fr-fr': 'Enregistrer',
    'uk-ua': 'Зберегти',
    'de-ch': 'Speichern',
  },
  add: {
    'en-us': 'Add',
    'ru-ru': 'Добавить',
    'es-es': 'Agregar',
    'fr-fr': 'Ajouter',
    'uk-ua': 'Додати',
    'de-ch': 'Hinzufügen',
  },
  open: {
    'en-us': 'Open',
    'ru-ru': 'Открыть',
    'es-es': 'Abierto',
    'fr-fr': 'Ouvrir',
    'uk-ua': 'Відкрити',
    'de-ch': 'Öffnen',
  },
  delete: {
    'en-us': 'Delete',
    'ru-ru': 'Удалить',
    'es-es': 'Borrar',
    'fr-fr': 'Supprimer',
    'uk-ua': 'Видалити',
    'de-ch': 'Löschen',
  },
  next: {
    'en-us': 'Next',
    'ru-ru': 'Следующий',
    'es-es': 'Siguiente',
    'fr-fr': 'Suivant',
    'uk-ua': 'Наступний',
    'de-ch': 'Weiter',
  },
  previous: {
    'en-us': 'Previous',
    'ru-ru': 'Предыдущий',
    'es-es': 'Anterior',
    'fr-fr': 'Précédent',
    'uk-ua': 'Попередній',
    'de-ch': 'Zurück',
  },
  tool: {
    'en-us': 'Tool',
    'ru-ru': 'Инструмент',
    'es-es': 'Herramienta',
    'fr-fr': 'Outil',
    'uk-ua': 'Інструмент',
    'de-ch': 'Tool',
  },
  tools: {
    'en-us': 'Tools',
    'ru-ru': 'Инструменты',
    'es-es': 'Herramientas',
    'fr-fr': 'Outils',
    'uk-ua': 'Інструменти',
    'de-ch': 'Tools',
  },
  loading: {
    'en-us': 'Loading…',
    'ru-ru': 'Загрузка…',
    'es-es': 'Cargando...',
    'fr-fr': 'Chargement…',
    'uk-ua': 'Завантаження…',
    'de-ch': 'Laden …',
  },
  uploaded: {
    'en-us': 'Uploaded',
    'ru-ru': 'Загружено',
    'es-es': 'Cargado',
    'fr-fr': 'Importé',
    'uk-ua': 'Завантажено',
    'de-ch': 'Hochgeladen',
  },
  remove: {
    'en-us': 'Remove',
    'ru-ru': 'Удалить',
    'es-es': 'Eliminar',
    'fr-fr': 'Supprimer',
    'uk-ua': 'Видалити',
    'de-ch': 'Entfernen',
  },
  search: {
    'en-us': 'Search',
    'ru-ru': 'Искать',
    'es-es': 'Buscar',
    'fr-fr': 'Rechercher',
    'uk-ua': 'Пошук',
    'de-ch': 'Suche',
  },
  noResults: {
    'en-us': 'No Results',
    'ru-ru': 'Нет результатов',
    'es-es': 'Sin resultados',
    'fr-fr': 'Aucun résultat',
    'uk-ua': 'Немає результатів',
    'de-ch': 'Keine Resultate',
  },
  notApplicable: {
    'en-us': 'N/A',
    'ru-ru': 'Н/Д',
    'es-es': 'N / A',
    'fr-fr': 'N/A',
    'uk-ua': 'Н/З',
    'de-ch': 'N/A',
  },
  new: {
    'en-us': 'New',
    'ru-ru': 'Новый',
    'es-es': 'Nuevo',
    'fr-fr': 'Nouveau',
    'uk-ua': 'Новий',
    'de-ch': 'Neu',
  },
  edit: {
    'en-us': 'Edit',
    'ru-ru': 'Редактировать',
    'es-es': 'Editar',
    'fr-fr': 'Modifier',
    'uk-ua': 'Редагувати',
    'de-ch': 'Bearbeiten',
  },
  ignore: {
    'en-us': 'Ignore',
    'ru-ru': 'Игнорировать',
    'es-es': 'Ignorar',
    'fr-fr': 'Ignorer',
    'uk-ua': 'Ігнорувати',
    'de-ch': 'Ignorieren',
  },
  proceed: {
    'en-us': 'Proceed',
    'ru-ru': 'Продолжить',
    'es-es': 'Proceder',
    'fr-fr': 'Procéder',
    'uk-ua': 'Продовжити',
    'de-ch': 'Fortfahren',
  },
  start: {
    'en-us': 'Start',
    'ru-ru': 'Начало',
    'es-es': 'Comenzar',
    'fr-fr': 'Début',
    'uk-ua': 'Старт',
    'de-ch': 'Start',
  },
  end: {
    'en-us': 'End',
    'ru-ru': 'Конец',
    'es-es': 'Fin',
    'fr-fr': 'Fin',
    'uk-ua': 'Кінець',
    'de-ch': 'Ende',
  },
  update: {
    comment: 'Verb',
    'en-us': 'Update',
    'ru-ru': 'Обновить',
    'es-es': 'Actualizar',
    'fr-fr': 'Mettre à jour',
    'uk-ua': 'Оновити',
    'de-ch': 'Aktualisieren',
  },
  listTruncated: {
    'en-us': '(list truncated)',
    'ru-ru': '(список усечен)',
    'es-es': '(lista truncada)',
    'fr-fr': '(liste tronquée)',
    'uk-ua': '(список скорочено)',
    'de-ch': '(Liste gekürzt)',
  },
  fullDate: {
    'en-us': 'Full Date',
    'ru-ru': 'Полная дата',
    'es-es': 'Fecha completa',
    'fr-fr': 'Date complète',
    'uk-ua': 'Повна дата',
    'de-ch': 'Vollständiges Datum',
  },
  view: {
    comment: 'Verb',
    'en-us': 'View',
    'ru-ru': 'Смотреть',
    'es-es': 'Vista',
    'fr-fr': 'Affichage',
    'uk-ua': 'Відкрити',
    'de-ch': 'Ansicht',
  },
  opensInNewTab: {
    comment: 'Used in a hover-over message for links that open in new tab',
    'en-us': '(opens in a new tab)',
    'ru-ru': '(открывается в новой вкладке)',
    'es-es': '(se abre en una nueva pestaña)',
    'fr-fr': "(s'ouvre dans un nouvel onglet)",
    'uk-ua': '(відкривається в новій вкладці)',
    'de-ch': '(Öffnet sich in einer neuen Registerkarte)',
  },
  openInNewTab: {
    comment: 'Used in a button that opens a link in a new tab',
    'en-us': 'Open in New Tab',
    'ru-ru': 'Открыть в новой вкладке',
    'es-es': 'Abrir en una nueva pestaña',
    'fr-fr': 'Ouvrir dans un nouvel onglet',
    'uk-ua': 'Відкрити в новій вкладці',
    'de-ch': 'Öffnet sich in einer neuen Registerkarte',
  },
  goToHomepage: {
    'en-us': 'Go to Home Page',
    'ru-ru': 'Вернуться на Домашнюю Страницу',
    'es-es': 'Ir a la página de inicio',
    'fr-fr': "Aller à la page d'accueil",
    'uk-ua': 'Перейти на домашню сторінку',
    'de-ch': 'Zur Startseite gehen',
  },
  actions: {
    'en-us': 'Actions',
    'ru-ru': 'Действия',
    'es-es': 'Acciones:',
    'fr-fr': 'Actions',
    'uk-ua': 'Дії',
    'de-ch': 'Aktionen',
  },
  chooseCollection: {
    'en-us': 'Choose Collection',
    'ru-ru': 'Выбрать коллекцию',
    'es-es': 'Elegir colección',
    'fr-fr': 'Choisissez Collection',
    'uk-ua': 'Виберіть колекцію',
    'de-ch': 'Sammlung auswählen',
  },
  ascending: {
    comment: 'As in "Ascending sort"',
    'en-us': 'Ascending',
    'ru-ru': 'По возрастанию',
    'es-es': 'Ascendente',
    'fr-fr': 'Ascendant',
    'uk-ua': 'За зростанням',
    'de-ch': 'Aufsteigend',
  },
  descending: {
    comment: 'As in "Descending sort"',
    'en-us': 'Descending',
    'ru-ru': 'По убыванию',
    'es-es': 'Descendente',
    'fr-fr': 'Descendant',
    'uk-ua': 'За спаданням',
    'de-ch': 'Absteigend',
  },
  recordSets: {
    'en-us': 'Record Sets',
    'ru-ru': 'Наборы объектов',
    'es-es': 'Conjuntos de registros',
    'fr-fr': "Ensembles d'enregistrements",
    'uk-ua': 'Набори записів',
    'de-ch': 'Satzgruppen',
  },
  recordCount: {
    'en-us': 'Record Count',
    'ru-ru': 'Количество объектов',
    'es-es': 'Recuento de Registros',
    'fr-fr': "Nombre d'enregistrements",
    'uk-ua': 'Кількість записів',
    'de-ch': 'Anzahl der Datensätze',
  },
  size: {
    'en-us': 'Size',
    'ru-ru': 'Размер',
    'es-es': 'Tamaño',
    'fr-fr': 'Taille',
    'uk-ua': 'Розмір',
    'de-ch': 'Grösse',
  },
  running: {
    'en-us': 'Running…',
    'ru-ru': 'Выполнение…',
    'es-es': 'Ejecutando...',
    'fr-fr': 'Exécution…',
    'uk-ua': 'Виконується…',
    'de-ch': 'In Arbeit …',
  },
  noMatches: {
    'en-us': 'No Matches',
    'ru-ru': 'Нет совпадений',
    'es-es': 'No hay coincidencias',
    'fr-fr': 'Pas de correspondance',
    'uk-ua': 'Немає збігів',
    'de-ch': 'Keine Treffer',
  },
  searchQuery: {
    'en-us': 'Search Query',
    'ru-ru': 'Поиск',
    'es-es': 'Consulta de búsqueda',
    'fr-fr': 'Requête de recherche',
    'uk-ua': 'Пошуковий запит',
    'de-ch': 'Suchabfrage',
  },
  unknown: {
    'en-us': 'Unknown',
    'ru-ru': 'Неизвестно',
    'es-es': 'Desconocido',
    'fr-fr': 'Inconnu',
    'uk-ua': 'Невідомий',
    'de-ch': 'Unbekannt',
  },
  language: {
    'en-us': 'Language',
    'ru-ru': 'Язык',
    'es-es': 'Idioma:',
    'fr-fr': 'Langue',
    'uk-ua': 'Мова',
    'de-ch': 'Sprache',
  },
  country: {
    'en-us': 'Country',
    'ru-ru': 'Страна',
    'es-es': 'País',
    'fr-fr': 'Pays',
    'uk-ua': 'Країна',
    'de-ch': 'Land',
  },
  transactions: {
    'en-us': 'Transactions',
    'ru-ru': 'Транзакции',
    'es-es': 'Transacciones',
    'fr-fr': 'Transactions',
    'uk-ua': 'Транзакції',
    'de-ch': 'Transaktionen',
  },
  viewRecord: {
    'en-us': 'View Record',
    'ru-ru': 'Открыть запись',
    'es-es': 'Ver Registro',
    'fr-fr': "Afficher l'enregistrement",
    'uk-ua': 'Переглянути запис',
    'de-ch': 'Datensatz anzeigen',
  },
  nullInline: {
    'en-us': '(null)',
    'ru-ru': '(нулевой)',
    'es-es': '(nulo)',
    'fr-fr': '(null)',
    'uk-ua': '(нема)',
    'de-ch': '(null)',
  },
  filePickerMessage: {
    comment: 'Generic. Could refer to any file',
    'en-us': 'Choose a file or drag it here',
    'ru-ru': 'Выберите файл или перетащите его сюда',
    'es-es': 'Elija un archivo o arrástrelo aquí',
    'fr-fr': 'Sélectionnez un fichier ou déposez-le ici',
    'uk-ua': 'Виберіть файл або перетягніть його сюди',
    'de-ch': 'Wählen eine Datei oder ziehen sie hierhin',
  },
  selectedFileName: {
    'en-us': 'Selected file',
    'ru-ru': 'Выбранный файл',
    'es-es': 'Fichero seleccionado',
    'fr-fr': 'Fichier sélectionné',
    'uk-ua': 'Вибраний файл',
    'de-ch': 'Gewählte Datei',
  },
  all: {
    'en-us': 'All',
    'ru-ru': 'Все',
    'es-es': 'Todo',
    'fr-fr': 'Tous',
    'uk-ua': 'Все',
    'de-ch': 'Alle',
  },
  unused: {
    'en-us': 'Unused',
    'ru-ru': 'Неиспользованные',
    'es-es': 'Sin usar',
    'fr-fr': 'Inutilisé',
    'uk-ua': 'Невикористаний',
    'de-ch': 'Unbenutzt',
  },
  ordinal: {
    'en-us': 'Ordinal',
    'ru-ru': 'Порядковый номер',
    'es-es': 'Ordinal',
    'fr-fr': 'Ordinal',
    'uk-ua': 'Порядковий',
    'de-ch': 'Reihenfolge',
  },
  export: {
    'en-us': 'Export',
    'ru-ru': 'Экспорт',
    'es-es': 'Exportar',
    'fr-fr': 'Exporter',
    'uk-ua': 'Експорт',
    'de-ch': 'Export',
  },
  import: {
    'en-us': 'Import',
    'ru-ru': 'Импорт',
    'es-es': 'Importar',
    'fr-fr': 'Importer',
    'uk-ua': 'Імпорт',
    'de-ch': 'Import',
  },
  dismiss: {
    'en-us': 'Dismiss',
    'ru-ru': 'Отклонить',
    'es-es': 'Desestimar',
    'fr-fr': 'Fermer',
    'uk-ua': 'Відхилити',
    'de-ch': 'Ablehnen',
  },
  id: {
    'en-us': 'ID',
    'ru-ru': 'ИД',
    'es-es': 'IDENTIFICACIÓN',
    'fr-fr': 'ID',
    'uk-ua': 'ІД',
    'de-ch': 'ID',
  },
  filter: {
    'en-us': 'Filter',
    'ru-ru': 'Фильтрировать',
    'es-es': 'Filtro',
    'fr-fr': 'Filtre',
    'uk-ua': 'Фільтр',
    'de-ch': 'Filter',
  },
  results: {
    'en-us': 'Results',
    'ru-ru': 'Результаты',
    'es-es': 'Resultados',
    'fr-fr': 'Résultats',
    'uk-ua': 'Результати',
    'de-ch': 'Resultate',
  },
  downloadErrorMessage: {
    'en-us': 'Download Error Message',
    'ru-ru': 'Скачать ошибку',
    'es-es': 'Mensaje de error de descarga',
    'fr-fr': "Télécharger le message d'erreur",
    'uk-ua': 'Завантажити звіт',
    'de-ch': 'Fehlermeldung herunterladen',
  },
  copied: {
    'en-us': 'Copied!',
    'ru-ru': 'Скопировано!',
    'es-es': '¡Copiado!',
    'fr-fr': 'Copié !',
    'uk-ua': 'Скопійовано!',
    'de-ch': 'Wurde kopiert!',
  },
  copyToClipboard: {
    'en-us': 'Copy to clipboard',
    'ru-ru': 'Скопировать в буфер обмена',
    'es-es': 'Copiar al portapapeles',
    'fr-fr': 'Copier dans le presse-papiers',
    'uk-ua': 'Копіювати в буфер обміну',
    'de-ch': 'In Zwischenablage kopieren',
  },
  selected: {
    'en-us': 'Selected',
    'ru-ru': 'Выбрано',
    'es-es': 'Selección',
    'fr-fr': 'Sélectionné',
    'uk-ua': 'Вибрано',
    'de-ch': 'Ausgewählt',
  },
  expand: {
    'en-us': 'Expand',
    'ru-ru': 'Расширить',
    'es-es': 'Expandir',
    'fr-fr': 'Agrandir',
    'uk-ua': 'Розгорнути',
    'de-ch': 'Aufklappen',
  },
  expandAll: {
    'en-us': 'Expand All',
    'ru-ru': 'Развернуть все',
    'es-es': 'Ampliar todo',
    'fr-fr': 'Tout agrandir',
    'uk-ua': 'Розгорнути всі',
    'de-ch': 'Alle aufklappen',
  },
  collapse: {
    'en-us': 'Collapse',
    'es-es': 'Colapso',
    'fr-fr': 'Effondrement',
    'ru-ru': 'Крах',
    'uk-ua': 'Колапс',
    'de-ch': 'Zuklappen',
  },
  collapseAll: {
    'en-us': 'Collapse All',
    'ru-ru': 'Свернуть все',
    'es-es': 'Contraer todo',
    'fr-fr': 'Tout réduire',
    'uk-ua': 'Згорнути всі',
    'de-ch': 'Alle zuklappen',
  },
  reset: {
    'en-us': 'Reset',
    'ru-ru': 'Сброс',
    'es-es': 'Restablecer',
    'fr-fr': 'Réinitialiser',
    'uk-ua': 'Скинути',
    'de-ch': 'Zurücksetzen',
  },
  select: {
    'en-us': 'Select',
    'ru-ru': 'Выбрать',
    'es-es': 'Seleccione',
    'fr-fr': 'Sélectionner',
    'uk-ua': 'Вибрати',
    'de-ch': 'Auswählen',
  },
  none: {
    'en-us': 'None',
    'ru-ru': 'Никакой',
    'es-es': 'Ninguno',
    'fr-fr': 'Aucun',
    'uk-ua': 'Ніяке',
    'de-ch': 'Keine',
  },
  noneAvailable: {
    'en-us': 'None available',
    'ru-ru': 'Нет доступных вариантов',
    'es-es': 'Ninguno disponible',
    'fr-fr': 'Aucun disponible',
    'uk-ua': 'Немає доступних',
    'de-ch': 'Keine Verfügbar',
  },
  countLine: {
    comment: 'Example usage: Record Sets (1,234)',
    'en-us': '{resource:string} ({count:number|formatted})',
    'ru-ru': '{resource:string} ({count:number|formatted})',
    'es-es': '{resource:string} ({count:number|formatted})',
    'fr-fr': '{resource:string} ({count:number|formatted})',
    'uk-ua': '{resource:string} ({count:number|formatted})',
    'de-ch': '{resource:string} ({count:number|formatted})',
  },
  jsxCountLine: {
    comment: 'Example usage: Record Sets (1,234)',
    'en-us': '{resource:string} <wrap>({count:number|formatted})</wrap>',
    'ru-ru': '{resource:string} <wrap>({count:number|formatted})</wrap>',
    'es-es': '{resource:string} <wrap>({count:number|formatted})</wrap>',
    'fr-fr': '{resource:string} <wrap>({count:number|formatted})</wrap>',
    'uk-ua': '{resource:string} <wrap>({count:number|formatted})</wrap>',
    'de-ch': '{resource:string} <wrap>({count:number|formatted})</wrap>',
  },
  colonLine: {
    comment: `
      Example usage: "Created by: Full Name" OR "Record Set: Record Set Name"
    `,
    'en-us': '{label:string}: {value:string}',
    'ru-ru': '{label:string}: {value:string}',
    'es-es': '{label:string}: {value:string}',
    'fr-fr': '{label:string}: {value:string}',
    'uk-ua': '{label:string}: {value:string}',
    'de-ch': '{label:string}: {value:string}',
  },
  jsxColonLine: {
    comment: `
      Example usage: "Created by: Full Name" OR "Record Set: Record Set Name"
    `,
    'en-us': '{label:string}: <wrap />',
    'ru-ru': '{label:string}: <wrap />',
    'es-es': '{label:string}: <wrap />',
    'fr-fr': '{label:string} : <wrap />',
    'uk-ua': '{label:string}: <wrap />',
    'de-ch': '{label:string}: <wrap />',
  },
  online: {
    'en-us': 'online',
    'es-es': 'conectado',
    'fr-fr': 'en ligne',
    'ru-ru': 'В сети',
    'uk-ua': 'онлайн',
    'de-ch': 'Online',
  },
  offline: {
    'en-us': 'offline',
    'es-es': 'desconectado',
    'fr-fr': 'hors ligne',
    'ru-ru': 'Не в сети',
    'uk-ua': 'офлайн',
    'de-ch': 'Offline',
  },
  bulkSelect: {
    'en-us': 'Bulk Select',
    'es-es': 'Selección en masa',
    'fr-fr': 'Sélection groupée',
    'ru-ru': 'Массовый выбор',
    'uk-ua': 'Масовий вибір',
    'de-ch': 'Mehrfachauswahl',
  },
  timeRemaining: {
    'en-us': 'Time remaining',
    'es-es': 'Tiempo restante',
    'fr-fr': 'Temps restant',
    'ru-ru': 'Времени осталось',
    'uk-ua': 'Час, що залишився',
    'de-ch': 'Noch verbleibende Zeit',
  },
  change: {
    comment: 'Verb',
    'en-us': 'Change',
    'de-ch': 'Ändern',
    'es-es': 'español',
    'fr-fr': 'Changement',
    'ru-ru': 'Изменять',
    'uk-ua': 'Зміна',
  },
  accept: {
    'en-us': 'Accept',
  },
  dontShowAgain: {
    'en-us': `Don't show this again`,
  },
} as const);
