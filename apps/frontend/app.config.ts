export default defineAppConfig({
  domainName: 'comune.munims.it',
  github: 'https://github.com/ladispoli/munims',
  metaTitleDivider: '|',
  locales: [], // possible future implementation
  nav: {
    primary: [
      {
        name: 'Amministrazione',
        path: '/amministrazione',
        attrs: { 'data-element': 'management' },
      },
      {
        name: 'Novità',
        path: '/novita',
        attrs: { 'data-element': 'news' },
      },
      {
        name: 'Servizi',
        path: '/servizi',
        attrs: { 'data-element': 'all-services' },
      },
      {
        name: 'Vivere il comune',
        path: '/vivere-il-comune',
        attrs: { 'data-element': 'live' },
      },
    ],
    secondary: [
      {
        name: 'Tutti gli argomenti',
        path: '/argomenti',
        attrs: { 'data-element': 'all-topics' },
      },
    ],
    home: {
      name: 'Home',
      description: 'Sito istituzionale del Comune di Ladispoli',
    },
    amministrazione: {
      name: 'Amministrazione',
      description:
        'Tutte le informazioni sulla struttura amministrativa del Comune. Scopri gli organi politici, gli uffici e il personale e consulta i documenti pubblici, le statistiche e i bandi di gara.',
      menuHeading: "Tutta l'amministrazione",
      menu: [
        {
          name: 'Organi di governo',
          path: '/amministrazione/organi-di-governo',
          attrs: { 'data-element': 'management-category-link' },
          description:
            'Le informazioni sulla Giunta e il Consiglio comunale, incluse le convocazioni, le registrazioni delle sedute e i verbali.',
        },
        {
          name: 'Aree amministrative',
          path: '/amministrazione/aree-amministrative',
          attrs: { 'data-element': 'management-category-link' },
          description:
            'La struttura organizzativa è suddivisa in aree di competenze che gestiscono i servizi erogati alla comunità.',
        },
        {
          name: 'Uffici',
          path: '/amministrazione/uffici',
          attrs: { 'data-element': 'management-category-link' },
          description:
            'Sezione dedicata agli Uffici di Città, gli uffici aperti al pubblico e gli uffici assistenziali.',
        },
        {
          name: 'Altre strutture',
          path: '/amministrazione/altre-strutture',
          attrs: { 'data-element': 'management-category-link' },
          description:
            'I consorzi, gli enti, le fondazioni e le società partecipate di cui il Comune fa parte per rappresentare al meglio gli interessi della comunità.',
        },
        {
          name: 'Politici',
          path: '/amministrazione/politici',
          attrs: { 'data-element': 'management-category-link' },
          description:
            'Tutti i rappresentanti dei cittadini che compongono gli organi di indirizzo politico del Comune.',
        },
        {
          name: 'Personale amministrativo',
          path: '/amministrazione/personale-amministrativo',
          attrs: { 'data-element': 'management-category-link' },
          description: 'Personale da contattare per informazioni e supporto ai servizi erogati dagli uffici.',
        },
        {
          name: 'Documenti e dati',
          path: '/amministrazione/documenti-e-dati',
          attrs: { 'data-element': 'management-category-link' },
          description: 'Bandi di concorso, modulistica, avvisi, graduatorie, statistiche e documenti pubblici.',
          menuHeading: 'Tutti i documenti e dati',
          menu: [
            {
              name: 'Accordi tra enti',
              path: '/amministrazione/documenti-e-dati/accordi-tra-enti',
              taxonomySlug: 'accordo-tra-enti',
              description: 'Gli accordi del Comune con altre istituzioni, fondazioni ed enti.',
            },
            {
              name: 'Atti normativi',
              path: '/amministrazione/documenti-e-dati/atti-normativi',
              taxonomySlug: 'atto-normativo',
              description: "Statuto, regolamenti dell'Ente e altre norme ufficiali.",
            },
            {
              name: 'Dataset',
              path: '/amministrazione/documenti-e-dati/dataset',
              taxonomySlug: 'dataset',
              description:
                'Le statistiche e i dati strutturati riguardanti le attività produttive, la qualità della vita e la popolazione del Comune.',
            },
            {
              name: 'Documenti Albo Pretorio',
              path: '/amministrazione/documenti-e-dati/documenti-albo-pretorio',
              taxonomySlug: 'documento-albo-pretorio',
              description: "Gli atti amministrativi per i quali è previsto l'obbligo di pubblicità legale.",
            },
            {
              name: 'Documenti attività politica',
              path: '/amministrazione/documenti-e-dati/documenti-attivita-politica',
              taxonomySlug: 'documento-attivita-politica',
              description: 'Sedute, ordini del giorno e interrogazioni degli organi di governo comunali.',
            },
            {
              name: 'Documenti funzionamento interno',
              path: '/amministrazione/documenti-e-dati/documenti-funzionamento-interno',
              taxonomySlug: 'documento-funzionamento-interno',
              description:
                'I regolamenti interni, i provvedimenti dirigenziali e i codici disciplinari degli organi di indirizzo politico.',
            },
            {
              name: 'Documenti tecnici di supporto',
              path: '/amministrazione/documenti-e-dati/documenti-di-supporto',
              taxonomySlug: 'documento-di-supporto',
              description: 'I rapporti tecnici e la documentazione di progetto.',
            },
            {
              name: 'Documenti di programmazione e rendicontazione',
              path: '/amministrazione/documenti-e-dati/documenti-di-programmazione-e-rendicontazione',
              taxonomySlug: 'documento-di-programmazione-e-rendicontazione',
              description: 'Rendiconti, procedure, bilanci consuntivi e preventivi.',
            },
            {
              name: 'Istanze',
              path: '/amministrazione/documenti-e-dati/istanze',
              taxonomySlug: 'istanza',
              description: 'Le richieste private rivolte agli organi amministrativi o giurisdizionali del Comune.',
            },
            {
              name: 'Modulistica',
              path: '/amministrazione/documenti-e-dati/modulistica',
              taxonomySlug: 'modulistica',
              description: 'Tutti i moduli predisposti per la stesura di documenti o scritture.',
            },
          ],
        },
      ],
      routes: {
        areeAmministrative: '/amministrazione/aree-amministrative',
        uffici: '/amministrazione/uffici',
        altreStrutture: '/amministrazione/altre-strutture',
        politici: '/amministrazione/politici',
        personaleAmministrativo: '/amministrazione/personale-amministrativo',
        persone: '/amministrazione/persone',
        incarichi: '/amministrazione/incarichi',
        documenti: '/amministrazione/documenti-e-dati',
        organiDiGoverno: '/amministrazione/organi-di-governo',
        commissioni: '/amministrazione/organi-di-governo/commissioni',
        consulte: '/amministrazione/organi-di-governo/consulte',
        gruppiConsiliari: '/amministrazione/organi-di-governo/gruppi-consiliari',
        altraStruttura: '/amministrazione/altre-strutture',
        aziendaMunicipalizzata: '/amministrazione/altre-strutture/azienda-municipalizzata',
        biblioteca: '/amministrazione/altre-strutture/biblioteca',
        centroCulturale: '/amministrazione/altre-strutture/centro-culturale',
        ente: '/amministrazione/altre-strutture/ente',
        fondazione: '/amministrazione/altre-strutture/fondazione',
        museo: '/amministrazione/altre-strutture/museo',
        scuola: '/amministrazione/altre-strutture/scuola',
      },
    },
    novita: {
      name: 'Novità',
      description:
        'Le notizie, i comunicati e gli avvisi per restare aggiornati sulle ultime novità, opportunità e cosa succede nel territorio comunale.',
      menuHeading: 'Novità',
      menu: [
        {
          name: 'Notizie',
          path: '/novita/notizie',
          attrs: { 'data-element': 'news-category-link' },
          taxonomySlug: 'notizia',
          description: 'Gli ultimi aggiornamenti sugli avvenimenti e la vita culturale nel Comune.',
        },
        {
          name: 'Comunicati',
          path: '/novita/comunicati',
          attrs: { 'data-element': 'news-category-link' },
          taxonomySlug: 'comunicato',
          description: 'Le comunicazioni ufficiali del Sindaco, degli organi politici e degli uffici comunali.',
        },
        {
          name: 'Avvisi',
          path: '/novita/avvisi',
          attrs: { 'data-element': 'news-category-link' },
          taxonomySlug: 'avviso',
          description: 'Bandi di gara, avvisi di concorso e tutte le opportunità per cittadini e imprese.',
        },
      ],
      routes: {
        inEvidenza: { path: '/novita', hash: '#in-evidenza' },
        tutte: { path: '/novita', hash: '#tutte' },
      },
    },
    servizi: {
      name: 'Servizi',
      description:
        'Tutti i servizi comunali per i cittadini, disponibili online o a sportello, per richiedere documenti e permessi, iscriversi a graduatorie ed effettuare pagamenti.',
    },
    vivereIlComune: {
      name: 'Vivere il comune',
      description:
        'Tutti gli eventi, le iniziative e i luoghi d’interesse per scoprire e vivere il territorio comunale.',
      menuHeading: 'Il comune',
      menu: [
        {
          name: 'Eventi',
          path: '/vivere-il-comune/eventi',
          attrs: { 'data-element': 'live-button-events' },
          description: 'Tutti gli appuntamenti organizzati da (o in collaborazione con) il Comune.',
        },
        {
          name: 'Luoghi',
          path: '/vivere-il-comune/luoghi',
          attrs: { 'data-element': 'live-button-locations' },
          description:
            "Biblioteche e musei, monumenti, parchi e giardini, impianti sportivi, centri comunali d'arte, scuole, mercati cittadini.",
        },
      ],
      routes: {
        eventi: '/vivere-il-comune/eventi',
        luoghi: '/vivere-il-comune/luoghi',
      },
    },
    domandeFrequenti: {
      name: 'Domande frequenti (FAQ)',
      description:
        'Elenco di risposte alle domande più frequenti raccolte dalle richieste di assistenza dei cittadini.',
    },
    prenotazioneAppuntamento: {
      name: 'Prenotazione appuntamento',
      description: 'Un servizio aperto a tutti i cittadini per prenotare appuntamenti con gli uffici comunali.',
    },
    segnalazioneDisservizio: {
      name: 'Segnalazione disservizio',
      description:
        'Un servizio aperto a tutti i cittadini per segnalare disservizi, guasti e criticità rilevati sul territorio comunale.',
    },
    richiestaAssistenza: {
      name: 'Richiesta di assistenza',
      description: 'Un servizio aperto a tutti i cittadini per richiedere assistenza e supporto agli uffici comunali.',
    },
    privacy: {
      name: 'Informativa privacy',
      description:
        'In questa pagina sono descritte le informazioni relative al trattamento dei dati personali destinate agli utenti che consultano il presente sito web.',
    },
    noteLegali: {
      name: 'Note legali',
      description:
        'In questa pagina sono riportate le note legali destinate agli utenti che consultano il presente sito web.',
    },
    sitemap: {
      name: 'Mappa del sito',
    },
  },
});
