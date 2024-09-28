import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    placeholder: Attribute.Text;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    isEntryValid: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAppuntamentoAppuntamento extends Schema.CollectionType {
  collectionName: 'appuntamenti';
  info: {
    singularName: 'appuntamento';
    pluralName: 'appuntamenti';
    displayName: 'Appuntamento';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    dataPrenotazione: Attribute.DateTime & Attribute.Required;
    dataInizio: Attribute.DateTime & Attribute.Required;
    dataFine: Attribute.DateTime & Attribute.Required;
    servizio: Attribute.Relation<
      'api::appuntamento.appuntamento',
      'oneToOne',
      'api::servizio.servizio'
    >;
    unita_organizzativa: Attribute.Relation<
      'api::appuntamento.appuntamento',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::appuntamento.appuntamento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::appuntamento.appuntamento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiArgomentoArgomento extends Schema.CollectionType {
  collectionName: 'argomenti';
  info: {
    singularName: 'argomento';
    pluralName: 'argomenti';
    displayName: 'Argomento (tag)';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    nome: Attribute.String & Attribute.Required & Attribute.Unique;
    vocabolario: Attribute.String & Attribute.Unique;
    slug: Attribute.UID<'api::argomento.argomento', 'nome'> &
      Attribute.Required;
    note: Attribute.Text;
    immagine: Attribute.Media<'images'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::argomento.argomento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::argomento.argomento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAvvisoGeneraleAvvisoGenerale extends Schema.SingleType {
  collectionName: 'avvisi_generali';
  info: {
    singularName: 'avviso-generale';
    pluralName: 'avvisi-generali';
    displayName: 'Avviso generale';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
          maxLengthCharacters: 300;
        }
      >;
    attivo: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::avviso-generale.avviso-generale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::avviso-generale.avviso-generale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContattoContatto extends Schema.CollectionType {
  collectionName: 'contatti';
  info: {
    singularName: 'contatto';
    pluralName: 'contatti';
    displayName: 'Punto di Contatto';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    titolo: Attribute.String & Attribute.Required;
    valori: Attribute.DynamicZone<
      ['contatti.email', 'contatti.link', 'contatti.telefono']
    > &
      Attribute.Required;
    persona: Attribute.Relation<
      'api::contatto.contatto',
      'manyToOne',
      'api::persona.persona'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contatto.contatto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contatto.contatto',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDatasetDataset extends Schema.CollectionType {
  collectionName: 'datasets';
  info: {
    singularName: 'dataset';
    pluralName: 'datasets';
    displayName: 'Dataset';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    descrizione: Attribute.Text & Attribute.Required;
    tax_temi_dataset: Attribute.Relation<
      'api::dataset.dataset',
      'oneToMany',
      'api::tax-tema-dataset.tax-tema-dataset'
    >;
    distribuzione: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    tax_licenza: Attribute.Relation<
      'api::dataset.dataset',
      'oneToOne',
      'api::tax-licenza.tax-licenza'
    >;
    files: Attribute.Media<'files', true> & Attribute.Required;
    dataModifica: Attribute.DateTime & Attribute.Required;
    unita_organizzativa: Attribute.Relation<
      'api::dataset.dataset',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    freqAggiornamento: Attribute.Enumeration<
      [
        'altro',
        'annuale',
        'bidecennale',
        'biennale',
        'bimensile',
        'bimestrale',
        'bisettimanale',
        'continuo',
        'decennale',
        'due volte al giorno',
        'in continuo aggiornamento',
        ' irregolare',
        'mai',
        'mensile',
        'ogni cinque anni',
        'ogni due ore',
        'ogni ora',
        'ogni quattro anni',
        'ogni tre ore',
        'quindicinale',
        'quotidiano',
        'sconosciuto',
        'semestrale',
        'settimanale',
        'tre volte a settimana',
        'tre volte al mese',
        "tre volte all'anno",
        'tridecennale',
        'triennale',
        'trimestrale'
      ]
    > &
      Attribute.Required;
    slug: Attribute.UID<'api::dataset.dataset', 'titolo'> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::dataset.dataset',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::dataset.dataset',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDocumentiInEvidenzaDocumentiInEvidenza
  extends Schema.SingleType {
  collectionName: 'documenti_in_evidenza_collection';
  info: {
    singularName: 'documenti-in-evidenza';
    pluralName: 'documenti-in-evidenza-collection';
    displayName: 'Documenti in evidenza';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    documenti: Attribute.Component<'impostazioni.link', true>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::documenti-in-evidenza.documenti-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::documenti-in-evidenza.documenti-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDocumentoPrivatoDocumentoPrivato
  extends Schema.CollectionType {
  collectionName: 'documenti_privati';
  info: {
    singularName: 'documento-privato';
    pluralName: 'documenti-privati';
    displayName: 'Documento Privato';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    nomeIdentificativo: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique;
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    protocollo: Attribute.UID &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    data: Attribute.DateTime & Attribute.Required;
    immagine: Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    pratica: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToOne',
      'api::pratica.pratica'
    >;
    servizio: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToOne',
      'api::servizio.servizio'
    >;
    argomenti: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToMany',
      'api::argomento.argomento'
    >;
    descrizione: Attribute.Text & Attribute.Required;
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    files: Attribute.Media<'files', true> & Attribute.Required;
    galleria: Attribute.Media<'images' | 'videos', true>;
    unita_organizzativa: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    autore: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    tax_licenza: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToOne',
      'api::tax-licenza.tax-licenza'
    >;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    riferimenti: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    documenti_correlati: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    tax_eventi_persone: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToMany',
      'api::tax-evento-persona.tax-evento-persona'
    >;
    tax_eventi_imprese: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToMany',
      'api::tax-evento-impresa.tax-evento-impresa'
    >;
    slug: Attribute.UID<'api::documento-privato.documento-privato', 'titolo'> &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::documento-privato.documento-privato',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiDocumentoPubblicoDocumentoPubblico
  extends Schema.CollectionType {
  collectionName: 'documenti_pubblici';
  info: {
    singularName: 'documento-pubblico';
    pluralName: 'documenti-pubblici';
    displayName: 'Documento Pubblico';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    nomeIdentificativo: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique;
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    data: Attribute.Date;
    immagine: Attribute.Media<'images'>;
    tax_documento: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToOne',
      'api::tax-documento.tax-documento'
    >;
    tax_documento_albo_pretorio: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToOne',
      'api::tax-documento-albo-pretorio.tax-documento-albo-pretorio'
    >;
    argomenti: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToMany',
      'api::argomento.argomento'
    >;
    descrizione: Attribute.Text;
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    files: Attribute.Media<'files', true> & Attribute.Required;
    galleria: Attribute.Media<'images' | 'videos', true>;
    unita_organizzativa: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'manyToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    autore: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    tax_licenza: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToOne',
      'api::tax-licenza.tax-licenza'
    >;
    servizi: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToMany',
      'api::servizio.servizio'
    >;
    dataInizio: Attribute.Date;
    dataFine: Attribute.Date;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    riferimenti: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    tax_eventi_persone: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToMany',
      'api::tax-evento-persona.tax-evento-persona'
    >;
    tax_eventi_imprese: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToMany',
      'api::tax-evento-impresa.tax-evento-impresa'
    >;
    documenti_correlati: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    identificativo: Attribute.UID &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    protocollo: Attribute.UID &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    datasets: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToMany',
      'api::dataset.dataset'
    >;
    slug: Attribute.UID<
      'api::documento-pubblico.documento-pubblico',
      'titolo'
    > &
      Attribute.Required;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::documento-pubblico.documento-pubblico',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEventiInEvidenzaEventiInEvidenza extends Schema.SingleType {
  collectionName: 'eventi_in_evidenza_collection';
  info: {
    singularName: 'eventi-in-evidenza';
    pluralName: 'eventi-in-evidenza-collection';
    displayName: 'Eventi in evidenza';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    eventi: Attribute.Relation<
      'api::eventi-in-evidenza.eventi-in-evidenza',
      'oneToMany',
      'api::evento.evento'
    >;
    mostraSoloInHomepage: Attribute.Boolean;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::eventi-in-evidenza.eventi-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::eventi-in-evidenza.eventi-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEventoEvento extends Schema.CollectionType {
  collectionName: 'eventi';
  info: {
    singularName: 'evento';
    pluralName: 'eventi';
    displayName: 'Evento';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    tax_evento: Attribute.Relation<
      'api::evento.evento',
      'oneToOne',
      'api::tax-evento.tax-evento'
    >;
    sottotitolo: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    dataInizio: Attribute.Date & Attribute.Required;
    dataFine: Attribute.Date & Attribute.Required;
    timeline: Attribute.Component<'timeline.descrizione'>;
    descrizione: Attribute.Text & Attribute.Required;
    argomenti: Attribute.Relation<
      'api::evento.evento',
      'oneToMany',
      'api::argomento.argomento'
    >;
    immagine: Attribute.Media<'images'>;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    partecipanti: Attribute.Relation<
      'api::evento.evento',
      'oneToMany',
      'api::persona.persona'
    >;
    galleria: Attribute.Media<'images' | 'videos', true>;
    perChi: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    luoghi: Attribute.Relation<
      'api::evento.evento',
      'oneToMany',
      'api::luogo.luogo'
    >;
    costi: Attribute.Component<'listino-prezzi.contenuto'>;
    allegati: Attribute.Media<'files', true>;
    contatti: Attribute.Relation<
      'api::evento.evento',
      'oneToMany',
      'api::contatto.contatto'
    >;
    unita_organizzative: Attribute.Relation<
      'api::evento.evento',
      'oneToMany',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    patrocinio: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    sponsor: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    evento_padre: Attribute.Relation<
      'api::evento.evento',
      'manyToOne',
      'api::evento.evento'
    >;
    eventi_figli: Attribute.Relation<
      'api::evento.evento',
      'oneToMany',
      'api::evento.evento'
    >;
    slug: Attribute.UID<'api::evento.evento', 'titolo'> & Attribute.Required;
    seo: Attribute.Component<'shared.seo'>;
    showImagePreviewOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::evento.evento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::evento.evento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFaqFaq extends Schema.SingleType {
  collectionName: 'faqs';
  info: {
    singularName: 'faq';
    pluralName: 'faqs';
    displayName: 'Domande frequenti';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    domande: Attribute.Component<'faq.domanda', true> & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::faq.faq', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::faq.faq', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiHomepageHomepage extends Schema.SingleType {
  collectionName: 'homepages';
  info: {
    singularName: 'homepage';
    pluralName: 'homepages';
    displayName: 'Homepage';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    argomenti: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::argomento.argomento'
    >;
    immagineArgomenti: Attribute.Media<'images'>;
    argomentiNotizie: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<3>;
    argomentiServizi: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Attribute.DefaultTo<3>;
    altriArgomenti: Attribute.Relation<
      'api::homepage.homepage',
      'oneToMany',
      'api::argomento.argomento'
    >;
    sitiTematici: Attribute.Component<'homepage.siti-tematici', true>;
    linkUtili: Attribute.Component<'homepage.link-utili', true>;
    galleriaSfondo: Attribute.Media<'images', true>;
    linkAccessoRapido: Attribute.Component<'homepage.siti-tematici', true>;
    mostraAvvisiInScadenza: Attribute.Boolean & Attribute.DefaultTo<true>;
    mostraAmministrazione: Attribute.Boolean & Attribute.DefaultTo<true>;
    eventiInEvidenza: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 6;
        },
        number
      > &
      Attribute.DefaultTo<3>;
    mostraSoloPrimaNovitaInEvidenza: Attribute.Boolean;
    notizieInEvidenza: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 6;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::homepage.homepage',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiImpostazioniImpostazioni extends Schema.SingleType {
  collectionName: 'impostazioni_pages';
  info: {
    singularName: 'impostazioni';
    pluralName: 'impostazioni-pages';
    displayName: 'Impostazioni';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    municipalityName: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 30;
      }> &
      Attribute.DefaultTo<'Il mio Comune'>;
    municipalityTagline: Attribute.String &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    municipalityAddress: Attribute.String;
    municipalityFiscalCode: Attribute.String;
    municipalityVatNumber: Attribute.String;
    municipalityFreephone: Attribute.String;
    municipalitySwitchboard: Attribute.String;
    municipalityEmail: Attribute.Email;
    municipalityPec: Attribute.Email;
    municipalityUrpEmail: Attribute.Email;
    ownerName: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    ownerUrl: Attribute.String;
    cittadinoAttivoBaseUrl: Attribute.String;
    facebookUrl: Attribute.String;
    twitterUrl: Attribute.String;
    youtubeUrl: Attribute.String;
    telegramUrl: Attribute.String;
    whatsappUrl: Attribute.String;
    instagramUrl: Attribute.String;
    rssUrl: Attribute.String;
    navTopBar: Attribute.Component<'impostazioni.link', true>;
    footerPrimaryExtra: Attribute.Component<'impostazioni.link', true>;
    footerSecondaryExtra: Attribute.Component<'impostazioni.link', true>;
    prenotaAppuntamentoLink: Attribute.String &
      Attribute.DefaultTo<'/prenotazione-appuntamento'>;
    richiediAssistenzaLink: Attribute.String &
      Attribute.DefaultTo<'/richiesta-assistenza'>;
    segnalaDisservizioLink: Attribute.String &
      Attribute.DefaultTo<'/segnalazione-disservizio'>;
    logo: Attribute.Media<'images'>;
    favicon: Attribute.Media<'images'>;
    dichiarazioneAccessibilitaLink: Attribute.String;
    obiettiviAccessibilitaLink: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::impostazioni.impostazioni',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::impostazioni.impostazioni',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiIncaricoIncarico extends Schema.CollectionType {
  collectionName: 'incarichi';
  info: {
    singularName: 'incarico';
    pluralName: 'incarichi';
    displayName: 'Incarico';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    compensi: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    importi: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    dataInizio: Attribute.Date & Attribute.Required;
    dataFine: Attribute.Date;
    dataInsediamento: Attribute.Date;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    tax_incarico: Attribute.Relation<
      'api::incarico.incarico',
      'oneToOne',
      'api::tax-incarico.tax-incarico'
    >;
    persona: Attribute.Relation<
      'api::incarico.incarico',
      'manyToOne',
      'api::persona.persona'
    >;
    unita_organizzativa: Attribute.Relation<
      'api::incarico.incarico',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    atto_nomina: Attribute.Relation<
      'api::incarico.incarico',
      'oneToOne',
      'api::documento-pubblico.documento-pubblico'
    >;
    slug: Attribute.UID<'api::incarico.incarico', 'titolo'> &
      Attribute.Required;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::incarico.incarico',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::incarico.incarico',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLuoghiInEvidenzaLuoghiInEvidenza extends Schema.SingleType {
  collectionName: 'luoghi_in_evidenza_collection';
  info: {
    singularName: 'luoghi-in-evidenza';
    pluralName: 'luoghi-in-evidenza-collection';
    displayName: 'Luoghi in evidenza';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    luoghi: Attribute.Relation<
      'api::luoghi-in-evidenza.luoghi-in-evidenza',
      'oneToMany',
      'api::luogo.luogo'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::luoghi-in-evidenza.luoghi-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::luoghi-in-evidenza.luoghi-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLuogoLuogo extends Schema.CollectionType {
  collectionName: 'luoghi';
  info: {
    singularName: 'luogo';
    pluralName: 'luoghi';
    displayName: 'Luogo';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    nome: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    nome2: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    slug: Attribute.UID<'api::luogo.luogo', 'nome'> & Attribute.Required;
    argomenti: Attribute.Relation<
      'api::luogo.luogo',
      'oneToMany',
      'api::argomento.argomento'
    >;
    tax_luogo: Attribute.Relation<
      'api::luogo.luogo',
      'oneToOne',
      'api::tax-luogo.tax-luogo'
    >;
    immagine: Attribute.Media<'images'>;
    descrizione: Attribute.Text & Attribute.Required;
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    galleria: Attribute.Media<'images' | 'videos', true>;
    servizi: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    accesso: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    indirizzo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    quartiere: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    circoscrizione: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    cap: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    contatti: Attribute.Relation<
      'api::luogo.luogo',
      'oneToMany',
      'api::contatto.contatto'
    >;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    unita_organizzativa: Attribute.Relation<
      'api::luogo.luogo',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    identificativo: Attribute.UID &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    orari: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    costi: Attribute.Component<'listino-prezzi.contenuto'>;
    luoghi_correlati: Attribute.Relation<
      'api::luogo.luogo',
      'oneToMany',
      'api::luogo.luogo'
    >;
    indirizzo2: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    seo: Attribute.Component<'shared.seo'>;
    showImagePreviewOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::luogo.luogo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::luogo.luogo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMessaggioMessaggio extends Schema.CollectionType {
  collectionName: 'messaggi';
  info: {
    singularName: 'messaggio';
    pluralName: 'messaggi';
    displayName: 'Messaggio';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    data: Attribute.DateTime & Attribute.Required;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    pratica: Attribute.Relation<
      'api::messaggio.messaggio',
      'oneToOne',
      'api::pratica.pratica'
    >;
    servizio: Attribute.Relation<
      'api::messaggio.messaggio',
      'oneToOne',
      'api::servizio.servizio'
    >;
    dataScadenza: Attribute.DateTime;
    documenti: Attribute.Relation<
      'api::messaggio.messaggio',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    documenti_privati: Attribute.Relation<
      'api::messaggio.messaggio',
      'oneToMany',
      'api::documento-privato.documento-privato'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::messaggio.messaggio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::messaggio.messaggio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNoteLegaliNoteLegali extends Schema.SingleType {
  collectionName: 'note_legali_pages';
  info: {
    singularName: 'note-legali';
    pluralName: 'note-legali-pages';
    displayName: 'Note legali';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::note-legali.note-legali',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::note-legali.note-legali',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotiziaNotizia extends Schema.CollectionType {
  collectionName: 'notizie';
  info: {
    singularName: 'notizia';
    pluralName: 'notizie';
    displayName: 'Notizia';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    descrizione: Attribute.Text & Attribute.Required;
    data: Attribute.Date & Attribute.Required;
    dataScadenza: Attribute.Date;
    numeroComunicato: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    immagine: Attribute.Media<'images'>;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    galleria: Attribute.Media<'images' | 'videos', true>;
    tax_notizia: Attribute.Relation<
      'api::notizia.notizia',
      'oneToOne',
      'api::tax-notizia.tax-notizia'
    >;
    argomenti: Attribute.Relation<
      'api::notizia.notizia',
      'oneToMany',
      'api::argomento.argomento'
    >;
    persone: Attribute.Relation<
      'api::notizia.notizia',
      'oneToMany',
      'api::persona.persona'
    >;
    luoghi: Attribute.Relation<
      'api::notizia.notizia',
      'oneToMany',
      'api::luogo.luogo'
    >;
    unita_organizzativa: Attribute.Relation<
      'api::notizia.notizia',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    allegati: Attribute.Relation<
      'api::notizia.notizia',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    datasets: Attribute.Relation<
      'api::notizia.notizia',
      'oneToMany',
      'api::dataset.dataset'
    >;
    slug: Attribute.UID<'api::notizia.notizia', 'titolo'> & Attribute.Required;
    seo: Attribute.Component<'shared.seo'>;
    showImagePreviewOnly: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notizia.notizia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notizia.notizia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNotizieInEvidenzaNotizieInEvidenza
  extends Schema.SingleType {
  collectionName: 'notizie_in_evidenza_collection';
  info: {
    singularName: 'notizie-in-evidenza';
    pluralName: 'notizie-in-evidenza-collection';
    displayName: 'Notizie in evidenza';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    notizie: Attribute.Relation<
      'api::notizie-in-evidenza.notizie-in-evidenza',
      'oneToMany',
      'api::notizia.notizia'
    >;
    mostraSoloInHomepage: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::notizie-in-evidenza.notizie-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::notizie-in-evidenza.notizie-in-evidenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPagamentoPagamento extends Schema.CollectionType {
  collectionName: 'pagamenti';
  info: {
    singularName: 'pagamento';
    pluralName: 'pagamenti';
    displayName: 'Pagamento';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    pratica: Attribute.Relation<
      'api::pagamento.pagamento',
      'oneToOne',
      'api::pratica.pratica'
    >;
    ricevuta: Attribute.Media<'files'> & Attribute.Required;
    data: Attribute.DateTime & Attribute.Required;
    importo: Attribute.Decimal & Attribute.Required;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    modPagamento: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    servizi: Attribute.Relation<
      'api::pagamento.pagamento',
      'oneToMany',
      'api::servizio.servizio'
    >;
    esito: Attribute.Text & Attribute.Required;
    documenti_privati: Attribute.Relation<
      'api::pagamento.pagamento',
      'oneToMany',
      'api::documento-privato.documento-privato'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pagamento.pagamento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pagamento.pagamento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPersonaPersona extends Schema.CollectionType {
  collectionName: 'persone';
  info: {
    singularName: 'persona';
    pluralName: 'persone';
    displayName: 'Persona Pubblica';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    nome: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    cognome: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    immagine: Attribute.Media<'images'>;
    competenze: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    deleghe: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    biografia: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    galleria: Attribute.Media<'images' | 'videos', true>;
    cv: Attribute.Media<'files'>;
    situazionePatrimoniale: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    dichiarazioneRedditi: Attribute.Media<'files', true>;
    speseElettorali: Attribute.Media<'files', true>;
    variazioniSituazionePatrimoniale: Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    altreCariche: Attribute.Media<'files', true>;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    contatti: Attribute.Relation<
      'api::persona.persona',
      'oneToMany',
      'api::contatto.contatto'
    >;
    incarichi: Attribute.Relation<
      'api::persona.persona',
      'oneToMany',
      'api::incarico.incarico'
    >;
    responsabile_unita_organizzative: Attribute.Relation<
      'api::persona.persona',
      'oneToMany',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    assessore_unita_organizzative: Attribute.Relation<
      'api::persona.persona',
      'oneToMany',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    componente_unita_organizzative: Attribute.Relation<
      'api::persona.persona',
      'manyToMany',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    nomeCompleto: Attribute.String & Attribute.Private;
    slug: Attribute.UID<'api::persona.persona', 'nomeCompleto'> &
      Attribute.Required;
    seo: Attribute.Component<'shared.seo'>;
    funzione: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::persona.persona',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::persona.persona',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPraticaPratica extends Schema.CollectionType {
  collectionName: 'pratiche';
  info: {
    singularName: 'pratica';
    pluralName: 'pratiche';
    displayName: 'Pratica';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    protocollo: Attribute.UID &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    unita_organizzative: Attribute.Relation<
      'api::pratica.pratica',
      'oneToMany',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    servizio: Attribute.Relation<
      'api::pratica.pratica',
      'oneToOne',
      'api::servizio.servizio'
    >;
    tax_stato_pratica: Attribute.Relation<
      'api::pratica.pratica',
      'oneToOne',
      'api::tax-stato-pratica.tax-stato-pratica'
    >;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
        }
      >;
    documenti: Attribute.Relation<
      'api::pratica.pratica',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    argomenti: Attribute.Relation<
      'api::pratica.pratica',
      'oneToMany',
      'api::argomento.argomento'
    >;
    documenti_privati: Attribute.Relation<
      'api::pratica.pratica',
      'oneToMany',
      'api::documento-privato.documento-privato'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::pratica.pratica',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::pratica.pratica',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPrivacyPrivacy extends Schema.SingleType {
  collectionName: 'privacies';
  info: {
    singularName: 'privacy';
    pluralName: 'privacies';
    displayName: 'Privacy';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::privacy.privacy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::privacy.privacy',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiServizioServizio extends Schema.CollectionType {
  collectionName: 'servizi';
  info: {
    singularName: 'servizio';
    pluralName: 'servizi';
    displayName: 'Servizio';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    tax_servizio: Attribute.Relation<
      'api::servizio.servizio',
      'oneToOne',
      'api::tax-servizio.tax-servizio'
    >;
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    attivo: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    stato: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    sottotitolo: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    immagine: Attribute.Media<'images'>;
    descrizione: Attribute.Text & Attribute.Required;
    perChi: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    zona: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    comeUsufruire: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    cosaServe: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    siOttiene: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    procedureEsito: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    accessoDigitale: Attribute.String;
    prenotaAppuntamento: Attribute.String;
    vincoli: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    casiParticolari: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'rich';
        }
      >;
    fileCondizioni: Attribute.Media<'files', true>;
    contatti: Attribute.Relation<
      'api::servizio.servizio',
      'oneToMany',
      'api::contatto.contatto'
    >;
    unita_organizzativa_responsabile: Attribute.Relation<
      'api::servizio.servizio',
      'manyToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    documenti: Attribute.Relation<
      'api::servizio.servizio',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    argomenti: Attribute.Relation<
      'api::servizio.servizio',
      'oneToMany',
      'api::argomento.argomento'
    >;
    tax_eventi_persone: Attribute.Relation<
      'api::servizio.servizio',
      'oneToMany',
      'api::tax-evento-persona.tax-evento-persona'
    >;
    tax_eventi_imprese: Attribute.Relation<
      'api::servizio.servizio',
      'oneToMany',
      'api::tax-evento-impresa.tax-evento-impresa'
    >;
    codiceIpa: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    classificazione: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    slug: Attribute.UID<'api::servizio.servizio', 'titolo'> &
      Attribute.Required;
    accessoFisico: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
    timeline: Attribute.Component<'timeline.descrizione'>;
    costi: Attribute.Component<'listino-prezzi.contenuto'>;
    seo: Attribute.Component<'shared.seo'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::servizio.servizio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::servizio.servizio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxDocumentoTaxDocumento extends Schema.CollectionType {
  collectionName: 'tax_documenti';
  info: {
    singularName: 'tax-documento';
    pluralName: 'tax-documenti';
    displayName: 'Tassonomia - Documento';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-documento.tax-documento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-documento.tax-documento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxDocumentoAlboPretorioTaxDocumentoAlboPretorio
  extends Schema.CollectionType {
  collectionName: 'tax_documenti_albo_pretorio';
  info: {
    singularName: 'tax-documento-albo-pretorio';
    pluralName: 'tax-documenti-albo-pretorio';
    displayName: 'Tassonomia - Documento albo Pretorio';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-documento-albo-pretorio.tax-documento-albo-pretorio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-documento-albo-pretorio.tax-documento-albo-pretorio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxEventoTaxEvento extends Schema.CollectionType {
  collectionName: 'tax_eventi';
  info: {
    singularName: 'tax-evento';
    pluralName: 'tax-eventi';
    displayName: 'Tassonomia - Evento';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-evento.tax-evento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-evento.tax-evento',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxEventoImpresaTaxEventoImpresa
  extends Schema.CollectionType {
  collectionName: 'tax_eventi_imprese';
  info: {
    singularName: 'tax-evento-impresa';
    pluralName: 'tax-eventi-imprese';
    displayName: "Tassonomia - Eventi della vita di un'Impresa";
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-evento-impresa.tax-evento-impresa',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-evento-impresa.tax-evento-impresa',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxEventoPersonaTaxEventoPersona
  extends Schema.CollectionType {
  collectionName: 'tax_eventi_persone';
  info: {
    singularName: 'tax-evento-persona';
    pluralName: 'tax-eventi-persone';
    displayName: 'Tassonomia - Eventi della vita delle Persone';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-evento-persona.tax-evento-persona',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-evento-persona.tax-evento-persona',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxIncaricoTaxIncarico extends Schema.CollectionType {
  collectionName: 'tax_incarichi';
  info: {
    singularName: 'tax-incarico';
    pluralName: 'tax-incarichi';
    displayName: 'Tassonomia - Incarico';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-incarico.tax-incarico',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-incarico.tax-incarico',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxLicenzaTaxLicenza extends Schema.CollectionType {
  collectionName: 'tax_licenze';
  info: {
    singularName: 'tax-licenza';
    pluralName: 'tax-licenze';
    displayName: 'Tassonomia - Licenza';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-licenza.tax-licenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-licenza.tax-licenza',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxLuogoTaxLuogo extends Schema.CollectionType {
  collectionName: 'tax_luoghi';
  info: {
    singularName: 'tax-luogo';
    pluralName: 'tax-luoghi';
    displayName: 'Tassonomia - Luogo';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-luogo.tax-luogo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-luogo.tax-luogo',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxNotiziaTaxNotizia extends Schema.CollectionType {
  collectionName: 'tax_notizie';
  info: {
    singularName: 'tax-notizia';
    pluralName: 'tax-notizie';
    displayName: 'Tassonomia - Notizia';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-notizia.tax-notizia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-notizia.tax-notizia',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxServizioTaxServizio extends Schema.CollectionType {
  collectionName: 'tax_servizi';
  info: {
    singularName: 'tax-servizio';
    pluralName: 'tax-servizi';
    displayName: 'Tassonomia - Servizio';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-servizio.tax-servizio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-servizio.tax-servizio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxStatoPraticaTaxStatoPratica
  extends Schema.CollectionType {
  collectionName: 'tax_stati_pratiche';
  info: {
    singularName: 'tax-stato-pratica';
    pluralName: 'tax-stati-pratiche';
    displayName: 'Tassonomia - Stato Pratica';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-stato-pratica.tax-stato-pratica',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-stato-pratica.tax-stato-pratica',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxTemaDatasetTaxTemaDataset extends Schema.CollectionType {
  collectionName: 'tax_temi_dataset';
  info: {
    singularName: 'tax-tema-dataset';
    pluralName: 'tax-temi-dataset';
    displayName: 'Tassonomia - Tema Dataset';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-tema-dataset.tax-tema-dataset',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-tema-dataset.tax-tema-dataset',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTaxUnitaOrganizzativaTaxUnitaOrganizzativa
  extends Schema.CollectionType {
  collectionName: 'tax_unita_organizzative';
  info: {
    singularName: 'tax-unita-organizzativa';
    pluralName: 'tax-unita-organizzative';
    displayName: 'Tassonomia - Unit\u00E0 Organizzativa';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'import-export-entries': {
      idField: 'slug';
    };
  };
  attributes: {
    tassonomia: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.String;
    nome: Attribute.String;
    slugNome: Attribute.String;
    livello: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    vocabolario: Attribute.String;
    note: Attribute.Text;
    disabilitato: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::tax-unita-organizzativa.tax-unita-organizzativa',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::tax-unita-organizzativa.tax-unita-organizzativa',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiUnitaOrganizzativaUnitaOrganizzativa
  extends Schema.CollectionType {
  collectionName: 'unita_organizzative';
  info: {
    singularName: 'unita-organizzativa';
    pluralName: 'unita-organizzative';
    displayName: 'Unit\u00E0 Organizzativa';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    descrizione: Attribute.Text & Attribute.Required;
    immagine: Attribute.Media<'images'>;
    logo: Attribute.Media<'images'>;
    competenze: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
          output: 'HTML';
        }
      >;
    info: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          preset: 'standard';
          output: 'HTML';
        }
      >;
    tax_unita_organizzativa: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToOne',
      'api::tax-unita-organizzativa.tax-unita-organizzativa'
    >;
    argomenti: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToMany',
      'api::argomento.argomento'
    >;
    persone_componenti: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'manyToMany',
      'api::persona.persona'
    >;
    contatti: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToMany',
      'api::contatto.contatto'
    >;
    unita_organizzativa_padre: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToOne',
      'api::unita-organizzativa.unita-organizzativa'
    >;
    sede_principale: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToOne',
      'api::luogo.luogo'
    >;
    sedi_secondarie: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToMany',
      'api::luogo.luogo'
    >;
    documenti_pubblici: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToMany',
      'api::documento-pubblico.documento-pubblico'
    >;
    slug: Attribute.UID<
      'api::unita-organizzativa.unita-organizzativa',
      'titolo'
    > &
      Attribute.Required;
    seo: Attribute.Component<'shared.seo'>;
    servizi: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToMany',
      'api::servizio.servizio'
    >;
    persona_responsabile: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'manyToOne',
      'api::persona.persona'
    >;
    persona_assessore: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'manyToOne',
      'api::persona.persona'
    >;
    orari: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
    order: Attribute.Integer &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::unita-organizzativa.unita-organizzativa',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiValutazioneValutazione extends Schema.CollectionType {
  collectionName: 'valutazioni';
  info: {
    singularName: 'valutazione';
    pluralName: 'valutazioni';
    displayName: 'Valutazione Pagina';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    url: Attribute.String & Attribute.Required;
    rating: Attribute.Integer;
    risposta: Attribute.String;
    descrizione: Attribute.Text;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::valutazione.valutazione',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::valutazione.valutazione',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::appuntamento.appuntamento': ApiAppuntamentoAppuntamento;
      'api::argomento.argomento': ApiArgomentoArgomento;
      'api::avviso-generale.avviso-generale': ApiAvvisoGeneraleAvvisoGenerale;
      'api::contatto.contatto': ApiContattoContatto;
      'api::dataset.dataset': ApiDatasetDataset;
      'api::documenti-in-evidenza.documenti-in-evidenza': ApiDocumentiInEvidenzaDocumentiInEvidenza;
      'api::documento-privato.documento-privato': ApiDocumentoPrivatoDocumentoPrivato;
      'api::documento-pubblico.documento-pubblico': ApiDocumentoPubblicoDocumentoPubblico;
      'api::eventi-in-evidenza.eventi-in-evidenza': ApiEventiInEvidenzaEventiInEvidenza;
      'api::evento.evento': ApiEventoEvento;
      'api::faq.faq': ApiFaqFaq;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::impostazioni.impostazioni': ApiImpostazioniImpostazioni;
      'api::incarico.incarico': ApiIncaricoIncarico;
      'api::luoghi-in-evidenza.luoghi-in-evidenza': ApiLuoghiInEvidenzaLuoghiInEvidenza;
      'api::luogo.luogo': ApiLuogoLuogo;
      'api::messaggio.messaggio': ApiMessaggioMessaggio;
      'api::note-legali.note-legali': ApiNoteLegaliNoteLegali;
      'api::notizia.notizia': ApiNotiziaNotizia;
      'api::notizie-in-evidenza.notizie-in-evidenza': ApiNotizieInEvidenzaNotizieInEvidenza;
      'api::pagamento.pagamento': ApiPagamentoPagamento;
      'api::persona.persona': ApiPersonaPersona;
      'api::pratica.pratica': ApiPraticaPratica;
      'api::privacy.privacy': ApiPrivacyPrivacy;
      'api::servizio.servizio': ApiServizioServizio;
      'api::tax-documento.tax-documento': ApiTaxDocumentoTaxDocumento;
      'api::tax-documento-albo-pretorio.tax-documento-albo-pretorio': ApiTaxDocumentoAlboPretorioTaxDocumentoAlboPretorio;
      'api::tax-evento.tax-evento': ApiTaxEventoTaxEvento;
      'api::tax-evento-impresa.tax-evento-impresa': ApiTaxEventoImpresaTaxEventoImpresa;
      'api::tax-evento-persona.tax-evento-persona': ApiTaxEventoPersonaTaxEventoPersona;
      'api::tax-incarico.tax-incarico': ApiTaxIncaricoTaxIncarico;
      'api::tax-licenza.tax-licenza': ApiTaxLicenzaTaxLicenza;
      'api::tax-luogo.tax-luogo': ApiTaxLuogoTaxLuogo;
      'api::tax-notizia.tax-notizia': ApiTaxNotiziaTaxNotizia;
      'api::tax-servizio.tax-servizio': ApiTaxServizioTaxServizio;
      'api::tax-stato-pratica.tax-stato-pratica': ApiTaxStatoPraticaTaxStatoPratica;
      'api::tax-tema-dataset.tax-tema-dataset': ApiTaxTemaDatasetTaxTemaDataset;
      'api::tax-unita-organizzativa.tax-unita-organizzativa': ApiTaxUnitaOrganizzativaTaxUnitaOrganizzativa;
      'api::unita-organizzativa.unita-organizzativa': ApiUnitaOrganizzativaUnitaOrganizzativa;
      'api::valutazione.valutazione': ApiValutazioneValutazione;
    }
  }
}
