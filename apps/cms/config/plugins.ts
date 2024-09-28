import meilisearch from "./meilisearch";

export default ({ env }) => {
  let pluginsConfig: any = {
    transformer: {
      enabled: true,
      config: {
        responseTransforms: {
          removeAttributesKey: true,
          removeDataKey: true,
        },
        requestTransforms: {
          wrapBodyWithDataKey: true,
        },
      },
    },
    seo: {
      enabled: true,
    },
    placeholder: {
      enabled: true,
    },
    "duplicate-button": true,
    "import-export-entries": {
      enabled: true,
    },
    meilisearch: {
      config: {
        host: env("PLUGIN_MEILISEARCH_HOST", "http://localhost:7700"),
        apiKey: env("PLUGIN_MEILISEARCH_API_KEY"),
        ...meilisearch,
      },
    },
  };

  if (env("NODE_ENV") === "production") {
    pluginsConfig = {
      ...pluginsConfig,
      upload: {
        config: {
          sizeLimit: 100 * 1024 * 1024,
          provider: "aws-s3",
          providerOptions: {
            s3Options: {
              accessKeyId: env("AWS_ACCESS_KEY_ID"),
              secretAccessKey: env("AWS_ACCESS_SECRET"),
              region: env("AWS_REGION"),
              params: {
                ACL: env("AWS_ACL", "public-read"),
                signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
                Bucket: env("AWS_BUCKET_NAME"),
              },
            },
          },
          actionOptions: {
            upload: {},
            uploadStream: {},
            delete: {},
          },
        },
      },
    };
  }

  return pluginsConfig;
};
