import React from 'react';
import { useOutletContext } from 'react-router';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { commonText } from '../../localization/common';
import { userText } from '../../localization/user';
import { Http } from '../../utils/ajax/definitions';
import { ping } from '../../utils/ajax/ping';
import type { GetOrSet, IR, RA } from '../../utils/types';
import { defined, filterArray } from '../../utils/types';
import { removeKey, replaceItem, replaceKey } from '../../utils/utils';
import { Ul } from '../Atoms';
import { Button } from '../Atoms/Button';
import { Link } from '../Atoms/Link';
import { LoadingContext } from '../Core/Contexts';
import type { SpecifyResource } from '../DataModel/legacyTypes';
import type { SpecifyUser } from '../DataModel/types';
import { SearchDialog } from '../SearchDialog';
import { userInformation } from '../InitialContext/userInformation';
import { LoadingScreen } from '../Molecules/Dialog';
import { hasPermission, hasTablePermission } from '../Permissions/helpers';
import { locationToState, useStableLocation } from '../Router/RouterState';
import type { SecurityCollectionOutlet, UserRoles } from './Collection';
import { createCollectionRole } from './CreateRole';
import { decompressPolicies } from './policyConverter';
import type { NewRole, Role } from './Role';
import { RoleView } from './Role';
import { tables } from '../DataModel/tables';

export const updateCollectionRole = async (
  [roles, setRoles]: GetOrSet<IR<Role> | undefined>,
  role: Role
): Promise<void> =>
  ping(
    `/permissions/role/${role.id}/`,
    {
      method: 'PUT',
      body: {
        ...role,
        policies: decompressPolicies(role.policies),
      },
    },
    { expectedResponseCodes: [Http.NO_CONTENT] }
  ).then((): void =>
    setRoles(replaceKey(defined(roles), role.id.toString(), role))
  );

export function SecurityCollectionRole(): JSX.Element {
  const loading = React.useContext(LoadingContext);
  const navigate = useNavigate();
  const location = useStableLocation(useLocation());
  const state = locationToState(location, 'SecurityRole');
  const initialRole = state?.role;

  const {
    getSetRoles: [roles, setRoles],
    getSetUserRoles: [userRoles, setUserRoles],
    collection,
  } = useOutletContext<SecurityCollectionOutlet>();

  const { roleId = '' } = useParams();
  const role = React.useMemo(() => {
    if (typeof initialRole === 'object') return initialRole;
    if (roles === undefined) return undefined;
    return roles?.[roleId] ?? undefined;
  }, [roleId, roles, initialRole]);

  const roleUsers = React.useMemo(
    () =>
      typeof role === 'object'
        ? userRoles?.filter(({ roles }) =>
            roles.some(({ roleId }) => roleId === role.id)
          )
        : undefined,
    [userRoles, role]
  );

  function handleAddUsers(users: RA<SpecifyResource<SpecifyUser>>): void {
    if (userRoles === undefined || role?.id === undefined) return;
    loading(
      Promise.all(
        users.map((user) => {
          const userIndex = userRoles.findIndex(
            ({ userId }) => userId === user.id
          );
          const currentUserRoles = userRoles[userIndex].roles.map(
            ({ roleId }) => roleId
          );
          // Noop if user is already part of this role
          return currentUserRoles.includes(role.id!)
            ? undefined
            : ping(
                `/permissions/user_roles/${collection.id}/${user.id}/`,
                {
                  method: 'PUT',
                  body: [...currentUserRoles, role.id].map((id) => ({
                    id,
                  })),
                },
                { expectedResponseCodes: [Http.NO_CONTENT] }
              ).then(() => ({
                userIndex,
                updatedRoles: {
                  ...userRoles[userIndex],
                  roles: [
                    ...userRoles[userIndex].roles,
                    {
                      roleId: defined(role.id),
                      roleName: role.name,
                    },
                  ],
                },
              }));
        })
      ).then((addedUserRoles) =>
        setUserRoles(
          filterArray(addedUserRoles).reduce(
            (userRoles, { userIndex, updatedRoles }) =>
              replaceItem(userRoles, userIndex, updatedRoles),
            userRoles
          )
        )
      )
    );
  }

  return typeof roles === 'object' && typeof role === 'object' ? (
    <RoleView
      closeUrl={`/specify/security/collection/${collection.id}/`}
      collectionId={collection.id}
      parentName={collection.collectionName ?? ''}
      permissionName="/permissions/roles"
      role={role}
      roleUsers={
        <RoleUsers
          collectionId={collection.id}
          role={role}
          userRoles={roleUsers}
          onAddUsers={handleAddUsers}
        />
      }
      userRoles={roleUsers}
      onAddUsers={handleAddUsers}
      onDelete={(): void =>
        typeof role.id === 'number'
          ? loading(
              ping(
                `/permissions/role/${role.id}/`,
                {
                  method: 'DELETE',
                },
                { expectedResponseCodes: [Http.NO_CONTENT] }
              )
                .then((): void =>
                  navigate(`/specify/security/collection/${collection.id}/`, {
                    replace: true,
                  })
                )
                .then((): void =>
                  setRoles(removeKey(roles, role.id!.toString()))
                )
            )
          : undefined
      }
      onSave={(role): void =>
        loading(
          (typeof role.id === 'number'
            ? updateCollectionRole([roles, setRoles], role as Role)
            : createCollectionRole(setRoles, collection.id, role)
          ).then((): void =>
            navigate(`/specify/security/collection/${collection.id}/`)
          )
        )
      }
    />
  ) : (
    <LoadingScreen />
  );
}

