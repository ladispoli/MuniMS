import { set } from 'date-fns';
import type { AppConfig } from 'nuxt/schema';
import type { Impostazioni } from '~/types/strapi';

type Socials = Array<{
  name: string;
  icon: string;
  path: string;
}>;

interface FooterItem {
  name: string;
  path: string;
  description?: string;
  attrs?: Record<string, string>;
}
type Footer = { primary: Array<FooterItem>; secondary: Array<FooterItem> };

type Contacts = Array<{
  name: string;
  path: string;
  iconLeft?: string;
  attrs?: Record<string, string>;
}>;

type Problems = Contacts;

interface SettingsStore extends AppConfig, Impostazioni {
  socials?: Socials;
  footer: Footer;
  contacts: Contacts;
  problems: Problems;
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    settings: {} as SettingsStore,
  }),
  actions: {
    async fetch() {
      const appConfig = useAppConfig();

      const { data: settings } = await useStrapiFetch<Impostazioni>('impostazioni', {
        contentType: 'impostazioni',
        singleEntry: true,
        params: {
          populate: {
            navTopBar: true,
            footerPrimary: true,
            footerSecondaryExtra: true,
            logo: true,
            favicon: true,
          },
        },
      });

      if (settings) {
        this.settings = {
          ...appConfig,
          ...settings,
          socials: buildSocials(settings),
          footer: buildFooter(appConfig, settings),
          contacts: buildContacts(settings),
          problems: buildProblems(settings),
        };
      } else {
        this.settings = appConfig as SettingsStore;
      }
    },
  },
});

function buildSocials(settings: Impostazioni): Socials {
  const socials: Socials = [
    { name: 'Facebook', icon: 'it-facebook', path: settings.facebookUrl ?? '' },
    { name: 'Twitter', icon: 'it-twitter', path: settings.twitterUrl ?? '' },
    { name: 'YouTube', icon: 'it-youtube', path: settings.youtubeUrl ?? '' },
    { name: 'Telegram', icon: 'it-telegram', path: settings.telegramUrl ?? '' },
    { name: 'WhatsApp', icon: 'it-whatsapp', path: settings.whatsappUrl ?? '' },
    { name: 'Instagram', icon: 'it-instagram', path: settings.instagramUrl ?? '' },
    { name: 'RSS', icon: 'it-rss', path: settings.rssUrl ?? '' },
  ].filter((social) => social.path);

  return socials;
}

function buildFooter(appConfig: AppConfig, settings: Impostazioni): Footer {
  const footer: Footer = {
    primary: [
      {
        name: 'Domande frequenti (FAQ)',
        path: '/domande-frequenti',
        attrs: { 'data-element': 'faq' },
      },
      {
        name: 'Prenotazione appuntamento',
        path: settings.prenotaAppuntamentoLink ?? '/prenotazione-appuntamento',
        attrs: { 'data-element': 'appointment-booking' },
      },
      {
        name: 'Segnalazione disservizio',
        path: settings.segnalaDisservizioLink ?? '/segnalazione-disservizio',
        attrs: { 'data-element': 'report-inefficiency' },
      },
      {
        name: 'Richiesta di assistenza',
        path: settings.richiediAssistenzaLink ?? '/richiesta-assistenza',
        attrs: { 'data-element': 'contacts' },
      },
    ],
    secondary: [
      {
        name: 'Informativa privacy',
        path: '/privacy',
        attrs: { 'data-element': 'privacy-policy-link' },
      },
      {
        name: 'Note legali',
        path: '/note-legali',
        attrs: { 'data-element': 'legal-notes' },
      },
      {
        name: 'Mappa del sito',
        path: '/sitemap',
        attrs: { 'data-element': 'sitemap' },
      },
    ],
  };

  if (settings.dichiarazioneAccessibilitaLink) {
    footer.secondary.push({
      name: 'Dichiarazione di Accessibilità',
      path: settings.dichiarazioneAccessibilitaLink,
      attrs: { 'data-element': 'accessibility-link' },
    });
  }
  if (settings.obiettiviAccessibilitaLink) {
    footer.secondary.push({
      name: 'Obiettivi di Accessibilità',
      path: settings.obiettiviAccessibilitaLink,
      attrs: { 'data-element': 'accessibility-goals' },
    });
  }

  if (settings.footerPrimaryExtra) {
    const extra = settings.footerPrimaryExtra.map((item) => ({
      name: item.titolo,
      path: item.link,
      description: item.descrizione,
      attrs: item.attrs,
    }));
    footer.primary.push(...extra);
  }

  if (settings.footerSecondaryExtra) {
    const extra = settings.footerSecondaryExtra.map((item) => ({
      name: item.titolo,
      path: item.link,
      description: item.descrizione,
      attrs: item.attrs,
    }));
    footer.secondary.push(...extra);
  }

  return footer;
}

function buildContacts(settings: Impostazioni): Contacts {
  const contacts: Contacts = [
    {
      name: 'Leggi le domande frequenti',
      path: '/domande-frequenti',
      iconLeft: 'it-help-circle',
      attrs: { 'data-element': 'faq' },
    },
    {
      name: 'Richiedi assistenza',
      path: settings.richiediAssistenzaLink ?? '/richiesta-assistenza',
      iconLeft: 'it-mail',
      attrs: { 'data-element': 'contacts' },
    },
    {
      name: 'Prenota appuntamento',
      path: settings.prenotaAppuntamentoLink ?? '/prenotazione-appuntamento',
      iconLeft: 'it-calendar',
      attrs: { 'data-element': 'appointment-booking' },
    },
  ];

  if (settings.municipalityFreephone) {
    contacts.push({
      name: 'chiama il numero verde ' + settings.municipalityFreephone,
      path: 'tel:' + settings.municipalityFreephone,
      iconLeft: 'it-hearing',
    });
  }

  return contacts;
}

function buildProblems(settings: Impostazioni): Problems {
  return [
    {
      name: 'Segnala disservizio',
      path: settings.segnalaDisservizioLink ?? '/segnalazione-disservizio',
      iconLeft: 'it-map-marker-circle',
      attrs: { 'data-element': 'report-inefficiency' },
    },
  ];
}
