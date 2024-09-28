export default ({ env }) => {
  let middlewaresConfig: any = [
    "strapi::errors",
    "strapi::cors",
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];

  if (env("NODE_ENV") === "production") {
    const awsBucketUrl = `${env("AWS_BUCKET_NAME")}.s3.${env(
      "AWS_REGION"
    )}.amazonaws.com`;

    middlewaresConfig = [
      ...middlewaresConfig,
      {
        name: "strapi::body",
        config: {
          formLimit: "100mb", // modify form body
          jsonLimit: "100mb", // modify JSON body
          textLimit: "100mb", // modify text body
          formidable: {
            maxFileSize: 100 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
          },
        },
      },
      {
        name: "strapi::security",
        config: {
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              "connect-src": ["'self'", "http:", "https:"],
              "img-src": [
                "'self'",
                "data:",
                "blob:",
                "market-assets.strapi.io",
                awsBucketUrl,
              ],
              "media-src": [
                "'self'",
                "data:",
                "blob:",
                "market-assets.strapi.io",
                awsBucketUrl,
              ],
              upgradeInsecureRequests: null,
            },
          },
        },
      },
    ];
  } else {
    middlewaresConfig = [
      ...middlewaresConfig,
      "strapi::body",
      {
        name: "strapi::security",
        config: {
          contentSecurityPolicy: {
            useDefaults: true,
            directives: {
              "connect-src": ["'self'", "http:", "https:"],
              upgradeInsecureRequests: null,
            },
          },
        },
      },
    ];
  }

  return middlewaresConfig;
};
