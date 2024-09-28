import type { Schema, Attribute } from '@strapi/strapi';

export interface TimelinePeriodo extends Schema.Component {
  collectionName: 'components_timeline_periodos';
  info: {
    displayName: 'periodo';
    icon: 'clock';
    description: '';
  };
  attributes: {
    valore: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    misura: Attribute.Enumeration<
      [
        'ora',
        'ore',
        'giorno',
        'giorni',
        'settimana',
        'settimane',
        'mese',
        'mesi',
        'anno',
        'anni'
      ]
    > &
      Attribute.Required;
    titolo: Attribute.String & Attribute.Required;
    descrizione: Attribute.Text;
  };
}

export interface TimelineDescrizione extends Schema.Component {
  collectionName: 'components_timeline_descriziones';
  info: {
    displayName: 'contenuto';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'rich';
        }
      >;
    date: Attribute.Component<'timeline.data', true>;
    periodi: Attribute.Component<'timeline.periodo', true>;
  };
}

export interface TimelineData extends Schema.Component {
  collectionName: 'components_timeline_data';
  info: {
    displayName: 'data';
    icon: 'calendar';
    description: '';
  };
  attributes: {
    data: Attribute.Date & Attribute.Required;
    orario: Attribute.Time;
    titolo: Attribute.String & Attribute.Required;
    descrizione: Attribute.Text;
  };
}

export interface SharedSeo extends Schema.Component {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
    description: '';
  };
  attributes: {
    metaTitle: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 50;
        maxLength: 160;
      }>;
    metaImage: Attribute.Media<'images' | 'files' | 'videos'>;
    metaSocial: Attribute.Component<'shared.meta-social', true>;
    keywords: Attribute.Text;
    metaRobots: Attribute.String;
    structuredData: Attribute.JSON;
    metaViewport: Attribute.String;
    canonicalURL: Attribute.String;
  };
}

export interface SharedMetaSocial extends Schema.Component {
  collectionName: 'components_shared_meta_socials';
  info: {
    displayName: 'metaSocial';
    icon: 'project-diagram';
    description: '';
  };
  attributes: {
    socialNetwork: Attribute.Enumeration<['Facebook', 'Twitter']> &
      Attribute.Required;
    titolo: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    descrizione: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    immagine: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface ListinoPrezziPrezzo extends Schema.Component {
  collectionName: 'components_listino_prezzi_prezzos';
  info: {
    displayName: 'prezzo';
    icon: 'pin';
  };
  attributes: {
    costo: Attribute.Decimal & Attribute.Required;
    titolo: Attribute.String & Attribute.Required;
    descrizione: Attribute.Text;
  };
}

export interface ListinoPrezziContenuto extends Schema.Component {
  collectionName: 'components_listino_prezzi_contenutos';
  info: {
    displayName: 'contenuto';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    contenuto: Attribute.RichText &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'rich';
        }
      >;
    prezzi: Attribute.Component<'listino-prezzi.prezzo', true>;
  };
}

export interface ImpostazioniLink extends Schema.Component {
  collectionName: 'components_impostazioni_links';
  info: {
    displayName: 'Link';
    icon: 'attachment';
    description: '';
  };
  attributes: {
    titolo: Attribute.String & Attribute.Required;
    link: Attribute.String & Attribute.Required;
    descrizione: Attribute.Text;
    attrs: Attribute.JSON;
    icona: Attribute.String;
  };
}

export interface HomepageSitiTematici extends Schema.Component {
  collectionName: 'components_homepage_siti_tematicis';
  info: {
    displayName: 'sito tematico';
    icon: 'link';
    description: '';
  };
  attributes: {
    titolo: Attribute.String & Attribute.Required;
    link: Attribute.String & Attribute.Required;
    descrizione: Attribute.Text & Attribute.Required;
    immagine: Attribute.Media<'images'>;
    coloreSfondo: Attribute.String &
      Attribute.CustomField<'plugin::color-picker.color'>;
    icona: Attribute.String;
  };
}

export interface HomepageLinkUtili extends Schema.Component {
  collectionName: 'components_homepage_link_utilis';
  info: {
    displayName: 'link';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    titolo: Attribute.String & Attribute.Required;
    link: Attribute.String & Attribute.Required;
  };
}

export interface FaqDomanda extends Schema.Component {
  collectionName: 'components_faq_domandas';
  info: {
    displayName: 'domanda';
    icon: 'question';
  };
  attributes: {
    titolo: Attribute.String & Attribute.Required;
    contenuto: Attribute.RichText &
      Attribute.Required &
      Attribute.CustomField<
        'plugin::ckeditor.CKEditor',
        {
          output: 'HTML';
          preset: 'standard';
        }
      >;
  };
}

export interface ContattiTelefono extends Schema.Component {
  collectionName: 'components_contatti_telefonos';
  info: {
    displayName: 'Telefono';
    icon: 'phone';
    description: '';
  };
  attributes: {
    numero: Attribute.String & Attribute.Required;
    prefisso: Attribute.String & Attribute.DefaultTo<'+39'>;
  };
}

export interface ContattiLink extends Schema.Component {
  collectionName: 'components_contatti_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    valore: Attribute.String & Attribute.Required;
    tipo: Attribute.Enumeration<
      ['URL', 'Whatsapp', 'Telegram', 'Skype', 'Linkedin', 'Twitter']
    > &
      Attribute.Required;
  };
}

export interface ContattiEmail extends Schema.Component {
  collectionName: 'components_contatti_emails';
  info: {
    displayName: 'Email';
    icon: 'mail-bulk';
    description: '';
  };
  attributes: {
    valore: Attribute.Email & Attribute.Required;
    isPec: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'timeline.periodo': TimelinePeriodo;
      'timeline.descrizione': TimelineDescrizione;
      'timeline.data': TimelineData;
      'shared.seo': SharedSeo;
      'shared.meta-social': SharedMetaSocial;
      'listino-prezzi.prezzo': ListinoPrezziPrezzo;
      'listino-prezzi.contenuto': ListinoPrezziContenuto;
      'impostazioni.link': ImpostazioniLink;
      'homepage.siti-tematici': HomepageSitiTematici;
      'homepage.link-utili': HomepageLinkUtili;
      'faq.domanda': FaqDomanda;
      'contatti.telefono': ContattiTelefono;
      'contatti.link': ContattiLink;
      'contatti.email': ContattiEmail;
    }
  }
}
