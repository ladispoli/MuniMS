export default ({ env }) => {
  let serverConfig: any = {
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    app: {
      keys: env.array("APP_KEYS"),
    },
  };

  if (env("NODE_ENV") === "production") {
    serverConfig = {
      ...serverConfig,
      url: env("URL"),
    };
  }

  return serverConfig;
};
