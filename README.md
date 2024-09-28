# MuniMS

## Descrizione

MuniMS è un sistema avanzato per la gestione dei contenuti di un comune italiano, conforme alle linee guida di Design Italia per il "Pacchetto Cittadino informato". Questo progetto è stato sviluppato per facilitare la promozione dei contenuti di un ente pubblico su piattaforme web.

Il sistema è conforme alle Linee Guida di design per i servizi web della Pubblica Amministrazione e utilizza i KIT di Designers Italia. MuniMS guida i redattori nella creazione e pubblicazione di contenuti strutturati, che vengono inseriti una sola volta nel sistema e possono essere automaticamente rappresentati in gallerie fotografiche, calendari, mappe, grafici interattivi e aree riservate.

Ol contenuto diventa disponibile agli utenti attraverso un motore di ricerca unico, dotato di filtri progressivi e suggerimenti automatici. Questo rende MuniMS uno strumento ideale per le redazioni distribuite, dove ciascun redattore detiene permessi e ruoli in base alla propria competenza.

## Struttura del Progetto

Il progetto MuniMS è composto da tre componenti principali: CMS, Frontend e Search. Questi componenti lavorano insieme per fornire una soluzione completa per la gestione e la visualizzazione dei contenuti.

### CMS (Content Management System)

