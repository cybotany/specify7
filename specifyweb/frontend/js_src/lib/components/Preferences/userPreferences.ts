import _ from 'underscore';

import { cacheEvents, getCache, setCache } from '../../utils/cache';
import { MILLISECONDS } from '../Atoms/Internationalization';
import { BasePreferences } from './BasePreferences';
import { userPreferenceDefinitions } from './UserDefinitions';

const cacheKey = 'userPreferences';
const throttleRate = 5 * MILLISECONDS;

export const userPreferences = new BasePreferences({
  definitions: userPreferenceDefinitions,
  values: {
    resourceName: 'UserPreferences',
    fetchUrl: '/context/user_resource/',
  },
  defaultValues: {
    resourceName: 'DefaultUserPreferences',
    fetchUrl: '/context/app.resource',
  },
  developmentGlobal: '_userPreferences',
});
userPreferences.setRaw(getCache(cacheKey, 'cached') ?? {});
userPreferences.setDefaults(getCache(cacheKey, 'defaultCached') ?? {});
userPreferences.events.on(
  'update',
  _.throttle(() => {
    setCache(cacheKey, 'cached', {
      ...userPreferences.getRaw(),
    });
    setCache(cacheKey, 'defaultCached', userPreferences.getDefaults());
  }, throttleRate)
);

cacheEvents.on('change', ({ category, key }) => {
  if (category !== cacheKey) return;
  if (key === 'cached')
    userPreferences.setRaw(
      getCache(cacheKey, 'cached') ?? userPreferences.getRaw()
    );
  else if (key === 'defaultCached')
    userPreferences.setDefaults(
      getCache(cacheKey, 'defaultCached') ?? userPreferences.getDefaults()
    );
});
