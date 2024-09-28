/**
 * comuni service
 */

export default () => ({
  async find() {
    try {
      const entries = await strapi.db.query("api::servizio.servizio").findMany({
        select: ["titolo"],
        where: {
          attivo: true,
        },
        populate: {
          tax_servizio: true,
        },
        orderBy: "titolo",
      });

      if (entries && Array.isArray(entries)) {
        return entries.map((entry) => ({
          id: entry.id,
          name: entry.titolo,
          category: {
            id: entry.tax_servizio.id,
            name: entry.tax_servizio.nome,
            taxonomy: entry.tax_servizio.tassonomia,
          },
        }));
      }
      return [];
    } catch (err) {
      return err;
    }
  },
});
