async function fillFullName(data: any) {
  const { cognome, nome } = data;
  if (cognome && nome) {
    const newNomeCompleto = `${cognome} ${nome}`;

    if (data.nomeCompleto !== newNomeCompleto) {
      data.nomeCompleto = newNomeCompleto;
      data.slug = await strapi
        .service("plugin::content-manager.uid")
        .generateUIDField({
          contentTypeUID: "api::persona.persona",
          field: "slug",
          data: data,
        });
    }
  }
}

export default {
  async beforeCreate(event) {
    await fillFullName(event.params.data);
  },
  async beforeUpdate(event) {
    await fillFullName(event.params.data);
  },
};
