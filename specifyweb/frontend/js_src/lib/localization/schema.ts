/**
 * Localization strings used in the Schema Config and data model viewer
 *
 * @module
 */

import { createDictionary } from './utils';

// Refer to "Guidelines for Programmers" in ./README.md before editing this file

export const schemaText = createDictionary({
  table: {
    'en-us': 'Table',
    'ru-ru': 'Таблица',
    'es-es': 'Mesa',
    'fr-fr': 'Tableau',
    'uk-ua': 'Таблиця',
  },
  tables: {
    'en-us': 'Tables',
    'ru-ru': 'Таблицы',
    'es-es': 'Mesas',
    'fr-fr': 'Tableaux',
    'uk-ua': 'Таблиці',
  },
  tableName: {
    'en-us': 'Table Name',
    'ru-ru': 'Имя таблицы',
    'es-es': 'Nombre de la tabla',
    'fr-fr': 'Nom du tableau',
    'uk-ua': 'Назва таблиці',
  },
  schemaConfig: {
    'en-us': 'Schema Config',
    'ru-ru': 'Конфигурация схемы',
    'es-es': 'Configuración de esquema',
    'fr-fr': 'Configuration du schéma',
    'uk-ua': 'Конфігурація схеми',
  },
  unsavedSchemaUnloadProtect: {
    'en-us': 'Schema changes have not been saved',
    'ru-ru': 'Изменения схемы не сохранены',
    'es-es': 'Los cambios de esquema no se han guardado',
    'fr-fr': "Les modifications du schéma n'ont pas été enregistrées",
    'uk-ua': 'Зміни схеми не збережено',
  },
  changeBaseTable: {
    'en-us': 'Change Base Table',
    'ru-ru': 'Изменить базовую таблицу',
    'es-es': 'Cambiar tabla base',
    'fr-fr': 'Modifier la base de tableau',
    'uk-ua': 'Змінити базову таблицю',
  },
  field: {
    'en-us': 'Field',
    'ru-ru': 'Поле',
    'es-es': 'Campo',
    'fr-fr': 'Champ',
    'uk-ua': 'Поле',
  },
  fields: {
    'en-us': 'Fields',
    'ru-ru': 'Поля',
    'es-es': 'Los campos',
    'fr-fr': 'Champs',
    'uk-ua': 'поля',
  },
  relationships: {
    'en-us': 'Relationships',
    'ru-ru': 'Отношения',
    'es-es': 'Relaciones',
    'fr-fr': 'Relations',
    'uk-ua': 'стосунки',
  },
  caption: {
    'en-us': 'Caption',
    'ru-ru': 'Подпись',
    'es-es': 'Subtítulo',
    'fr-fr': 'Légende',
    'uk-ua': 'Підпис',
  },
  description: {
    'en-us': 'Description',
    'ru-ru': 'Описание',
    'es-es': 'Descripción',
    'fr-fr': 'Description',
    'uk-ua': 'опис',
  },
  hideTable: {
    'en-us': 'Hide Table',
    'ru-ru': 'Скрыть таблицу',
    'es-es': 'Ocultar tabla',
    'fr-fr': 'Masquer le tableau',
    'uk-ua': 'Приховати таблицю',
  },
  hideField: {
    'en-us': 'Hide Field',
    'ru-ru': 'Скрыть поле',
    'es-es': 'Ocultar campo',
    'fr-fr': 'Masquer le champ',
    'uk-ua': 'Приховати поле',
  },
  tableFormat: {
    'en-us': 'Table Format',
    'ru-ru': 'Формат таблицы',
    'es-es': 'Formato de tabla',
    'fr-fr': 'Format de tableau',
    'uk-ua': 'Формат таблиці',
  },
  tableAggregation: {
    'en-us': 'Table Aggregation',
    'ru-ru': 'Агрегация таблиц',
    'es-es': 'Agregación de tablas',
    'fr-fr': 'Agrégation de tableaux',
    'uk-ua': 'Агрегація таблиць',
  },
  oneToOne: {
    'en-us': 'One-to-one',
    'ru-ru': 'Один к одному',
    'es-es': 'Cara a cara',
    'fr-fr': 'Un à un',
    'uk-ua': 'Один до одного',
  },
  oneToMany: {
    'en-us': 'One-to-many',
    'ru-ru': 'Один ко многим',
    'es-es': 'Uno a muchos',
    'fr-fr': 'Un à plusieurs',
    'uk-ua': 'Один до багатьох',
  },
  manyToOne: {
    'en-us': 'Many-to-one',
    'ru-ru': 'Многие к одному',
    'es-es': 'muchos a uno',
    'fr-fr': 'Plusieurs à un',
    'uk-ua': 'Багато-до-одного',
  },
  manyToMany: {
    'en-us': 'many-to-many',
    'ru-ru': 'Многие-ко-многим',
    'es-es': 'muchos a muchos',
    'fr-fr': 'Plusieurs à plusieurs',
    'uk-ua': 'багато-до-багатьох',
  },
  fieldLength: {
    'en-us': 'Length',
    'ru-ru': 'Длина',
    'es-es': 'Longitud',
    'fr-fr': 'Longueur',
    'uk-ua': 'Довжина',
  },
  readOnly: {
    'en-us': 'Read-only',
    'ru-ru': 'Только чтение',
    'es-es': 'Solo lectura',
    'fr-fr': 'Lecture seule',
    'uk-ua': 'Лише для читання',
  },
  fieldFormat: {
    'en-us': 'Field Format',
    'ru-ru': 'Формат поля',
    'es-es': 'Formato de campo',
    'fr-fr': 'Format de champ',
    'uk-ua': 'Формат поля',
  },
  formatted: {
    'en-us': 'Formatted',
    'ru-ru': 'Форматирован',
    'es-es': 'formateado',
    'fr-fr': 'Formaté',
    'uk-ua': 'Відформатований',
  },
  webLink: {
    'en-us': 'Web Link',
    'ru-ru': 'Интернет-ссылка',
    'es-es': 'Enlace web',
    'fr-fr': 'Lien Web',
    'uk-ua': 'Веб посилання',
  },
  userDefined: {
    'en-us': 'User Defined',
    'ru-ru': 'Создано пользователем',
    'es-es': 'Usuario definido',
    'fr-fr': "Défini par l'utilisateur",
    'uk-ua': 'Визначений користувачем',
  },
  addLanguage: {
    'en-us': 'Add Language',
    'ru-ru': 'Добавить язык',
    'es-es': 'Agregar idioma',
    'fr-fr': 'Ajouter une langue',
    'uk-ua': 'Додати мову',
  },
  fieldLabel: {
    'en-us': 'Label',
    'ru-ru': 'Локализованный',
    'es-es': 'Etiqueta',
    'fr-fr': 'Étiquette',
    'uk-ua': 'Мітка',
  },
  databaseColumn: {
    'en-us': 'Database Column',
    'ru-ru': 'Столбец базы данных',
    'es-es': 'Columna de base de datos',
    'fr-fr': 'Colonne de base de données',
    'uk-ua': 'Стовпець бази даних',
  },
  relatedModel: {
    'en-us': 'Related Model',
    'ru-ru': 'Родственная Таблица',
    'es-es': 'Modelo relacionado',
    'fr-fr': 'Modèle associé',
    'uk-ua': "Пов'язана модель",
  },
  otherSideName: {
    'en-us': 'Other side name',
    'ru-ru': 'Имя другой стороны',
    'es-es': 'Otro nombre lateral',
    'fr-fr': "Nom de l'autre côté",
    'uk-ua': 'Інша сторона імені',
  },
  dependent: {
    'en-us': 'Dependent',
    'ru-ru': 'Зависимый',
    'es-es': 'Dependiente',
    'fr-fr': 'Dépendant',
    'uk-ua': 'Утриманець',
  },
  independent: {
    'en-us': 'Independent'
  },
  downloadAsJson: {
    'en-us': 'Download as JSON',
    'ru-ru': 'Скачать как JSON',
    'es-es': 'Descargar como JSON',
    'fr-fr': 'Télécharger au format JSON',
    'uk-ua': 'Завантажити як JSON',
  },
  downloadAsTsv: {
    'en-us': 'Download as TSV',
    'ru-ru': 'Скачать как TSV',
    'es-es': 'Descargar como TSV',
    'fr-fr': 'Télécharger au format TSV',
    'uk-ua': 'Завантажити як TSV',
  },
  tableId: {
    'en-us': 'Table ID',
    'ru-ru': 'Идентификатор',
    'es-es': 'Identificación de la tabla',
    'fr-fr': 'ID du tableau',
    'uk-ua': 'Ідентифікатор таблиці',
  },
  fieldCount: {
    'en-us': 'Field count',
    'ru-ru': 'Количество полей',
    'es-es': 'Recuento de campos',
    'fr-fr': 'Nombre de champs',
    'uk-ua': 'Підрахунок полів',
  },
  relationshipCount: {
    'en-us': 'Relationship count',
    'ru-ru': 'Количество отношений',
    'es-es': 'Recuento de relaciones',
    'fr-fr': 'Nombre de relations',
    'uk-ua': 'Кількість стосунків',
  },
  databaseSchema: {
    'en-us': 'Database Schema',
    'ru-ru': 'Database Schema',
    'es-es': 'Esquema de base de datos',
    'fr-fr': 'Schéma de base de données',
    'uk-ua': 'Схема бази даних',
  },
  selectedTables: {
    'en-us': 'Selected Tables',
    'ru-ru': 'Выбранные таблицы',
    'es-es': 'Mesas seleccionadas',
    'fr-fr': 'Tableaux sélectionnés',
    'uk-ua': 'Вибрані таблиці',
  },
  possibleTables: {
    'en-us': 'Possible Tables',
    'ru-ru': 'Возможные таблицы',
    'es-es': 'Tablas posibles',
    'fr-fr': 'Tableaux possibles',
    'uk-ua': 'Можливі таблиці',
  },
  goToTop: {
    'en-us': 'Go to top',
    'es-es': 'Ve arriba',
    'fr-fr': 'Aller en haut',
    'ru-ru': 'Перейти к началу',
    'uk-ua': 'Перейти вгору',
  },
  idField: {
    'en-us': 'ID Field',
  },
  scope:{
    'en-us': 'Scope'
  }
} as const);
