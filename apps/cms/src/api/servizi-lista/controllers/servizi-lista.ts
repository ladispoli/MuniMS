/**
 * A set of functions called "actions" for `servizi-lista`
 */

function calculatePageCount(entriesNum: number, pageSize?: number) {
  const _pageSize = pageSize || 50; // default page size
  return {
    pageSize: _pageSize,
    pageCount: Math.ceil(entriesNum / (pageSize || _pageSize)),
  };
}

export default {
  async find(ctx) {
    try {
      const data = await strapi
        .service("api::servizi-lista.servizi-lista")
        .find();

      ctx.body = {
        data,
        meta: {
          page: 1,
          ...calculatePageCount(data.length),
          total: data.length,
        },
      };
    } catch (err) {
      ctx.badRequest("Servizi-lista controller error", { moreDetails: err });
    }
  },
};
