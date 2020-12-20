import { Part } from '@myrmidon/cadmus-core';
import { GeoAddress, MsLocation } from '@myrmidon/cadmus-itinera-core';

/**
 * A subscription in a MsHistoryPart.
 */
export interface MsSubscription {
  locations: MsLocation[];
  language: string;
  text: string;
  note?: string;
  handId?: string;
}

/**
 * A manuscript's annotation in a MsHistoryPart.
 */
export interface MsAnnotation {
  language: string;
  note?: string;
  handId?: string;
}

/**
 * The manuscript's history part model.
 */
export interface MsHistoryPart extends Part {
  provenances: GeoAddress[];
  history: string;
  owners?: string[];
  subscription?: MsSubscription;
  annotations?: MsAnnotation[];
}

/**
 * The type ID used to identify the MsHistoryPart type.
 */
export const MSHISTORY_PART_TYPEID = 'it.vedph.tgr.ms-history';

/**
 * JSON schema for the MsHistory part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSHISTORY_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'www.vedph.it/cadmus/parts/tgr/ms/' + MSHISTORY_PART_TYPEID + '.json',
  type: 'object',
  title: 'MsHistoryPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'provenances',
    'history',
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
    provenances: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['area'],
            properties: {
              area: {
                type: 'string',
              },
              address: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
    history: {
      type: 'string',
    },
    owners: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'string',
          },
        ],
      },
    },
    subscription: {
      type: 'object',
      required: ['locations', 'language', 'text'],
      properties: {
        locations: {
          type: 'array',
          items: {
            anyOf: [
              {
                type: 'object',
                required: ['n'],
                properties: {
                  n: {
                    type: 'integer',
                  },
                  v: {
                    type: 'string',
                  },
                  l: {
                    type: 'integer',
                  },
                },
              },
            ],
          },
        },
        language: {
          type: 'string',
        },
        text: {
          type: 'string',
        },
        note: {
          type: 'string',
        },
        handId: {
          type: 'string',
        },
      },
    },
    annotations: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['language'],
            properties: {
              language: {
                type: 'string',
              },
              note: {
                type: 'string',
              },
              handId: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
  },
};
