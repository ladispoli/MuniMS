import slugify from "slugify";

export default {
  apiBaseId: "tax-",
  ids: [
    "argomento",
    "tax-documento",
    "tax-documento-albo-pretorio",
    "tax-evento",
    "tax-evento-impresa",
    "tax-evento-persona",
    "tax-incarico",
    "tax-licenza",
    "tax-luogo",
    "tax-notizia",
    "tax-servizio",
    "tax-stato-pratica",
    "tax-tema-dataset",
    "tax-unita-organizzativa",
  ],
  configPaths: {
    path: "config/sync/",
    baseName: "core-store.plugin_content_manager_configuration_content_types",
  },
  exportPaths: {
    path: "exports/taxonomies/",
    baseName: "",
  },
  configs: {
    settings: {
      bulkable: true,
      filterable: true,
      searchable: true,
      pageSize: 20,
      mainField: "tassonomia",
      defaultSortBy: "tassonomia",
      defaultSortOrder: "ASC",
    },
    metadatas: {
      // ! do not remove or add props here, just edit them
      id: {
        edit: {},
        list: {
          label: "id",
          searchable: true,
          sortable: true,
        },
      },
      tassonomia: {
        edit: {
          label: "Tassonomia",
          description:
            "voce con gerarchia (es. 'voce livello 1 > voce livello 2 > voce livello 3') ",
          placeholder: "",
          visible: true,
          editable: true,
        },
        list: {
          label: "tassonomia",
          searchable: true,
          sortable: true,
        },
      },
      slug: {
        edit: {
          label: "slug della Tassonomia",
          description: 'generato automaticamente da "tassonomia"',
          placeholder: "",
          visible: true,
          editable: false,
        },
        list: {
          label: "slug tassonomia",
          searchable: true,
          sortable: true,
        },
      },
      nome: {
        edit: {
          label: "Nome",
          description: 'voce, assegnato automaticamente da "tassonomia"',
          placeholder: "",
          visible: true,
          editable: false,
        },
        list: {
          label: "nome",
          searchable: true,
          sortable: true,
        },
      },
      slugNome: {
        edit: {
          label: "slug del Nome",
          description: 'generato automaticamente da "Nome"',
          placeholder: "",
          visible: true,
          editable: false,
        },
        list: {
          label: "slug nome",
          searchable: true,
          sortable: true,
        },
      },
      livello: {
        edit: {
          label: "Livello",
          description:
            "livello all'interno della gerarchia, assegnato automaticamente",
          placeholder: "",
          visible: true,
          editable: false,
        },
        list: {
          label: "livello",
          searchable: true,
          sortable: true,
        },
      },
      vocabolario: {
        edit: {
          label: "vocabolario",
          description: "link allo schema del vocabolario controllato",
          placeholder: "es. https://schema.gov.it/...",
          visible: true,
          editable: true,
        },
        list: {
          label: "vocabolario",
          searchable: true,
          sortable: true,
        },
      },
      note: {
        edit: {
          label: "note",
          description: "note e informazioni aggiuntive",
          placeholder: "",
          visible: true,
          editable: true,
        },
        list: {
          label: "note",
          searchable: true,
          sortable: true,
        },
      },
      disabilitato: {
        edit: {
          label: "disabilitato",
          description: "",
          placeholder: "",
          visible: true,
          editable: true,
        },
        list: {
          label: "disabilitato",
          searchable: true,
          sortable: true,
        },
      },
      createdAt: {
        edit: {
          label: "createdAt",
          description: "",
          placeholder: "",
          visible: false,
          editable: true,
        },
        list: {
          label: "createdAt",
          searchable: true,
          sortable: true,
        },
      },
      updatedAt: {
        edit: {
          label: "updatedAt",
          description: "",
          placeholder: "",
          visible: false,
          editable: true,
        },
        list: {
          label: "updatedAt",
          searchable: true,
          sortable: true,
        },
      },
    },
    layouts: {
      edit: [
        [
          {
            name: "tassonomia",
            size: 12,
          },
        ],
        [
          {
            name: "disabilitato",
            size: 4,
          },
        ],
        [
          {
            name: "vocabolario",
            size: 12,
          },
        ],
        [
          {
            name: "note",
            size: 12,
          },
        ],
        [
          {
            name: "slug",
            size: 12,
          },
        ],
        [
          {
            name: "nome",
            size: 6,
          },
          {
            name: "slugNome",
            size: 6,
          },
        ],
        [
          {
            name: "livello",
            size: 4,
          },
        ],
      ],
      list: ["tassonomia", "disabilitato", "note"],
    },
  },
  // to use with lifecycle hooks
  fillData(data: any) {
    const tax = data.tassonomia;
    if (tax) {
      const taxSlug = slugify(
        tax.replace(/\s*>\s*/g, "_").replace(/\([^)]*\)/g, ""), // replace ">" -> "_", remove stuff between parenthesis
        {
          lower: true,
        }
      );
      const hierarchy = tax.split(">");

      data.slug = taxSlug;
      data.livello = hierarchy.length || 1;
      data.nome = hierarchy.slice(-1);

      if (hierarchy.length > 1) {
        data.slugNome = taxSlug.slice(taxSlug.lastIndexOf("_") + 1);
      } else {
        data.slugNome = taxSlug;
      }
    }
  },
};
