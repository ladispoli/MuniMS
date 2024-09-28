export default {
  routes: [
    {
      method: "GET",
      path: "/comuni",
      handler: "comune.findComuni",
    },
    {
      method: "GET",
      path: "/regioni",
      handler: "comune.findRegioni",
    },
    {
      method: "GET",
      path: "/province",
      handler: "comune.findProvince",
    },
  ],
};
