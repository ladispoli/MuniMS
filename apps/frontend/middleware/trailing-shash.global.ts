export default defineNuxtRouteMiddleware(({ path, query, hash }) => {
  if (path === '/' || !path.endsWith('/')) return;

  return navigateTo(
    {
      path: path.replace(/\/+$/, '') || '/',
      query,
      hash,
    },
    { redirectCode: 308 }, // permanent  redirect
  );
});
