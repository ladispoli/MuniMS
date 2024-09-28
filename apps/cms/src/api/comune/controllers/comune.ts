/**
 * A set of functions called "actions" for `comuni`
 */

function calculatePageCount(entriesNum: number, pageSize?: number) {
  const _pageSize = pageSize || 50; // default page size
  return {
    pageSize: _pageSize,
    pageCount: Math.ceil(entriesNum / (pageSize || _pageSize)),
  };
}

export default {
  async findComuni(ctx) {
    try {
      const data = await strapi.service("api::comune.comune").findComuni();

      ctx.body = {
        data,
        meta: {
          page: 1,
          ...calculatePageCount(data.length),
          total: data.length,
        },
      };
    } catch (err) {
      ctx.badRequest("Comuni controller error", { moreDetails: err });
    }
  },

  async findProvince(ctx) {
    try {
      const data = await strapi.service("api::comune.comune").findProvince();

      ctx.body = {
        data,
        meta: {
          page: 1,
          ...calculatePageCount(data.length),
          total: data.length,
        },
      };
    } catch (err) {
      ctx.badRequest("Comuni controller error", { moreDetails: err });
    }
  },

  async findRegioni(ctx) {
    try {
      const data = await strapi.service("api::comune.comune").findRegioni();

      ctx.body = {
        data,
        meta: {
          page: 1,
          ...calculatePageCount(data.length),
          total: data.length,
        },
      };
    } catch (err) {
      ctx.badRequest("Comuni controller error", { moreDetails: err });
    }
  },
};
