import React from 'react';

import { IR } from '../../utils/types';
import { LoadingScreen } from '../Molecules/Dialog';

function FakeAsync<PROPS extends IR<unknown>>({
  Element,
  props,
}: {
  readonly Element: React.FunctionComponent<PROPS>;
  readonly props: PROPS;
}) {
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <Element {...props} />
    </React.Suspense>
  );
}

export function LazyAsync<PROPS extends IR<unknown>>(
  componentPromise: () => Promise<React.FunctionComponent<PROPS>>
) {
  const lazy = React.lazy(() =>
    componentPromise().then((module) => ({ default: module }))
  );
  function Wrapped(props: React.PropsWithRef<PROPS>): JSX.Element {
    return (
      <FakeAsync<React.PropsWithRef<PROPS>> Element={lazy} props={props} />
    );
  }
  return Wrapped;
}
