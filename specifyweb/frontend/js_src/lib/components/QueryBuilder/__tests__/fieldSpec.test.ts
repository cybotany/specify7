import { requireContext } from '../../../tests/helpers';
import type { RA } from '../../../utils/types';
import type { Tables } from '../../DataModel/types';
import { QueryFieldSpec } from '../fieldSpec';

requireContext();

const runs: RA<{
  readonly baseTableName: keyof Tables;
  readonly path: RA<string>;
  readonly stringId: string;
  readonly isRelationship: boolean;
}> = [
  {
    baseTableName: 'CollectionObject',
    path: ['-formatted'],
    stringId: '1.collectionobject.',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['catalogNumber'],
    stringId: '1.collectionobject.catalogNumber',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['catalogedDate-day'],
    stringId: '1.collectionobject.catalogedDateNumericDay',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['accession', '-formatted'],
    stringId: '1,7.accession.accession',
    isRelationship: true,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['accession', 'accessionNumber'],
    stringId: '1,7.accession.accessionNumber',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['accession', 'timestampModified-month'],
    stringId: '1,7.accession.timestampModifiedNumericMonth',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['accession', 'accessionAgents', '#1', '-formatted'],
    stringId: '1,7,12-accessionAgents.accessionagent.accessionAgents',
    isRelationship: true,
  },
  {
    baseTableName: 'CollectionObject',
    path: [
      'accession',
      'accessionAuthorizations',
      '#1',
      'permit',
      'permitAttachments',
      '#1',
      '-formatted',
    ],
    stringId:
      '1,7,13-accessionAuthorizations,6,116-permitAttachments.permitattachment.permitAttachments',
    isRelationship: true,
  },
  {
    baseTableName: 'CollectionObject',
    path: [
      'accession',
      'accessionAuthorizations',
      '#1',
      'permit',
      'permitAttachments',
      '#1',
      'ordinal',
    ],
    stringId:
      '1,7,13-accessionAuthorizations,6,116-permitAttachments.permitattachment.ordinal',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: [
      'accession',
      'accessionAuthorizations',
      '#1',
      'permit',
      'permitAttachments',
      '#1',
      'permitAttachmentId',
    ],
    stringId:
      '1,7,13-accessionAuthorizations,6,116-permitAttachments.permitattachment.permitAttachmentId',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'collectionMemberId'],
    stringId: '1,9-determinations.determination.collectionMemberId',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$-any', '-formatted'],
    stringId: '1,9-determinations,4.taxon.taxon',
    isRelationship: true,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$-any', 'author'],
    stringId: '1,9-determinations,4.taxon.author',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$-any', 'text1'],
    stringId: '1,9-determinations,4.taxon.text1',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: [
      'determinations',
      '#1',
      'taxon',
      '$-any',
      'hybridParent2',
      '$Kingdom',
      'fullName',
    ],
    stringId: '1,9-determinations,4,4-hybridParent2.taxon.Kingdom',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: [
      'determinations',
      '#1',
      'taxon',
      '$-any',
      'hybridParent2',
      '$Order',
      '-formatted',
    ],
    stringId: '1,9-determinations,4,4-hybridParent2.taxon.Order',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: [
      'determinations',
      '#1',
      'taxon',
      '$-any',
      'hybridParent2',
      '$-any',
      'commonName',
    ],
    stringId: '1,9-determinations,4,4-hybridParent2.taxon.commonName',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$Phylum', '-formatted'],
    stringId: '1,9-determinations,4.taxon.Phylum',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$Phylum', 'author'],
    stringId: '1,9-determinations,4.taxon.Phylum Author',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$Phylum', 'fullName'],
    stringId: '1,9-determinations,4.taxon.Phylum',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['determinations', '#1', 'taxon', '$Phylum', 'taxonId'],
    stringId: '1,9-determinations,4.taxon.Phylum ID',
    isRelationship: false,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['cataloger', 'createdByAgent', '-formatted'],
    stringId: '1,5-cataloger,5-createdByAgent.agent.createdByAgent',
    isRelationship: true,
  },
  {
    baseTableName: 'CollectionObject',
    path: ['cataloger', 'createdByAgent', 'abbreviation'],
    stringId: '1,5-cataloger,5-createdByAgent.agent.abbreviation',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      '-formatted',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.attachment',
    isRelationship: true,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'copyrightHolder',
    ],
    baseTableName: 'CollectionObject',
    stringId:
      '1,10,110-collectingEventAttachments,41.attachment.copyrightHolder',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'credit',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.credit',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'fileCreatedDate-fullDate',
    ],
    baseTableName: 'CollectionObject',
    stringId:
      '1,10,110-collectingEventAttachments,41.attachment.fileCreatedDate',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'guid',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.guid',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'license',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.license',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'licenseLogoUrl',
    ],
    baseTableName: 'CollectionObject',
    stringId:
      '1,10,110-collectingEventAttachments,41.attachment.licenseLogoUrl',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'mimeType',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.mimeType',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'subjectOrientation',
    ],
    baseTableName: 'CollectionObject',
    stringId:
      '1,10,110-collectingEventAttachments,41.attachment.subjectOrientation',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'subtype',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.subtype',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'title',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.title',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'collectingEventAttachments',
      '#1',
      'attachment',
      'type',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,110-collectingEventAttachments,41.attachment.type',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'locality',
      'geoCoordDetails',
      '#1',
      'geoRefDetBy',
      '-formatted',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,123-geoCoordDetails,5-geoRefDetBy.agent.geoRefDetBy',
    isRelationship: true,
  },
  {
    path: [
      'collectingEvent',
      'locality',
      'geoCoordDetails',
      '#1',
      'geoRefDetDate-fullDate',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,123-geoCoordDetails.geocoorddetail.geoRefDetDate',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'locality',
      'geoCoordDetails',
      '#1',
      'geoRefRemarks',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,123-geoCoordDetails.geocoorddetail.geoRefRemarks',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'locality',
      'geoCoordDetails',
      '#1',
      'maxUncertaintyEst',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,123-geoCoordDetails.geocoorddetail.maxUncertaintyEst',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'localityDetails', '#1', 'island'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,124-localityDetails.localitydetail.island',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'locality',
      'localityDetails',
      '#1',
      'islandGroup',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,124-localityDetails.localitydetail.islandGroup',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'localityDetails', '#1', 'waterBody'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,124-localityDetails.localitydetail.waterBody',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'localityDetails', '#1', 'waterBody'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,124-localityDetails.localitydetail.waterBody',
    isRelationship: false,
  },
  {
    path: [
      'collectingEvent',
      'locality',
      'geography',
      '$Continent',
      'fullName',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,3.geography.Continent',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'geography', '$Country', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,3.geography.Country',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'geography', '$County', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,3.geography.County',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'geography', '$State', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,3.geography.State',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'geography', '$-any', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2,3.geography.geography',
    isRelationship: true,
  },
  {
    path: ['collectingEvent', 'locality', 'datum'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.datum',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'elevationMethod'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.elevationMethod',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'latLongMethod'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.latLongMethod',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'latitude1'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.latitude1',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'localityName'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.localityName',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'longitude1'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.longitude1',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'locality', 'remarks'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,2.locality.remarks',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'collectors', '#1', 'agent', 'lastName'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,30-collectors,5.agent.lastName',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'collectors', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,30-collectors.collector.collectors',
    isRelationship: true,
  },
  {
    path: ['collectingEvent', 'collectingTrip', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,87.collectingtrip.collectingTrip',
    isRelationship: true,
  },
  {
    path: ['collectingEvent', 'collectingEventAttribute', 'number13'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,92.collectingeventattribute.number13',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'collectingEventAttribute', 'text1'],
    baseTableName: 'CollectionObject',
    stringId: '1,10,92.collectingeventattribute.text1',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.collectingEvent',
    isRelationship: true,
  },
  {
    path: ['collectingEvent', 'endDate-fullDate'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.endDate',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'endTime'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.endTime',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'method'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.method',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'remarks'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.remarks',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'startDate-fullDate'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.startDate',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'startDate-day'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.startDateNumericDay',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'startDate-month'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.startDateNumericMonth',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'startDate-year'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.startDateNumericYear',
    isRelationship: false,
  },
  {
    path: ['collectingEvent', 'startTime'],
    baseTableName: 'CollectionObject',
    stringId: '1,10.collectingevent.startTime',
    isRelationship: false,
  },
  {
    path: ['collectionObjectAttachments', '#1', 'attachment', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,111-collectionObjectAttachments,41.attachment.attachment',
    isRelationship: true,
  },
  {
    path: [
      'collectionObjectAttachments',
      '#1',
      'attachment',
      'copyrightHolder',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,111-collectionObjectAttachments,41.attachment.copyrightHolder',
    isRelationship: false,
  },
  {
    path: ['collectionObjectAttachments', '#1', 'attachment', 'credit'],
    baseTableName: 'CollectionObject',
    stringId: '1,111-collectionObjectAttachments,41.attachment.credit',
    isRelationship: false,
  },
  {
    path: [
      'collectionObjectAttachments',
      '#1',
      'attachment',
      'fileCreatedDate-fullDate',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,111-collectionObjectAttachments,41.attachment.fileCreatedDate',
    isRelationship: false,
  },
  {
    path: ['collectionObjectAttachments', '#1', 'attachment', 'guid'],
    baseTableName: 'CollectionObject',
    stringId: '1,111-collectionObjectAttachments,41.attachment.guid',
    isRelationship: false,
  },
  {
    path: ['collectionObjectAttachments', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId:
      '1,111-collectionObjectAttachments.collectionobjectattachment.collectionObjectAttachments',
    isRelationship: true,
  },
  {
    path: ['dnaSequences', '#1', 'sequencer', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,121-dnaSequences,5-sequencer.agent.sequencer',
    isRelationship: true,
  },
  {
    path: ['dnaSequences', '#1', 'boldBarcodeId'],
    baseTableName: 'CollectionObject',
    stringId: '1,121-dnaSequences.dnasequence.boldBarcodeId',
    isRelationship: false,
  },
  {
    path: ['dnaSequences', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,121-dnaSequences.dnasequence.dnaSequences',
    isRelationship: true,
  },
  {
    path: ['dnaSequences', '#1', 'timestampCreated-fullDate'],
    baseTableName: 'CollectionObject',
    stringId: '1,121-dnaSequences.dnasequence.timestampCreated',
    isRelationship: false,
  },
  {
    path: ['voucherRelationships', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId:
      '1,155-voucherRelationships.voucherrelationship.voucherRelationships',
    isRelationship: true,
  },
  {
    path: ['collection', 'discipline', 'division', 'institution', 'altName'],
    baseTableName: 'CollectionObject',
    stringId: '1,23,26,96,94.institution.altName',
    isRelationship: false,
  },
  {
    path: [
      'collectionObjectCitations',
      '#1',
      'referenceWork',
      'authors',
      '#1',
      '-formatted',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,29-collectionObjectCitations,69,17-authors.author.authors',
    isRelationship: true,
  },
  {
    path: [
      'collectionObjectCitations',
      '#1',
      'referenceWork',
      'journal',
      'journalName',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,29-collectionObjectCitations,69,51.journal.journalName',
    isRelationship: false,
  },
  {
    path: [
      'preparations',
      '#1',
      'giftPreparations',
      '#1',
      'gift',
      'giftNumber',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations,132-giftPreparations,131.gift.giftNumber',
    isRelationship: false,
  },
  {
    path: [
      'preparations',
      '#1',
      'loanPreparations',
      '#1',
      'loan',
      'loanNumber',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations,54-loanPreparations,52.loan.loanNumber',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', 'loanPreparations', '#1', 'isResolved'],
    baseTableName: 'CollectionObject',
    stringId:
      '1,63-preparations,54-loanPreparations.loanpreparation.isResolved',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', 'storage', '$Aisle', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations,58.storage.Aisle',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', 'storage', '$Cabinet', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations,58.storage.Cabinet',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', 'storage', '$-any', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations,58.storage.storage',
    isRelationship: true,
  },
  {
    path: ['preparations', '#1', 'prepType', 'name'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations,65.preptype.name',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', 'countAmt'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations.preparation.countAmt',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations.preparation.preparations',
    isRelationship: true,
  },
  {
    path: ['preparations', '#1', 'remarks'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations.preparation.remarks',
    isRelationship: false,
  },
  {
    path: ['preparations', '#1', 'sampleNumber'],
    baseTableName: 'CollectionObject',
    stringId: '1,63-preparations.preparation.sampleNumber',
    isRelationship: false,
  },
  {
    path: ['projects', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,66-projects.project.projects',
    isRelationship: true,
  },
  {
    path: ['determinations', '#1', 'taxon', '$-any', 'definitionItem', 'name'],
    baseTableName: 'CollectionObject',
    stringId: '1,9-determinations,4,77-definitionItem.taxontreedefitem.name',
    isRelationship: false,
  },
  {
    path: ['determinations', '#1', 'preferredTaxon', '$Class', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,9-determinations,4-preferredTaxon.taxon.Class',
    isRelationship: false,
  },
  {
    path: ['determinations', '#1', 'preferredTaxon', '$-any', 'author'],
    baseTableName: 'CollectionObject',
    stringId: '1,9-determinations,4-preferredTaxon.taxon.author',
    isRelationship: false,
  },
  {
    path: ['determinations', '#1', 'preferredTaxon', '$-any', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,9-determinations,4-preferredTaxon.taxon.fullName',
    isRelationship: false,
  },
  {
    path: ['determinations', '#1', 'taxon', '$-any', 'commonName'],
    baseTableName: 'CollectionObject',
    stringId: '1,9-determinations,4.taxon.commonName',
    isRelationship: false,
  },
  {
    path: ['determinations', '#1', 'taxon', '$-any', 'fullName'],
    baseTableName: 'CollectionObject',
    stringId: '1,9-determinations,4.taxon.fullName',
    isRelationship: false,
  },
  {
    path: ['leftSideRels', '#1', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId: '1,99-leftSideRels.collectionrelationship.leftSideRels',
    isRelationship: true,
  },
  {
    path: ['rightSideRels', '#1', 'leftSide', 'collectingEvent', '-formatted'],
    baseTableName: 'CollectionObject',
    stringId:
      '1,99-rightSideRels,1-leftSide,10.collectingevent.collectingEvent',
    isRelationship: true,
  },
  {
    path: [
      'rightSideRels',
      '#1',
      'leftSide',
      'preparations',
      '#1',
      'prepType',
      'name',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide,63-preparations,65.preptype.name',
    isRelationship: false,
  },
  {
    path: ['rightSideRels', '#1', 'leftSide', 'preparations', '#1', 'text2'],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide,63-preparations.preparation.text2',
    isRelationship: false,
  },
  {
    path: [
      'rightSideRels',
      '#1',
      'leftSide',
      'determinations',
      '#1',
      'taxon',
      '$Family',
      'fullName',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide,9-determinations,4.taxon.Family',
    isRelationship: false,
  },
  {
    path: [
      'rightSideRels',
      '#1',
      'leftSide',
      'determinations',
      '#1',
      'taxon',
      '$Genus',
      'fullName',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide,9-determinations,4.taxon.Genus',
    isRelationship: false,
  },
  {
    path: [
      'rightSideRels',
      '#1',
      'leftSide',
      'determinations',
      '#1',
      'taxon',
      '$Species',
      'fullName',
    ],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide,9-determinations,4.taxon.Species',
    isRelationship: false,
  },
  {
    path: [
      'rightSideRels',
      '#1',
      'leftSide',
      'determinations',
      '#1',
      'isCurrent',
    ],
    baseTableName: 'CollectionObject',
    stringId:
      '1,99-rightSideRels,1-leftSide,9-determinations.determination.isCurrent',
    isRelationship: false,
  },
  {
    path: ['rightSideRels', '#1', 'leftSide', 'catalogNumber'],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide.collectionobject.catalogNumber',
    isRelationship: false,
  },
  {
    path: ['rightSideRels', '#1', 'leftSide', 'guid'],
    baseTableName: 'CollectionObject',
    stringId: '1,99-rightSideRels,1-leftSide.collectionobject.guid',
    isRelationship: false,
  },
  {
    path: ['timestampModified-fullDate'],
    baseTableName: 'CollectionObject',
    stringId: '1.collectionobject.timestampModified',
    isRelationship: false,
  },
  {
    path: [
      'collectingEventAttachments',
      '#1',
      'attachment',
      'attachmentLocation',
    ],
    baseTableName: 'CollectingEvent',
    stringId:
      '10,110-collectingEventAttachments,41.attachment.attachmentLocation',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'locality',
      'localityDetails',
      '#1',
      'drainage',
    ],
    baseTableName: 'Gift',
    stringId:
      '131,132-giftPreparations,63,1,10,2,124-localityDetails.localitydetail.drainage',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'locality',
      'geography',
      '$Continent',
      'fullName',
    ],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63,1,10,2,3.geography.Continent',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'locality',
      'geography',
      '$-any',
      'fullName',
    ],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63,1,10,2,3.geography.fullName',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'startDate-fullDate',
    ],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63,1,10.collectingevent.startDate',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'catalogedDate-year',
    ],
    baseTableName: 'Gift',
    stringId:
      '131,132-giftPreparations,63,1.collectionobject.catalogedDateNumericYear',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'fieldNumber',
    ],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63,1.collectionobject.fieldNumber',
    isRelationship: false,
  },
  {
    path: [
      'giftPreparations',
      '#1',
      'preparation',
      'loanPreparations',
      '#1',
      'outComments',
    ],
    baseTableName: 'Gift',
    stringId:
      '131,132-giftPreparations,63,54-loanPreparations.loanpreparation.outComments',
    isRelationship: false,
  },
  {
    path: ['giftPreparations', '#1', 'preparation', 'prepType', 'name'],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63,65.preptype.name',
    isRelationship: false,
  },
  {
    path: ['giftPreparations', '#1', 'preparation', 'prepType', '-formatted'],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63,65.preptype.prepType',
    isRelationship: true,
  },
  {
    path: ['giftPreparations', '#1', 'preparation', 'countAmt'],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations,63.preparation.countAmt',
    isRelationship: false,
  },
  {
    path: ['giftPreparations', '#1', 'quantity'],
    baseTableName: 'Gift',
    stringId: '131,132-giftPreparations.giftpreparation.quantity',
    isRelationship: false,
  },
  {
    path: ['giftAgents', '#1', 'agent', 'addresses', '#1', 'address'],
    baseTableName: 'Gift',
    stringId: '131,133-giftAgents,5,8-addresses.address.address',
    isRelationship: false,
  },
  {
    path: ['shipments', '#1', 'shippedTo', 'addresses', '#1', 'postalCode'],
    baseTableName: 'Gift',
    stringId: '131,71-shipments,5-shippedTo,8-addresses.address.postalCode',
    isRelationship: false,
  },
  {
    path: ['shipments', '#1', 'shipmentDate-month'],
    baseTableName: 'Gift',
    stringId: '131,71-shipments.shipment.shipmentDateNumericMonth',
    isRelationship: false,
  },
  {
    path: ['giftDate-fullDate'],
    baseTableName: 'Gift',
    stringId: '131.gift.giftDate',
    isRelationship: false,
  },
  {
    path: ['giftDate-day'],
    baseTableName: 'Gift',
    stringId: '131.gift.giftDateNumericDay',
    isRelationship: false,
  },
  {
    path: ['giftDate-month'],
    baseTableName: 'Gift',
    stringId: '131.gift.giftDateNumericMonth',
    isRelationship: false,
  },
  {
    path: ['giftDate-year'],
    baseTableName: 'Gift',
    stringId: '131.gift.giftDateNumericYear',
    isRelationship: false,
  },
  {
    path: ['shipments', '#1', 'shippedTo', 'addresses', '#1', 'roomOrBuilding'],
    baseTableName: 'Borrow',
    stringId: '18,71-shipments,5-shippedTo,8-addresses.address.roomOrBuilding',
    isRelationship: false,
  },
  {
    path: ['$-any', 'definitionItem', 'name'],
    baseTableName: 'Taxon',
    stringId: '4,77-definitionItem.taxontreedefitem.name',
    isRelationship: false,
  },
  {
    path: [
      '$-any',
      'determinations',
      '#1',
      'collectionObject',
      'catalogNumber',
    ],
    baseTableName: 'Taxon',
    stringId: '4,9-determinations,1.collectionobject.catalogNumber',
    isRelationship: false,
  },
  {
    path: ['$-any', 'determinations', '#1', 'isCurrent'],
    baseTableName: 'Taxon',
    stringId: '4,9-determinations.determination.isCurrent',
    isRelationship: false,
  },
  {
    path: ['$-any', '-formatted'],
    baseTableName: 'Taxon',
    stringId: '4.taxon.',
    isRelationship: false,
  },
  {
    path: ['$Species', '-formatted'],
    baseTableName: 'Taxon',
    stringId: '4.taxon.Species',
    isRelationship: false,
  },
  {
    path: ['$-any', 'author'],
    baseTableName: 'Taxon',
    stringId: '4.taxon.author',
    isRelationship: false,
  },
  {
    path: ['$-any', 'fullName'],
    baseTableName: 'Taxon',
    stringId: '4.taxon.fullName',
    isRelationship: false,
  },
  {
    path: ['$-any', 'taxonId'],
    baseTableName: 'Taxon',
    stringId: '4.taxon.taxonId',
    isRelationship: false,
  },
  {
    path: ['loanAgents', '#1', 'agent', 'lastName'],
    baseTableName: 'Loan',
    stringId: '52,53-loanAgents,5.agent.lastName',
    isRelationship: false,
  },
  {
    path: ['loanAgents', '#1', '-formatted'],
    baseTableName: 'Loan',
    stringId: '52,53-loanAgents.loanagent.loanAgents',
    isRelationship: true,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'locality',
      'localityDetails',
      '#1',
      'drainage',
    ],
    baseTableName: 'Loan',
    stringId:
      '52,54-loanPreparations,63,1,10,2,124-localityDetails.localitydetail.drainage',
    isRelationship: false,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'locality',
      'geography',
      '$Continent',
      'fullName',
    ],
    baseTableName: 'Loan',
    stringId: '52,54-loanPreparations,63,1,10,2,3.geography.Continent',
    isRelationship: false,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'collectingEvent',
      'locality',
      '-formatted',
    ],
    baseTableName: 'Loan',
    stringId: '52,54-loanPreparations,63,1,10,2.locality.locality',
    isRelationship: true,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'determinations',
      '#1',
      'preferredTaxon',
      '$Family',
      'fullName',
    ],
    baseTableName: 'Loan',
    stringId:
      '52,54-loanPreparations,63,1,9-determinations,4-preferredTaxon.taxon.Family',
    isRelationship: false,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'determinations',
      '#1',
      'preferredTaxon',
      '$-any',
      'fullName',
    ],
    baseTableName: 'Loan',
    stringId:
      '52,54-loanPreparations,63,1,9-determinations,4-preferredTaxon.taxon.fullName',
    isRelationship: false,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'determinations',
      '#1',
      'taxon',
      '$-any',
      'fullName',
    ],
    baseTableName: 'Loan',
    stringId: '52,54-loanPreparations,63,1,9-determinations,4.taxon.fullName',
    isRelationship: false,
  },
  {
    path: [
      'loanPreparations',
      '#1',
      'preparation',
      'collectionObject',
      'determinations',
      '#1',
      'taxon',
      '$Genus',
      'fullName',
    ],
    baseTableName: 'Loan',
    stringId: '52,54-loanPreparations,63,1,9-determinations,4.taxon.Genus',
    isRelationship: false,
  },
];

describe('Query Field Spec', () =>
  void runs.map(({ baseTableName, path, stringId, isRelationship }) =>
    describe([baseTableName, ...path].join(' > '), () => {
      test('Mapping path to string id and back', () => {
        const spec = QueryFieldSpec.fromPath(baseTableName, path);
        const result = spec.toSpQueryAttributes();
        expect(result.stringId).toBe(stringId);
        expect(result.isRelFld).toBe(isRelationship);
        expect(spec.baseTable.name).toBe(baseTableName);
      });
      test('String it to mapping path and back', () => {
        const spec = QueryFieldSpec.fromStringId(stringId, isRelationship);
        expect(spec.baseTable.name).toBe(baseTableName);
        const path = spec.toMappingPath();
        expect(path).toEqual(path);
      });
    })
  ));
