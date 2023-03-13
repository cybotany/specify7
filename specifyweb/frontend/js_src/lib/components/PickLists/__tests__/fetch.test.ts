import { overrideAjax } from '../../../tests/ajax';
import { requireContext } from '../../../tests/helpers';
import { removeKey } from '../../../utils/utils';
import { addMissingFields } from '../../DataModel/addMissingFields';
import { getResourceApiUrl } from '../../DataModel/resource';
import {
  createPickListItem,
  getFrontEndPickLists,
  PickListTypes,
} from '../definitions';
import { exportsForTests } from '../fetch';
import {
  deserializeResource,
  serializeResource,
} from '../../DataModel/serializers';

const { unsafeFetchPickList, fetchPickListItems } = exportsForTests;

requireContext();

describe('unsafeFetchPickList', () => {
  test('front-end pick list', async () => {
    const resource = await unsafeFetchPickList('_AgentTypeComboBox');
    const serialized = serializeResource(resource!);
    const pickList = serializeResource(
      getFrontEndPickLists().Agent!.agentType!
    );
    expect(serialized).toEqual(pickList);
  });

  const pickList = {
    resource_uri: getResourceApiUrl('PickList', 1),
    collection: getResourceApiUrl('Collection', 4),
  };
  overrideAjax(
    '/api/specify/picklist/?name=currentCollection&limit=1&domainfilter=true',
    {
      meta: {
        total_count: 1,
      },
      objects: [pickList],
    }
  );
  test('pick list from current collection', async () => {
    const resource = await unsafeFetchPickList('currentCollection');
    const serialized = serializeResource(resource!);
    expect(serialized).toEqual(addMissingFields('PickList', pickList));
  });

  overrideAjax(
    '/api/specify/picklist/?name=otherCollection&limit=1&domainfilter=true',
    {
      meta: {
        total_count: 0,
      },
      objects: [],
    }
  );
  const otherPickList = {
    resource_uri: getResourceApiUrl('PickList', 2),
    collection: getResourceApiUrl('Collection', 4),
  };
  overrideAjax(
    '/api/specify/picklist/?name=otherCollection&limit=1&domainfilter=false',
    {
      meta: {
        total_count: 1,
      },
      objects: [otherPickList],
    }
  );
  test('pick list from other collection', async () => {
    const resource = await unsafeFetchPickList('otherCollection');
    const serialized = serializeResource(resource!);
    expect(serialized).toEqual(addMissingFields('PickList', otherPickList));
  });

  overrideAjax(
    '/api/specify/picklist/?name=unknownPickList&limit=1&domainfilter=false',
    {
      meta: {
        total_count: 0,
      },
      objects: [],
    }
  );

  overrideAjax(
    '/api/specify/picklist/?name=unknownPickList&limit=1&domainfilter=true',
    {
      meta: {
        total_count: 0,
      },
      objects: [],
    }
  );

  test('unknown pick list', async () =>
    expect(unsafeFetchPickList('unknownPickList')).resolves.toBeUndefined());
});

describe('fetchPickListItems', () => {
  test('pick list from items', async () => {
    const pickListItems = [
      addMissingFields('PickListItem', { title: 'a', value: 'b' }),
    ];
    const pickList = deserializeResource(
      addMissingFields('PickList', {
        type: PickListTypes.ITEMS,
        pickListItems,
      })
    );
    await expect(fetchPickListItems(pickList)).resolves.toEqual(pickListItems);
  });

  overrideAjax('/api/specify/locality/?domainfilter=true&limit=0', {
    meta: {
      total_count: 1,
    },
    objects: [{ id: 3, _tableName: 'Locality', localityname: 'abc' }],
  });
  test('pick list from entire table', async () => {
    const pickList = deserializeResource(
      addMissingFields('PickList', {
        type: PickListTypes.TABLE,
        tableName: 'Locality',
        pickListItems: [
          // Should ignore this pick list item
          addMissingFields('PickListItem', { title: 'a', value: 'b' }),
        ],
      })
    );
    const items = await fetchPickListItems(pickList);
    expect(items.map((item) => removeKey(item, 'timestampCreated'))).toEqual([
      removeKey(createPickListItem('3', 'abc'), 'timestampCreated'),
    ]);
  });

  overrideAjax(
    '/api/specify_rows/locality/?limit=0&distinct=true&fields=localityname',
    [['abc']]
  );
  test('entire column', async () => {
    const pickList = deserializeResource(
      addMissingFields('PickList', {
        type: PickListTypes.FIELDS,
        tableName: 'Locality',
        fieldName: 'localityName',
      })
    );
    const items = await fetchPickListItems(pickList);
    expect(items.map((item) => removeKey(item, 'timestampCreated'))).toEqual([
      removeKey(createPickListItem('abc', 'abc'), 'timestampCreated'),
    ]);
  });
});
