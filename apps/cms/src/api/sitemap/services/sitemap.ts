/**
 * comuni service
 */
import taxonomiesMaps from "./taxonomies-maps";

function getQueryParams(options?: {
  taxonomyName?: string;
  where?: Record<string, any>;
}) {
  const params: Record<string, any> = {
    select: ["slug", "updatedAt"],
    orderBy: { updatedAt: "asc" },
    where: {
      publishedAt: {
        $ne: null,
      },
    },
  };

  if (options?.where) {
    params.where = {
      ...params.where,
      ...options.where,
    };
  }
  if (options?.taxonomyName) {
    params.populate = {
      [options?.taxonomyName]: {
        select: ["slug"],
      },
    };
  }

  return params;
}

function getSitemapUrls(
  entries: Array<{ slug: string; updatedAt: string }>,
  urlsPrefix?: string,
  taxonomyName?: string,
  taxonomySlugMap?: Array<{ taxonomySlug: string; urlSlug: string }>
) {
  if (!Array.isArray(entries) || !entries.length) {
    return [];
  }

  return entries.reduce((acc, entry) => {
    if (entry?.slug && entry?.updatedAt) {
      const locPrefix = urlsPrefix || "";

      if (taxonomyName && taxonomySlugMap) {
        const taxonomySlug = entry[taxonomyName]?.slug;
        const taxonomyMap = taxonomySlugMap.find(
          (item) => item.taxonomySlug === taxonomySlug
        );

        if (taxonomyMap) {
          acc.push({
            loc: `${locPrefix}${taxonomyMap.urlSlug}/${entry.slug}`,
            lastmod: entry.updatedAt?.slice(0, 10),
          });
          return acc;
        }
      } else if (taxonomyName && entry[taxonomyName]?.slug) {
        acc.push({
          loc: `${locPrefix}${entry[taxonomyName]?.slug}/${entry.slug}`,
          lastmod: entry.updatedAt?.slice(0, 10),
        });
        return acc;
      }

      acc.push({
        loc: `${urlsPrefix}${entry.slug}`,
        lastmod: entry.updatedAt?.slice(0, 10),
      });
    }
    return acc;
  }, []);
}

