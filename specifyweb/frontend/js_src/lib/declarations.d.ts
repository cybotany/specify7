import type { IR, RA, RR } from './types';

declare global {
  /*
   * Workaround for https://github.com/microsoft/TypeScript/issues/17002
   * Fix Array.isArray() narrowing RA<T> to any[]
   */
  interface ArrayConstructor {
    /*
     * Typescript does not recognize the definition overwrite when using
     * the other method signature style
     */
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    isArray(argument: RA<any> | any): argument is RA<any>;
  }

  interface Array {
    /**
     * A fix for Array.from(someValue).fill(otherValue) getting its type
     * from someValue rather than otherValue
     */
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    fill<T>(value: T): RA<T>;
  }

  // Prevent Object.entries() from widening the key type to string
  interface ObjectConstructor {
    // Object
    entries<DICTIONARY extends IR<unknown>>(
      object: DICTIONARY
    ): [keyof DICTIONARY & string, DICTIONARY[keyof DICTIONARY]][];

    // Array
    entries<ITEM>(array: RA<ITEM>): [string, ITEM][];

    // Prevent Object.fromEntries() from widening the key type to string
    fromEntries<KEYS extends PropertyKey, VALUES>(
      entries: Iterable<readonly [KEYS, VALUES]>
    ): RR<KEYS, VALUES>;
  }
}
