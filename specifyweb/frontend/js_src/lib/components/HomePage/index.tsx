import React from 'react';

import { useHueDifference } from '../../hooks/useHueDifference';
import { welcomeText } from '../../localization/welcome';
import { f } from '../../utils/functools';
import { defaultWelcomePageImage } from '../Preferences/Renderers';
import { userPreferences } from '../Preferences/userPreferences';
import { Async } from '../Router/RouterUtils';
import { SearchForm } from '../Header/ExpressSearchTask';
import { useId } from '../../hooks/useId';
import { useSearchParameter } from '../../hooks/navigation';
import { Submit } from '../Atoms/Submit';
import { commonText } from '../../localization/common';

const taxonTiles = f.store(() => (
  <Async
    Element={React.lazy(async () =>
      import('./TaxonTiles').then(({ TaxonTiles }) => ({
        default: TaxonTiles,
      }))
    )}
    title={undefined}
  />
));

export function WelcomeView(): JSX.Element {
  const [mode] = userPreferences.use('welcomePage', 'general', 'mode');
  const [query = ''] = useSearchParameter('q');
  const value = React.useState(query);
  const [pendingQuery] = value;
  const formId = useId('express-search')('form');

  return (
    <div
      className={`
        mx-auto flex h-full w-full max-w-[1000px] flex-col justify-center gap-4 p-4
      `}
    >
      <div className="flex justify-end gap-2">
        <SearchForm formId={formId} pendingQuery={pendingQuery} value={value} />
        <Submit.Gray form={formId}>{commonText.search()}</Submit.Gray>
      </div>
      <span className="flex-1" />
      <div
        className={`
          flex min-h-0 items-center justify-center
          ${mode === 'embeddedWebpage' ? 'h-5/6' : ''}
        `}
      >
        {mode === 'taxonTiles' ? taxonTiles() : <WelcomeScreenContent />}
      </div>
      <span className="flex-1" />
    </div>
  );
}

function WelcomeScreenContent(): JSX.Element {
  const [mode] = userPreferences.use('welcomePage', 'general', 'mode');
  const [source] = userPreferences.use('welcomePage', 'general', 'source');

  return mode === 'embeddedWebpage' ? (
    <iframe
      className="h-full w-full border-0"
      src={source}
      title={welcomeText.pageTitle()}
    />
  ) : mode === 'default' ? (
    <DefaultSplashScreen />
  ) : (
    <img alt="" className="h-full" src={source} />
  );
}

function DefaultSplashScreen(): JSX.Element {
  const hueDifference = useHueDifference();
  return (
    <div className="relative">
      <img
        alt=""
        className="w-[800px]"
        src={defaultWelcomePageImage}
        style={{ filter: `hue-rotate(${hueDifference}deg)` }}
      />
      {/* The two following gradients in the divs are here to apply a fade out effect on the image */}
      <div className="absolute top-0 h-full w-[20%] bg-[linear-gradient(to_right,var(--background),transparent)]" />
      <div className="absolute top-0 right-0 h-full w-[20%] bg-[linear-gradient(to_left,var(--background),transparent)]" />
    </div>
  );
}
