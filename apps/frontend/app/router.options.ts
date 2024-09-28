import type { RouterOptions } from '@nuxt/schema';

export default <RouterOptions>{
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, _reject) => {
      setTimeout(() => {
        if (savedPosition) {
          resolve(savedPosition);
        } else if (to.path === from.path) {
          // only the query has changed
          resolve();
        } else if (to.hash) {
          resolve({
            el: to.hash,
            top: 0,
          });
        } else {
          resolve({ top: 0 });
        }
      }, 100);
    });
  },
};
