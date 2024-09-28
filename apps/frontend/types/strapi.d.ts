// general types

export interface ContentType {
  id: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  meta?: Record<string, unknown>;
}

export interface Error {
  code: string;
  message?: string;
}

export type MediaFormats = 'thumbnail' | 'medium' | 'large' | 'small';

export interface Media extends ContentType {
  name: string;
  mime: string;
  url: string;
  alternativeText?: string;
  caption: string;
  width: number;
  height: number;
  hash: string;
  ext: string;
  size: number;
  formats?: Record<
    MediaFormats,
    {
      name: string;
      hash: string;
      ext: string;
      mime: string;
      path: null;
      width: number;
      height: number;
      size: number;
      url: string;
    }
  >;
  previewUrl?: string;
  provider?: string;
  provider_metadata?: JSON;
  placeholder?: string;
}

// components

export interface Component {
  id: string;
  __component?: string;
}

export interface ContattoEmail extends Component {
  __component: 'contatti.email';
  valore: string;
  isPec?: boolean;
}

export interface ContattoTelefono extends Component {
  __component: 'contatti.telefono';
  prefisso: string;
  numero: string;
}

export interface ContattoLink extends Component {
  __component: 'contatti.link';
  valore: string;
  tipo: 'URL' | 'Whatsapp' | 'Telegram' | 'Skype' | 'Linkedin' | 'Twitter';
}

export interface TimelineData extends Component {
  data: string;
  orario?: string;
  titolo: string;
  descrizione?: string;
}

export interface TimelinePeriodo extends Component {
  valore: number;
  misura: string;
  titolo: string;
  descrizione?: string;
}

export interface Timeline extends Component {
  contenuto?: string;
  date?: Array<TimelineData>;
  periodi?: Array<TimelinePeriodo>;
}

export interface Prezzo extends Component {
  costo: number;
  titolo: string;
  descrizione?: string;
}

export interface ListinoPrezzi extends Component {
  contenuto?: string;
  prezzi?: Array<Prezzo>;
}

export interface FaqItem extends Component {
  titolo: string;
  contenuto: string;
}

export interface HomepageLink extends Component {
  link: string;
  titolo: string;
}

export interface HomepageSitiTematiciItem extends Component {
  titolo: string;
  link: string;
  descrizione: string;
  immagine?: Media;
  icona?: string;
  coloreSfondo?: string;
}

export interface ImpostazioniLink extends Component {
  link: string;
  titolo: string;
  descrizione?: string;
  icona?: string;
  attrs?: Record<string, string>;
}

export interface SharedMetaSocial extends Component {
  socialNetwork: string;
  titolo: string;
  descrizione: string;
}

export interface SharedSeo extends Component {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaRobots?: string;
  structuredData?: JSON;
  metaViewport?: string;
  canonicalURL?: string;
  metaImage?: Media;
  metaSocial?: Array<SharedMetaSocial>;
}

// specific content types

export interface Taxonomy extends ContentType {
  tassonomia: string;
  slug: string;
  nome: string;
  slugNome: string;
  livello: number;
  vocabolario?: string;
  note?: string;
  disabilitato?: boolean;
}

export interface TaxArgomento extends ContentType {
  nome: string;
  slug: string;
  vocabolario?: string;
  note?: string;
  immagine?: Media;
}

export interface Appuntamento extends ContentType {
  titolo: string;
  contenuto: string;
  dataPrenotazione: null;
  dataInizio: null;
  dataFine: null;
  servizio?: Array<Servizio>;
  unita_organizzativa?: UnitaOrganizzativa;
}

export interface Dataset extends ContentType {
  titolo: string;
  slug: string;
  descrizione: string;
  distribuzione: string;
  files: Array<Media>;
  dataModifica: string;
  freqAggiornamento: string;
  tax_temi_dataset?: Array<Taxonomy>;
  tax_licenza?: Taxonomy;
  unita_organizzativa?: UnitaOrganizzativa;
}

export interface DocumentoPrivato extends ContentType {}

export interface DocumentoPubblico extends ContentType {
  titolo: string;
  slug: string;
  descrizione?: string;
  data?: string;
  immagine?: Media;
  tax_documento: Taxonomy;
  tax_documento_albo_pretorio: Taxonomy;
  argomenti?: Array<TaxArgomento>;
  contenuto?: string;
  files: Array<Media>;
  galleria?: Array<Media>;
  unita_organizzativa?: UnitaOrganizzativa;
  autore?: string;
  tax_licenza?: Taxonomy;
  servizi?: Array<Servizio>;
  dataInizio?: string;
  dataFine?: string;
  info?: string;
  riferimenti?: string;
  tax_eventi_persone?: Array<Taxonomy>;
  tax_eventi_imprese?: Array<Taxonomy>;
  documenti_correlati?: Array<DocumentoPubblico>;
  identificativo?: string;
  protocollo?: string;
  datasets?: Array<Dataset>;
  seo?: SharedSeo;
}

