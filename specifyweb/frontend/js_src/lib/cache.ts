/**
 * LocalStorage front-end cache
 *
 * Mostly used for remembering user preferences (last used leaflet map or WB
 * Column sort order), but can also be used to store results of computationally
 * expensive operations.
 *
 * @remarks
 * localStorage limit in most browsers is 5MB.
 * You can measure current usage with a function like this:
 * https://stackoverflow.com/a/17887889/8584605
 * There used to be a piece of code in cache.ts that trimmed underused old cache
 * entries when cache was getting too big, but it was removed as cache is
 * no longer used to store large objects
 *
 * @module
 */

import type { CacheDefinitions } from './cachedefinitions';
import { eventListener } from './events';
import type { R } from './types';

/** The data structure that would store all the cache */
const cache: R<unknown> = {};

/**
 * The prefix that would be given to all cache keys when they are committed
 * to localStorage.
 *
 * It is used to avoid collisions with other applications when running Specify 7
 * in development on localhost as well as to differentiate the localStorage
 * usages by this component from other components and third party libraries.
 */
const cachePrefix = 'specify7';
const formatKey = (category: string, key: string): string =>
  [cachePrefix, category, key].join('-');

function parseKey(
  formattedKey: string
): Readonly<[string, string]> | undefined {
  const parts = formattedKey.split('-');
  if (parts.length !== 3 || parts[0] !== cachePrefix) return undefined;
  return [parts[1], parts[2]];
}

/**
 * Indicates whether initialize() was run. If not, runs it on the next call
 * to get() or set()
 */
let eventListenerIsInitialized = false;

/** Listen for changes to localStorage from other tabs */
function initialize(): void {
  globalThis.addEventListener?.(
    'storage',
    ({ storageArea, key: formattedKey, newValue }) => {
      // "key" is null only when running `localStorage.clear()`
      if (storageArea !== globalThis.localStorage || formattedKey === null)
        return;
      const parsedKey = parseKey(formattedKey);
      if (parsedKey === undefined || newValue === null) return;
      /*
       * Safe to assume only JSON values would be in localStorage, as that's
       * what genericSet() does
       */
      const parsedValue = JSON.parse(newValue);
      const [category, key] = parsedKey;
      genericSet(category, key, parsedValue);
    }
  );
  eventListenerIsInitialized = true;
}

/** Tries to fetch a cache from localStorage */
function fetchBucket(formattedKey: string): void {
  if (globalThis.localStorage === undefined) return;

  const data = globalThis.localStorage.getItem(formattedKey);

  if (data !== null) cache[formattedKey] = JSON.parse(data);
}

/**
 * Get value of cache key in a category.
 *
 * Category names and key names are defined in CacheDefinitions
 */
export const getCache = <
  CATEGORY extends string & keyof CacheDefinitions,
  KEY extends string & keyof CacheDefinitions[CATEGORY]
>(
  category: CATEGORY,
  key: KEY
): CacheDefinitions[CATEGORY][KEY] | undefined =>
  genericGet<CacheDefinitions[CATEGORY][KEY]>(category, key);

/** Get value of cache key in a category */
function genericGet<TYPE>(
  // The name of the bucket
  category: string,
  // The name of the cache
  key: string
): TYPE | undefined {
  if (!eventListenerIsInitialized) initialize();

  const formattedKey = formatKey(category, key);
  if (cache[formattedKey] === undefined) fetchBucket(formattedKey);

  return cache[formattedKey] as TYPE | undefined;
}

export const setCache = <
  CATEGORY extends string & keyof CacheDefinitions,
  KEY extends string & keyof CacheDefinitions[CATEGORY]
>(
  category: CATEGORY,
  key: KEY,
  cacheValue: CacheDefinitions[CATEGORY][KEY]
) => genericSet<CacheDefinitions[CATEGORY][KEY]>(category, key, cacheValue);

export const cacheEvents = eventListener<{
  change: { readonly category: string; readonly key: string };
}>();

function genericSet<T>(
  category: string,
  key: string,
  // Any serializable value
  value: T
): T {
  if (!eventListenerIsInitialized) initialize();

  const formattedKey = formatKey(category, key);
  if (cache[formattedKey] === undefined) fetchBucket(formattedKey);
  if (cache[formattedKey] === value) return value;

  cache[formattedKey] = value;

  globalThis.localStorage.setItem(
    formatKey(category, key),
    JSON.stringify(value)
  );

  cacheEvents.trigger('change', { category, key });

  return value;
}
