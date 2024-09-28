// set the strapi base url only if the media path is not an absolute url
// useStrapiMedia() is not working for media uploaded on external providers

export const useStrapiMediaUrl = (path: string | URL): string => {
  const baseUrl = useStrapiUrl();
  return new URL(path, baseUrl).toString();
};