Il CMS è basato su [Strapi](https://strapi.io/) e serve come backend per la gestione dei contenuti. I redattori possono creare, modificare e pubblicare contenuti strutturati attraverso un'interfaccia intuitiva. Il CMS è responsabile della gestione delle tassonomie, delle configurazioni e delle API necessarie per il frontend e il motore di ricerca.

### Frontend

Il frontend è l'interfaccia utente del progetto, sviluppata con [Nuxt](https://nuxt.com/). Utilizza i dati forniti dal CMS per visualizzare contenuti. Il frontend è configurato per interagire con il motore di ricerca per fornire risultati filtrati e suggerimenti automatici agli utenti.

### Search

Il componente Search è basato su [Meilisearch](https://www.meilisearch.com/docs) e funge da motore di ricerca per il progetto. Indicizza i contenuti gestiti dal CMS e fornisce funzionalità di ricerca avanzate, come filtri progressivi e suggerimenti automatici. Il motore di ricerca è configurato per garantire che i contenuti siano facilmente accessibili e ricercabili dagli utenti finali.

### Interazione tra i Componenti

1. **CMS**: I redattori inseriscono e gestiscono i contenuti attraverso il CMS. Questi contenuti vengono indicizzati dal motore di ricerca e resi disponibili per il frontend.
2. **Frontend**: Gli utenti interagiscono con il frontend per visualizzare i contenuti. Il frontend effettua richieste al CMS per ottenere i dati e al motore di ricerca per fornire risultati di ricerca pertinenti.
3. **Search**: Il motore di ricerca indicizza i contenuti dal CMS e risponde alle query di ricerca provenienti dal frontend, fornendo risultati filtrati e suggerimenti automatici.

Questa struttura modulare consente una gestione efficiente dei contenuti e una user experience ottimale, garantendo che i dati siano sempre aggiornati e facilmente accessibili.

## Motivazioni

Abbiamo scelto questa struttura e di basare il progetto su tecnologie open source per diversi motivi:

### Modernità e Innovazione

Il nostro obiettivo era creare un sistema moderno e all'avanguardia, capace di rispondere alle esigenze attuali e future degli enti pubblici. Utilizzando tecnologie basate su Node.js, come Strapi per il CMS e Nuxt per il frontend, abbiamo potuto sfruttare la flessibilità e la potenza di un ecosistema in continua evoluzione. Queste tecnologie ci permettono di sviluppare e mantenere il progetto in modo efficiente, garantendo al contempo prestazioni elevate e una user experience ottimale.

### Motore di Ricerca Interno

Una delle caratteristiche distintive di MuniMS è l'integrazione di un motore di ricerca interno basato su Meilisearch. Questo componente offre numerosi vantaggi:
- **Accessibilità dei Contenuti**: Gli utenti possono trovare facilmente le informazioni di cui hanno bisogno grazie a funzionalità di ricerca avanzate, come filtri progressivi e suggerimenti automatici.
- **Efficienza**: Il motore di ricerca indicizza i contenuti in tempo reale, garantendo che le informazioni siano sempre aggiornate e facilmente accessibili.
- **Esperienza Utente**: Una ricerca efficace migliora significativamente l'esperienza utente, rendendo il sito più intuitivo e facile da navigare.

### Focus sull'Innovazione

Ci siamo concentrati sull'integrazione di un motore di ricerca interno avanzato, che ci permette di offrire un servizio unico e di alta qualità, rispondendo alle esigenze degli utenti in modo rapido ed efficiente. La nostra scelta di adottare tecnologie moderne e open source dimostra il nostro impegno verso l'innovazione e la qualità del servizio pubblico.

In sintesi, la struttura scelta per MuniMS e l'adozione di tecnologie open source ci permettono di offrire una soluzione moderna, efficiente e altamente personalizzabile, in grado di migliorare significativamente la gestione e la fruibilità dei contenuti per i comuni italiani.

## Stato del progetto

Il prodotto è stabile e production ready e usato in produzione per il Comune di Ladispoli.

## Installazione

Apri un terminale nella cartella del progetto e installa i pacchetti npm per tutte le app del progetto, situate nella cartella `apps/`, eseguendo i seguenti comandi:
```sh
npm run install
npm run install-all
```

Esegui Docker per preparare Meilisearch.

esegui tutte le app contemporaneamente in modalità development:
```sh
npm run dev
```

Una volta avviato il progetto, Meilisearch genererà una master key. Per visualizzare le chiavi di default generate vai su  `http://localhost:7700/keys`

Imposta la master key nei seguenti file:

`apps/search/.env`:
```sh
MEILI_MASTER_KEY=<master_key>
```

`apps/cms/.env`:
```sh
MEILI_MASTER_KEY=<master_key>
```
Imposta la search key in `PLUGIN_MEILISEARCH_API_KEY`.

Imposta le chiavi Meilisearch nel frontend:
`apps/frontend/.env`:

```sh
MEILISEARCH_SEARCH_API_KEY=<search_key>
MEILISEARCH_ADMIN_API_KEY=<admin_key>
```

Apri Strapi (CMS) e crea il primo utente aprendo una nuova scheda del browser e navigando su `http://localhost:1337/admin/`.


### Configurazione CMS (Strapi)

Assicurati che la connessione con Meilisearch sia riuscita. Vai al pannello di amministrazione e imposta l'indicizzazione dei tipi di contenuto (quelli definiti nel file `cms/config/meilisearch.ts`).

Sincronizza la configurazione (potrebbe essere più facile tramite l'interfaccia. Non importare la configurazione di Meilisearch!).

Genera un token API per l'import-export:

- Genera un nuovo token API (vedi documentazione: [Strapi API Tokens](https://docs.strapi.io/dev-docs/configurations/api-tokens)).
- Imposta i permessi sulle azioni `exportData` e `importData` per l'import-export delle voci.
- Aggiungi `PLUGIN_IMPORT_EXPORT_ENTRIES_API_TOKEN` nel tuo file `.env` con la chiave API generata.

Sincronizza le tassonomie eseguendo:
```sh
yarn tax import
```

Sincronizza i dati (se avevi un ambiente locale precedente).

## Da dove iniziare

...

## Personalizzazioni

### CMS

- Imposta il *logo del menù* e il *logo di autenticazione* nel content-type `impostazioni` in Strapi.
- Cambia la `favicon` caricandola nella cartella `apps/cms`.

### Frontend

- Modifica il `primary color` del tema impostandolo nel file `apps/frontend/.env` in formato HSB.

## Contributi

Nel CMS, per le API relative alle liste dei comuni, viene utilizzata un'API esterna fornita da [Samurai016/Comuni-ITA](https://github.com/Samurai016/Comuni-ITA).
