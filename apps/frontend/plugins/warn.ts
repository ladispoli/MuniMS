export default defineNuxtPlugin(() => {
  return {
    provide: {
      warn: (msg: string, context?: string) => {
        if (process.client && process.env.NODE_ENV !== 'production') {
          const prefix = '[warn plugin] ' + (context ? `[${context}] ` : '');
          // eslint-disable-next-line no-console
          console.warn(prefix + msg);
        }
      },
    },
  };
});
