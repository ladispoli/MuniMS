export default {
  routes: [
    {
      method: "GET",
      path: "/sitemap",
      handler: "sitemap.findUrls",
    },
  ],
};
