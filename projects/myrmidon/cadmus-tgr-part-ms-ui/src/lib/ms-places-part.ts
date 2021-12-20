import { Part } from '@myrmidon/cadmus-core';
import { DocReference } from '@myrmidon/cadmus-refs-doc-references';

/**
 * A place of origin for a manuscript.
 */
export interface MsPlace {
  area: string;
  address?: string;
  city?: string;
  site?: string;
  rank?: number;
  sources?: DocReference[];
}

/**
 * The manuscript's place(s) of origin part model.
 */
export interface MsPlacesPart extends Part {
  places: MsPlace[];
}

/**
 * The type ID used to identify the MsPlacesPart type.
 */
export const MSPLACES_PART_TYPEID = 'it.vedph.tgr.ms-places';

/**
 * JSON schema for the MsPlaces part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MsPlaces_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'www.vedph.it/cadmus/parts/tgr/ms/' + MSPLACES_PART_TYPEID + '.json',
  type: 'object',
  title: 'MsPlacesPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'places',
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
    places: {
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
              city: {
                type: 'string',
              },
              site: {
                type: 'string',
              },
              rank: {
                type: 'integer',
              },
              sources: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      required: ['citation'],
                      properties: {
                        tag: {
                          type: 'string',
                        },
                        type: {
                          type: 'string',
                        },
                        citation: {
                          type: 'string',
                        },
                        note: {
                          type: 'string',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  },
};
