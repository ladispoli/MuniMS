export default {
  beforeCreate(event) {
    strapi.config.taxonomies.fillData(event.params.data);
  },
  beforeUpdate(event) {
    strapi.config.taxonomies.fillData(event.params.data);
  },
};
