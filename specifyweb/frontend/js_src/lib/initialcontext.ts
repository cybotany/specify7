import type { MimeType } from './ajax';
import type { RA } from './types';

let unlock: () => void;

// Context is unlocked for main entrypoint only
export const contextUnlockedPromise = new Promise<void>((resolve) => {
  unlock = resolve;
});

export const unlockInitialContext = (): void => unlock();

export async function load<T>(path: string, mimeType: MimeType): Promise<T> {
  await contextUnlockedPromise;

  // eslint-disable-next-line no-console
  console.log('initial context:', path);
  /*
   * Using async import to avoid circular dependency
   * TODO: find a better solution
   */
  return import('./ajax')
    .then(async ({ ajax }) =>
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ajax<T>(path, { headers: { Accept: mimeType } })
    )
    .then(({ data }) => data);
}

export const initialContext = Promise.all([
  import('./preferencesutils'),
  import('./schemabase'),
  import('./schema'),
  import('./remoteprefs'),
  import('./attachments'),
  import('./icons'),
  import('./stringlocalization'),
  import('./systeminfo'),
  import('./uiformatters'),
  import('./userinfo'),
  // TODO: consider removing this from initialContext
  import('./treedefinitions'),
]).then(async (modules) =>
  Promise.all(
    (modules as RA<{ readonly fetchContext: Promise<void> }>).map(
      async ({ fetchContext }) => fetchContext
    )
  )
);