export default () => ({
  async findAmministrazioneUrls() {
    try {
      const taxonomyName = "tax_unita_organizzativa";

      const areeAmministrativePages = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findMany(
          getQueryParams({
            where: {
              [taxonomyName]: { slug: "struttura-amministrativa_area" },
            },
          })
        );

      const ufficiPages = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findMany(
          getQueryParams({
            where: {
              [taxonomyName]: { slug: "struttura-amministrativa_ufficio" },
            },
          })
        );

      const consiglioComunalePage = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findOne(
          getQueryParams({
            where: {
              slug: "consiglio-comunale",
            },
          })
        );

      const giuntaComunalePage = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findOne(
          getQueryParams({
            where: {
              slug: "giunta-comunale",
            },
          })
        );

      const commissioniPages = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findMany(
          getQueryParams({
            where: {
              [taxonomyName]: { slug: "struttura-politica_commissione" },
            },
          })
        );

      const consultePages = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findMany(
          getQueryParams({
            where: {
              [taxonomyName]: { slug: "struttura-politica_consulta" },
            },
          })
        );

      const gruppiConsiliariPages = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findMany(
          getQueryParams({
            where: {
              [taxonomyName]: {
                slug: {
                  $startsWith: "struttura-politica_gruppo",
                },
              },
            },
          })
        );

      const altreStrutturePages = await strapi.db
        .query("api::unita-organizzativa.unita-organizzativa")
        .findMany(
          getQueryParams({
            where: {
              [taxonomyName]: {
                slug: {
                  $startsWith: "altra-struttura",
                },
              },
            },
          })
        );

      return [
        ...getSitemapUrls(
          areeAmministrativePages,
          "amministrazione/aree-amministrative/"
        ),
        ...getSitemapUrls(
          altreStrutturePages,
          "amministrazione/altre-strutture/"
        ),
        ...getSitemapUrls(ufficiPages, "amministrazione/uffici/"),
        ...getSitemapUrls(
          [consiglioComunalePage, giuntaComunalePage],
          "amministrazione/organi-di-governo/"
        ),
        ...getSitemapUrls(
          commissioniPages,
          "amministrazione/organi-di-governo/commissioni/"
        ),
        ...getSitemapUrls(
          consultePages,
          "amministrazione/organi-di-governo/consulte/"
        ),
        ...getSitemapUrls(
          gruppiConsiliariPages,
          "amministrazione/organi-di-governo/gruppi-consiliari/"
        ),
      ];
    } catch (err) {
      return err;
    }
  },

  async findDocumentiPubbliciUrls() {
    try {
      const taxonomyName = "tax_documento";

      const pages = await strapi.db
        .query("api::documento-pubblico.documento-pubblico")
        .findMany(getQueryParams({ taxonomyName }));

      return getSitemapUrls(
        pages,
        "amministrazione/documenti-e-dati/",
        taxonomyName,
        taxonomiesMaps.documentiPubblici
      );
    } catch (err) {
      return err;
    }
  },

  async findIncarichiUrls() {
    try {
      const pages = await strapi.db
        .query("api::incarico.incarico")
        .findMany(getQueryParams({ taxonomyName: "tax_incarico" }));

      return getSitemapUrls(pages, "amministrazione/incarichi/");
    } catch (err) {
      return err;
    }
  },

  async findPersoneUrls() {
    try {
      const pages = await strapi.db
        .query("api::persona.persona")
        .findMany(getQueryParams());

      return getSitemapUrls(pages, "amministrazione/persone/");
    } catch (err) {
      return err;
    }
  },

  async findNovitaUrls() {
    try {
      const taxonomyName = "tax_notizia";
      const urlsPrefix = "novita/";

      const categoryPages = await strapi.db
        .query("api::tax-notizia.tax-notizia")
        .findMany(getQueryParams());

      const pages = await strapi.db
        .query("api::notizia.notizia")
        .findMany(getQueryParams({ taxonomyName }));

      return [
        ...getSitemapUrls(
          categoryPages,
          urlsPrefix,
          taxonomyName,
          taxonomiesMaps.novita
        ),
        ...getSitemapUrls(
          pages,
          urlsPrefix,
          taxonomyName,
          taxonomiesMaps.novita
        ),
      ];
    } catch (err) {
      return err;
    }
  },

  async findServiziUrls() {
    try {
      const taxonomyName = "tax_servizio";
      const urlsPrefix = "servizi/";

      const categoryPages = await strapi.db
        .query("api::tax-servizio.tax-servizio")
        .findMany(getQueryParams());

      const pages = await strapi.db
        .query("api::servizio.servizio")
        .findMany(getQueryParams({ taxonomyName }));

      return [
        ...getSitemapUrls(categoryPages, urlsPrefix),
        ...getSitemapUrls(pages, urlsPrefix, taxonomyName),
      ];
    } catch (err) {
      return err;
    }
  },

  async findEventiUrls() {
    try {
      const taxonomyName = "tax_evento";
      const urlsPrefix = "vivere-il-comune/eventi/";

      const categoryPages = await strapi.db
        .query("api::tax-evento.tax-evento")
        .findMany(getQueryParams());

      const pages = await strapi.db
        .query("api::evento.evento")
        .findMany(getQueryParams({ taxonomyName }));

      return [
        ...getSitemapUrls(categoryPages, urlsPrefix),
        ...getSitemapUrls(pages, urlsPrefix, taxonomyName),
      ];
    } catch (err) {
      return err;
    }
  },

  async findLuoghiUrls() {
    try {
      const taxonomyName = "tax_luogo";
      const urlsPrefix = "vivere-il-comune/luoghi/";

      const categoryPages = await strapi.db
        .query("api::tax-luogo.tax-luogo")
        .findMany(getQueryParams());

      const pages = await strapi.db
        .query("api::luogo.luogo")
        .findMany(getQueryParams({ taxonomyName }));

      return [
        ...getSitemapUrls(categoryPages, urlsPrefix),
        ...getSitemapUrls(pages, urlsPrefix, taxonomyName),
      ];
    } catch (err) {
      return err;
    }
  },

  async findArgomentiUrls() {
    try {
      const pages = await strapi.db
        .query("api::argomento.argomento")
        .findMany(getQueryParams());

      return getSitemapUrls(pages, "argomenti/");
    } catch (err) {
      return err;
    }
  },
});
