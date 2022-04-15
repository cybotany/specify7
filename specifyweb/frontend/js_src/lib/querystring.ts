/**
 * Parse URL Query parameters
 */

import { keysToLowerCase } from './datamodelutils';
import type { IR } from './types';

export function formatUrl(url: string, parameters: IR<string>): string {
  const urlObject = new URL(url, window.location.href);
  urlObject.search = new URLSearchParams({
    ...Object.fromEntries(urlObject.searchParams),
    ...keysToLowerCase(parameters),
  }).toString();
  return urlObject.toString();
}

export const parseUrl = (url: string = window.location.href): IR<string> =>
  Object.fromEntries(new URL(url, window.location.href).searchParams);
