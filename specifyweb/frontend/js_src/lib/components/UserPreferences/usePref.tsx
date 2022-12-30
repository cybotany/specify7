import React from 'react';

import type { GetOrSet } from '../../utils/types';
import type {
  CollectionPreferences,
  GenericPreferences,
  preferenceDefinitions,
  Preferences,
} from './Definitions';
import { getPref, setPref } from './helpers';
import {
  CollectionPreferencesContext,
  PreferencesContext,
  prefEvents,
} from './Hooks';
import { collectionPreferenceDefinitions } from './CollectionPreferenceDefinitions';

/**
 * React Hook to listen to preferences changes
 * (this allows to change UI preferences without restarting the application)
 */

function useUnsafePref<
  CATEGORY extends keyof GenericPreferences,
  SUBCATEGORY extends keyof GenericPreferences[CATEGORY]['subCategories'],
  ITEM extends keyof GenericPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items']
>(
  category: CATEGORY,
  subcategory: SUBCATEGORY,
  item: ITEM,
  getPref: (
    category: CATEGORY,
    subcategory: SUBCATEGORY,
    item: ITEM
  ) => GenericPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue'],
  setPref: (
    category: CATEGORY,
    subcategory: SUBCATEGORY,
    item: ITEM,
    value: GenericPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
  ) => GenericPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
): GetOrSet<
  GenericPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
> {
  const [pref, setLocalPref] = React.useState<
    GenericPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
  >(() => getPref(category, subcategory, item));

  /**
   * TEST: Stats Page might need testing since it had problems in past with too many state updates
   * causing glitching. isUpdated was added to fixed it, but the glitching is not reproducible at
   * the time of this comment.
   *
   */

  const isUpdated = React.useRef(false);
  React.useEffect(
    () =>
      prefEvents.on('update', (payload) => {
        if (
          // Don't ignore cases when preferences are reloaded from back-end
          payload !== undefined &&
          // But ignore local changes to other prefs
          (payload.category !== category ||
            payload.subcategory !== subcategory ||
            payload.item !== item)
        )
          return;
        if (isUpdated.current) return;
        const newValue = getPref(category, subcategory, item);
        setLocalPref(newValue);
      }),
    [category, subcategory, item, getPref]
  );

  const updatePref = React.useCallback(
    (
      newPref:
        | Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
        | ((
            oldPref: Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
          ) => Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue'])
    ): void => {
      const oldValue = getPref(category, subcategory, item);
      const newValueRaw =
        typeof newPref === 'function'
          ? (
              newPref as (
                oldPref: Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
              ) => Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
            )(oldValue)
          : newPref;

      const newValue = setPref(category, subcategory, item, newValueRaw);
      setLocalPref(newValue);
      isUpdated.current = true;
    },
    [category, subcategory, item, setPref, getPref]
  );

  return [pref, updatePref] as const;
}

export function usePref<
  CATEGORY extends keyof Preferences,
  SUBCATEGORY extends CATEGORY extends keyof typeof preferenceDefinitions
    ? keyof Preferences[CATEGORY]['subCategories'] & string
    : never,
  ITEM extends keyof Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items']
>(
  category: CATEGORY,
  subcategory: SUBCATEGORY,
  item: ITEM
): GetOrSet<
  Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
> {
  const [getPrefMain, setUserPref] = React.useContext(PreferencesContext) ?? [
    getPref.userPreferences,
    setPref.userPreferences,
  ];

  return useUnsafePref(
    category,
    subcategory,
    item,
    // @ts-expect-error
    getPrefMain,
    setUserPref
  ) as unknown as GetOrSet<
    // @ts-expect-error
    typeof preferenceDefinitions[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
  >;
}

export function useCollectionPref<
  CATEGORY extends keyof CollectionPreferences,
  SUBCATEGORY extends CATEGORY extends keyof typeof collectionPreferenceDefinitions
    ? keyof CollectionPreferences[CATEGORY]['subCategories'] & string
    : never,
  ITEM extends keyof CollectionPreferences[CATEGORY]['subCategories'][SUBCATEGORY]['items']
>(
  category: CATEGORY,
  subcategory: SUBCATEGORY,
  item: ITEM
): GetOrSet<
  Preferences[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
> {
  const [getPrefMain, setUserPref] = React.useContext(
    CollectionPreferencesContext
  ) ?? [getPref.collectionPreferences, setPref.collectionPreferences];

  return useUnsafePref(
    category,
    subcategory,
    item,
    // @ts-expect-error
    getPrefMain,
    setUserPref
  ) as unknown as GetOrSet<
    // @ts-expect-error
    typeof collectionPreferenceDefinitions[CATEGORY]['subCategories'][SUBCATEGORY]['items'][ITEM]['defaultValue']
  >;
}
