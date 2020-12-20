import { Part } from '@myrmidon/cadmus-core';

/**
 * A writing formal feature in a manuscript.
 */
export interface MsFormalFeature {
  handId: string;
  description: string;
}

/**
 * The manuscript's formal features part model.
 */
export interface MsFormalFeaturesPart extends Part {
  features: MsFormalFeature[];
}

/**
 * The type ID used to identify the MsFormalFeaturesPart type.
 */
export const MSFORMAL_FEATURES_PART_TYPEID = 'it.vedph.tgr.ms-formal-features';

/**
 * JSON schema for the MsFormalFeatures part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSFORMAL_FEATURES_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/parts/tgr/ms/' +
    MSFORMAL_FEATURES_PART_TYPEID +
    '.json',
  type: 'object',
  title: 'MsFormalFeaturesPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'features',
  ],
  properties: {
    timeCreated: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d+Z$',
    },
    creatorId: {
      type: 'string',
    },
    timeModified: {
      type: 'string',
      pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d+Z$',
    },
    userId: {
      type: 'string',
    },
    id: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
    itemId: {
      type: 'string',
      pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
    },
    typeId: {
      type: 'string',
      pattern: '^[a-z][-0-9a-z._]*$',
    },
    roleId: {
      type: ['string', 'null'],
      pattern: '^([a-z][-0-9a-z._]*)?$',
    },
    features: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['handId', 'description'],
            properties: {
              handId: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
  },
};
