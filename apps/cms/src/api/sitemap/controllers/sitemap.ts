/**
 * A set of functions called "actions" for `sitemap`
 */

export default {
  async findUrls(ctx) {
    try {
      const amministrazione = await strapi
        .service("api::sitemap.sitemap")
        .findAmministrazioneUrls();

      const documentiPubblici = await strapi
        .service("api::sitemap.sitemap")
        .findDocumentiPubbliciUrls();

      const incarichi = await strapi
        .service("api::sitemap.sitemap")
        .findIncarichiUrls();

      const persone = await strapi
        .service("api::sitemap.sitemap")
        .findPersoneUrls();

      const novita = await strapi
        .service("api::sitemap.sitemap")
        .findNovitaUrls();

      const servizi = await strapi
        .service("api::sitemap.sitemap")
        .findServiziUrls();

      const eventi = await strapi
        .service("api::sitemap.sitemap")
        .findEventiUrls();

      const luoghi = await strapi
        .service("api::sitemap.sitemap")
        .findLuoghiUrls();

      const argomenti = await strapi
        .service("api::sitemap.sitemap")
        .findArgomentiUrls();

      ctx.body = [
        ...amministrazione,
        ...documentiPubblici,
        ...incarichi,
        ...persone,
        ...novita,
        ...servizi,
        ...eventi,
        ...luoghi,
        ...argomenti,
      ];
    } catch (err) {
      ctx.badRequest("Sitemap controller error", { moreDetails: err });
    }
  },
};