export interface Evento extends ContentType {
  titolo: string;
  slug: string;
  sottotitolo?: string;
  descrizione: string;
  tax_evento: Taxonomy;
  argomenti?: Array<TaxArgomento>;
  immagine?: Media;
  showImagePreviewOnly?: Boolean;
  dataInizio: string;
  dataFine: string;
  contenuto: string;
  perChi: string;
  timeline?: Timeline;
  costi?: ListinoPrezzi;
  patrocinio?: string;
  sponsor?: string;
  info?: string;
  galleria?: Array<Media>;
  partecipanti: Array<Persona>;
  luoghi?: Array<Luogo>;
  allegati?: Array<Media>;
  contatti?: Array<Contatto>;
  unita_organizzative?: Array<UnitaOrganizzativa>;
  evento_padre?: Evento;
  eventi_figli?: Array<Evento>;
  seo?: SharedSeo;
}

export interface Luogo extends ContentType {
  nome: string;
  nome2?: string;
  slug: string;
  argomenti?: Array<TaxArgomento>;
  tax_luogo: Taxonomy;
  immagine?: Media;
  showImagePreviewOnly?: Boolean;
  descrizione: string;
  contenuto?: string;
  galleria?: Array<Media>;
  servizi?: string;
  accesso: string;
  indirizzo: string;
  indirizzo2?: string;
  quartiere?: string;
  circoscrizione?: string;
  cap: string;
  contatti?: Array<Contatto>;
  info?: string;
  unita_organizzativa?: UnitaOrganizzativa;
  identificativo?: string;
  orari?: string;
  costi?: ListinoPrezzi;
  luoghi_correlati?: Array<Luogo>;
  seo?: SharedSeo;
}

export interface LuoghiInEvidenza extends ContentType {
  luoghi: Array<Luogo>;
}

export interface Incarico extends ContentType {
  titolo: string;
  slug: string;
  dataInizio: string;
  dataFine?: string;
  dataInsediamento?: string;
  tax_incarico: Taxonomy;
  persona: Persona;
  compensi?: string;
  importi?: string;
  info?: string;
  unita_organizzativa?: UnitaOrganizzativa;
  atto_nomina?: DocumentoPubblico;
  seo?: SharedSeo;
}

export interface Messaggio extends ContentType {}

export interface Notizia extends ContentType {
  titolo: string;
  slug: string;
  descrizione: string;
  data: string;
  dataScadenza?: string;
  tax_notizia: Taxonomy;
  numeroComunicato?: number;
  contenuto: string;
  immagine?: Media;
  showImagePreviewOnly?: Boolean;
  galleria?: Array<Media>;
  argomenti?: Array<TaxArgomento>;
  persone?: Array<Persona>;
  luoghi?: Array<Luogo>;
  unita_organizzativa?: UnitaOrganizzativa;
  allegati?: Array<DocumentoPubblico>;
  datasets?: Array<Dataset>;
  seo?: SharedSeo;
}

export interface NotizieInEvidenza extends ContentType {
  notizie: Array<Notizia>;
  mostraSoloInHomepage?: Boolean;
}

export interface EventiInEvidenza extends ContentType {
  eventi: Array<Evento>;
  mostraSoloInHomepage?: Boolean;
}

export interface Persona extends ContentType {
  nome: string;
  cognome: string;
  slug: string;
  immagine?: Media;
  galleria?: Array<Media>;
  contatti?: Array<Contatto>;
  funzione?: string;
  incarichi?: Array<Incarico>;
  responsabile_unita_organizzative?: Array<UnitaOrganizzativa>;
  assessore_unita_organizzative?: Array<UnitaOrganizzativa>;
  componente_unita_organizzative?: Array<UnitaOrganizzativa>;
  competenze?: string;
  deleghe?: string;
  biografia?: string;
  situazionePatrimoniale?: string;
  info?: string;
  cv?: Media;
  dichiarazioneRedditi?: Array<Media>;
  speseElettorali?: Array<Media>;
  variazioniSituazionePatrimoniale?: Array<Media>;
  altreCariche?: Array<Media>;
  seo?: SharedSeo;
}