function RoleUsers({
  role,
  collectionId,
  userRoles,
  onAddUsers: handleAddUsers,
}: {
  readonly role: NewRole | Role;
  readonly collectionId: number;
  readonly userRoles: UserRoles | undefined;
  readonly onAddUsers: (users: RA<SpecifyResource<SpecifyUser>>) => void;
}): JSX.Element | null {
  const [addingUser, setAddingUser] = React.useState<
    SpecifyResource<SpecifyUser> | undefined
  >(undefined);
  return typeof role.id === 'number' &&
    hasPermission('/permissions/user/roles', 'read', collectionId) ? (
    <fieldset className="flex flex-col gap-2">
      <legend>{userText.users()}</legend>
      {typeof userRoles === 'object' ? (
        <>
          <Ul className="flex max-h-[theme(spacing.96)] flex-col gap-2 overflow-auto">
            {userRoles.map(({ userId, userName }) => (
              <li key={userId}>
                {userId !== userInformation.id &&
                !hasTablePermission('SpecifyUser', 'read') ? (
                  <Button.LikeLink onClick={undefined}>
                    {userName}
                  </Button.LikeLink>
                ) : (
                  <Link.Default href={`/specify/security/user/${userId}/`}>
                    {userName}
                  </Link.Default>
                )}
              </li>
            ))}
          </Ul>
          {hasPermission('/permissions/user/roles', 'update', collectionId) && (
            <div>
              <Button.Green
                onClick={(): void =>
                  setAddingUser(new tables.SpecifyUser.Resource())
                }
              >
                {commonText.add()}
              </Button.Green>
            </div>
          )}
          {typeof addingUser === 'object' ? (
            <SearchDialog
              extraFilters={[
                {
                  field: 'id',
                  isNot: true,
                  operation: 'in',
                  value: userRoles
                    .map(({ userId }) => userId.toString())
                    .join(','),
                },
              ]}
              forceCollection={undefined}
              multiple
              templateResource={addingUser}
              onClose={(): void => setAddingUser(undefined)}
              onSelected={handleAddUsers}
            />
          ) : undefined}
        </>
      ) : (
        commonText.loading()
      )}
    </fieldset>
  ) : null;
}
