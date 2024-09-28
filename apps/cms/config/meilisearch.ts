export default {
  // indexes configuration
  argomento: {
    transformEntry({ entry }) {
      return {
        ...entry,
        argomenti_slug: [], // to enable this filter on multi-index search
      };
    },
    settings: {
      sortableAttributes: ["nome"],
      filterableAttributes: ["publishedAt", "argomenti_slug"],
    },
    entriesQuery: {
      limit: 100,
    },
  },
  "documento-pubblico": {
    transformEntry({ entry }) {
      return {
        ...entry,
        tax_documento_nome: entry.tax_documento?.nome ?? null,
        tax_documento_albo_pretorio_nome:
          entry.tax_documento_albo_pretorio?.nome ?? null,
        tax_licenza_nome: entry.tax_licenza_nome?.nome ?? null,
        argomenti_slug: entry.argomenti?.map(({ slug }) => slug),
        unita_organizzativa_titolo: entry.unita_organizzativa?.titolo ?? null,
        documenti_correlati: entry.documenti_correlati.map(
          ({ titolo }) => titolo
        ),
        datasets: entry.datasets.map(({ titolo }) => titolo),
        tax_eventi_persone_nome: entry.tax_eventi_persone.map(
          ({ nome }) => nome
        ),
        tax_eventi_imprese_nome: entry.tax_eventi_imprese.map(
          ({ nome }) => nome
        ),
      };
    },
    settings: {
      sortableAttributes: ["titolo", "data"],
      filterableAttributes: [
        "publishedAt",
        "tax_documento_nome",
        "tax_documento",
        "argomenti_slug",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  evento: {
    transformEntry({ entry }) {
      return {
        ...entry,
        dataInizio_timestamp: new Date(entry.dataInizio).getTime(),
        dataFine_timestamp: new Date(entry.dataFine).getTime(),
        tax_evento_nome: entry.tax_evento?.nome ?? null,
        argomenti_slug: entry.argomenti?.map(({ slug }) => slug),
        partecipanti_nome: entry.partecipanti.map(
          ({ nome, cognome }) => `${cognome} ${nome}`
        ),
        luoghi_nome: entry.luoghi.map(({ nome }) => nome),
        unita_organizzative_titolo: entry.unita_organizzative.map(
          ({ titolo }) => titolo
        ),
        costi: entry.costi?.contenuto,
        evento_padre: entry.evento_padre?.titolo,
        eventi_figli: entry.eventi_figli.map(({ titolo }) => titolo),
      };
    },
    settings: {
      sortableAttributes: ["titolo", "dataInizio", "dataFine"],
      filterableAttributes: [
        "publishedAt",
        "tax_evento_nome",
        "tax_evento",
        "argomenti_slug",
        "dataInizio_timestamp",
        "dataFine_timestamp",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  incarico: {
    transformEntry({ entry }) {
      return {
        ...entry,
        tax_incarico_nome: entry.tax_incarico?.nome ?? null,
        persona_nome: entry.persona
          ? `${entry?.persona.cognome} ${entry?.persona.nome}`
          : null,
        unita_organizzativa_titolo: entry.unita_organizzativa?.titolo ?? null,
        argomenti_slug: [],
      };
    },
    settings: {
      sortableAttributes: ["titolo"],
      filterableAttributes: [
        "publishedAt",
        "tax_incarico_nome",
        "tax_incarico",
        "argomenti_slug",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  luogo: {
    transformEntry({ entry }) {
      return {
        ...entry,
        tax_luogo_nome: entry.tax_luogo?.nome ?? null,
        argomenti_slug: entry.argomenti?.map(({ slug }) => slug),
        unita_organizzativa_titolo: entry.unita_organizzativa?.titolo ?? null,
        luoghi_correlati_nome: entry.luoghi_correlati.map(({ nome }) => nome),
        costi: entry.costi?.contenuto,
      };
    },
    settings: {
      sortableAttributes: ["nome"],
      filterableAttributes: [
        "publishedAt",
        "tax_luogo_nome",
        "tax_luogo",
        "argomenti_slug",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  notizia: {
    transformEntry({ entry }) {
      return {
        ...entry,
        tax_notizia_nome: entry.tax_notizia?.nome ?? null,
        argomenti_slug: entry.argomenti?.map(({ slug }) => slug),
        persone_nome: entry.persone.map(
          ({ nome, cognome }) => `${cognome} ${nome}`
        ),
        luoghi_nome: entry.luoghi.map(({ nome }) => nome),
        unita_organizzativa_titolo: entry.unita_organizzativa?.titolo ?? null,
        allegati: entry.allegati.map(({ titolo }) => titolo),
        datasets: entry.datasets.map(({ titolo }) => titolo),
      };
    },
    settings: {
      sortableAttributes: ["data", "dataScadenza"],
      filterableAttributes: [
        "publishedAt",
        "tax_notizia_nome",
        "tax_notizia",
        "argomenti_slug",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  persona: {
    transformEntry({ entry }) {
      return {
        ...entry,
        incarichi_titolo: entry.incarichi.map(({ titolo }) => titolo),
        responsabile_unita_organizzative_titolo:
          entry.responsabile_unita_organizzative.map(({ titolo }) => titolo),
        assessore_unita_organizzative_titolo:
          entry.assessore_unita_organizzative.map(({ titolo }) => titolo),
        componente_unita_organizzative_titolo:
          entry.componente_unita_organizzative.map(({ titolo }) => titolo),
        argomenti_slug: [],
      };
    },
    settings: {
      sortableAttributes: ["cognome", "nome"],
      filterableAttributes: [
        "publishedAt",
        "responsabile_unita_organizzative_titolo",
        "assessore_unita_organizzative_titolo",
        "componente_unita_organizzative_titolo",
        "argomenti_slug",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  servizio: {
    transformEntry({ entry }) {
      return {
        ...entry,
        tax_servizio_nome: entry.tax_servizio?.nome ?? null,
        argomenti_slug: entry.argomenti?.map(({ slug }) => slug),
        unita_organizzativa_responsabile_titolo:
          entry.unita_organizzativa_responsabile?.titolo ?? null,
        documenti: entry.documenti.map(({ titolo }) => titolo),
        tax_eventi_persone: entry.tax_eventi_persone.map(({ nome }) => nome),
        tax_eventi_imprese: entry.tax_eventi_imprese.map(({ nome }) => nome),
        timeline: entry.timeline?.contenuto,
        costi: entry.costi?.contenuto,
        fileCondizioni: null,
      };
    },
    settings: {
      sortableAttributes: ["titolo"],
      filterableAttributes: [
        "publishedAt",
        "tax_servizio_nome",
        "tax_servizio",
        "argomenti_slug",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
  "unita-organizzativa": {
    transformEntry({ entry }) {
      return {
        ...entry,
        tax_unita_organizzativa_nome:
          entry.tax_unita_organizzativa?.nome ?? null,
        argomenti_slug: entry.argomenti?.map(({ slug }) => slug),
        persone_componenti_nome: entry.persone_componenti.map(
          ({ nome, cognome }) => `${cognome} ${nome}`
        ),
        unita_organizzativa_padre_titolo:
          entry.unita_organizzativa_padre?.titolo ?? null,
        sede_principale_nome: entry.sede_principale?.nome ?? null,
        documenti_pubblici: entry.documenti_pubblici.map(
          ({ titolo }) => titolo
        ),
        servizi_titolo: entry.servizi.map(({ titolo }) => titolo),
        persona_responsabile_nome: entry.persona_responsabile
          ? `${entry.persona_responsabile.cognome} ${entry.persona_responsabile.nome}`
          : null,
        persona_assessore_nome: entry.persona_assessore
          ? `${entry.persona_assessore.cognome} ${entry.persona_assessore.nome}`
          : null,
      };
    },
    settings: {
      sortableAttributes: ["order", "titolo"],
      filterableAttributes: [
        "publishedAt",
        "tax_unita_organizzativa_nome",
        "tax_unita_organizzativa",
        "argomenti_slug",
        "unita_organizzativa_padre",
      ],
    },
    entriesQuery: {
      publicationState: "preview",
      limit: 100,
    },
  },
};