export interface Pratica extends ContentType {}

export interface Contatto extends ContentType {
  titolo: string;
  valori: Array<ContattoEmail | ContattoTelefono | ContattoLink>;
  persona?: Persona;
}

export interface Servizio extends ContentType {
  titolo: string;
  slug: string;
  sottotitolo?: string;
  descrizione: string;
  attivo: boolean;
  stato?: string;
  perChi?: string;
  contenuto?: string;
  zona?: string;
  comeUsufruire?: string;
  cosaServe?: string;
  siOttiene?: string;
  timeline?: Timeline;
  costi?: ListinoPrezzi;
  procedureEsito?: string;
  vincoli?: string;
  casiParticolari?: string;
  info?: string;
  accessoFisico?: string;
  accessoDigitale?: string;
  prenotaAppuntamento?: string;
  tax_servizio: Taxonomy;
  immagine?: Media;
  fileCondizioni?: Array<Media>;
  documenti?: Array<DocumentoPubblico>;
  contatti?: Array<Contatto>;
  codiceIpa?: string;
  classificazione?: string;
  unita_organizzativa_responsabile?: UnitaOrganizzativa;
  argomenti: Array<TaxArgomento>;
  tax_eventi_persone?: Array<TaxArgomento>;
  tax_eventi_imprese?: Array<TaxArgomento>;
  seo?: SharedSeo;
}

export interface UnitaOrganizzativa extends ContentType {
  titolo: string;
  slug: string;
  descrizione: string;
  competenze: string;
  immagine?: Media;
  logo?: Media;
  info?: string;
  tax_unita_organizzativa?: Taxonomy;
  argomenti?: Array<TaxArgomento>;
  persona_responsabile?: Persona;
  persona_assessore?: Persona;
  persone_componenti?: Array<Persona>;
  contatti?: Array<Contatto>;
  unita_organizzativa_padre?: UnitaOrganizzativa;
  sede_principale?: Luogo;
  sedi_secondarie?: Array<Luogo>;
  orari?: string;
  documenti_pubblici?: Array<DocumentoPubblico>;
  servizi?: Array<Servizio>;
  order?: number;
  seo?: SharedSeo;
}

export interface Valutazione extends ContentType {
  url: string;
  rating: number;
  risposta: string;
  descrizione: string;
}

export interface Faq extends ContentType {
  domande: Array<FaqItem>;
}

export interface Homepage extends ContentType {
  galleriaSfondo?: Array<Media>;
  mostraSoloPrimaNovitaInEvidenza?: boolean;
  notizieInEvidenza?: number;
  eventiInEvidenza?: number;
  immagineArgomenti?: Media;
  argomenti?: Array<TaxArgomento>;
  argomentiNotizie?: number;
  argomentiServizi?: number;
  altriArgomenti?: Array<TaxArgomento>;
  linkAccessoRapido?: Array<HomepageSitiTematiciItem>;
  sitiTematici?: Array<HomepageSitiTematiciItem>;
  linkUtili?: Array<HomepageLink>;
  mostraAvvisiInScadenza?: Boolean;
  mostraAmministrazione?: Boolean;
}

export interface Privacy extends ContentType {
  contenuto?: string;
}

export interface NoteLegali extends ContentType {
  contenuto?: string;
}

export interface AvvisoGenerale extends ContentType {
  contenuto?: string;
  attivo?: boolean;
}

export interface DocumentiInEvidenza extends ContentType {
  documenti?: Array<ImpostazioniLink>;
}

export interface Impostazioni extends ContentType {
  municipalityName: string;
  municipalityAddress?: string;
  municipalityFiscalCode?: string;
  municipalityVatNumber?: string;
  municipalityFreephone?: string;
  municipalitySwitchboard?: string;
  municipalityEmail?: string;
  municipalityPec?: string;
  municipalityUrpEmail?: string;
  ownerName?: string;
  ownerUrl?: string;
  cittadinoAttivoBaseUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
  whatsappUrl?: string;
  instagramUrl?: string;
  rssUrl?: string;
  navTopBar?: Array<ImpostazioniLink>;
  footerPrimaryExtra?: Array<ImpostazioniLink>;
  footerSecondaryExtra?: Array<ImpostazioniLink>;
  prenotaAppuntamentoLink?: string;
  richiediAssistenzaLink?: string;
  segnalaDisservizioLink?: string;
  logo?: Media;
  favicon?: Media;
  dichiarazioneAccessibilitaLink?: string;
  obiettiviAccessibilitaLink: ?string;
}
