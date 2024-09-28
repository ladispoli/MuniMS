import type { Strapi4RequestParams } from '@nuxtjs/strapi/dist/runtime/types';
import type { WatchSource } from 'nuxt/dist/app/compat/capi';

export interface StrapiFetchQueryObject<DataT> {
  contentType: string;
  singleEntry?: boolean; // return only the first entry from the response if it's a collection type, or just the entry if it's a single type
  dataT?: DataT; // utility variable to infer the type of data object
  params?: Strapi4RequestParams;
  pagination?: {
    pageParam?: string; // route query param used for the pagination, default is 1
    pageSize?: number;
    start?: number; // either use pageParam/pagesize or start/limit
    limit?: number;
  };
  transform?: (data: any) => DataT;
}

export interface StrapiFetchError {
  // a combination of strapi error format and nuxt error format
  status?: number;
  statusCode?: number;
  name: string;
  message: string;
  details: Record<string, unknown>;
}

export interface StrapiFetchResponse<DataT> {
  data: DataT; // attributes key has been removed with 'strapi-plugin-transformer'. See strapi 'config/plugins.ts'
  meta: {
    pagination: {
      page?: number;
      pageSize?: number;
      pageCount?: number;
      start?: number;
      limit?: number;
      total: number;
    };
    [key: string]: unknown;
  };
  error?: StrapiFetchError;
}

export interface StrapiFetchOptions<DataT> {
  lazy?: boolean;
  default?: () => DataT | Ref<DataT> | null;
  server?: boolean;
  immediate?: boolean;
  watch?: WatchSource[];
}

export const useStrapiFetch = <DataT>(
  key: string, // additional key to ensure multiple data fetching in the same route path
  query: StrapiFetchQueryObject<DataT>,
  options?: StrapiFetchOptions<DataT>,
) => {
  const { find } = useStrapi();
  const user = useStrapiUser();

  const route = useRoute();

  let _key = unref(route.path) + '#' + key;

  if (query.pagination && query.params) {
    const { pageSize, pageParam, start, limit } = query.pagination;
    if (pageSize && pageParam) {
      const page = Number(route.query[pageParam] ?? 1);

      if (!Array.isArray(pageParam)) {
        query.params.pagination = {
          pageSize,
          page,
        };

        _key += '?page=' + page;
      }
    } else if (start || limit) {
      query.params.pagination = {
        start: start ?? 0,
        limit: limit ?? 25,
      };
    }
  }

  if (user.value) {
    // fetch also draft entries if user is authenticated
    query.params = { ...query.params, publicationState: 'preview' };
  }

  return useAsyncData(_key, () => find<DataT>(query.contentType, query.params), {
    transform: (response) => {
      const { data, meta, error } = response as StrapiFetchResponse<DataT | null>;
      const _result = { data, meta, error };

      if (!data || (Array.isArray(data) && !data.length)) {
        _result.data = null;
        return _result;
      }

      if (query.singleEntry) {
        if (Array.isArray(data) && data.length) {
          _result.data = data[0]; // collection type
        } else {
          _result.data = data; // single type
        }
      }

      if (query?.transform) {
        _result.data = query.transform(_result.data);
      }

      return _result;
    },
    watch: options?.watch,
    lazy: options?.lazy,
    server: options?.server,
    immediate: options?.immediate,
  }).then((asyncData) => {
    if (asyncData.data?.value) {
      const {
        data: strapiData,
        meta: strapiMeta,
        error: strapiError,
      } = unref(asyncData.data) as StrapiFetchResponse<DataT>;

      return { ...asyncData, data: strapiData, meta: strapiMeta, error: strapiError ?? asyncData.error };
    }
    return { ...asyncData, data: null, meta: null };
  });
};
