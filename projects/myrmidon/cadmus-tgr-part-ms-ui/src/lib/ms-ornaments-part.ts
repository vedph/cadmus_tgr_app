import { Part, PhysicalSize } from '@myrmidon/cadmus-core';
import { MsLocation } from '@myrmidon/cadmus-itinera-core';

/**
 * A manuscript's ornamentation.
 */
export interface MsOrnament {
  type: string;
  start: MsLocation;
  end: MsLocation;
  size?: PhysicalSize;
  description?: string;
}

/**
 * The manuscript's ornamentations part model.
 */
export interface MsOrnamentsPart extends Part {
  ornaments: MsOrnament[];
}

/**
 * The type ID used to identify the MsOrnamentsPart type.
 */
export const MSORNAMENTS_PART_TYPEID = 'it.vedph.tgr.ms-ornaments';

/**
 * JSON schema for the MsOrnaments part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSORNAMENTS_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'www.vedph.it/cadmus/parts/tgr/ms/' + MSORNAMENTS_PART_TYPEID + '.json',
  type: 'object',
  title: 'MsOrnamentsPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'ornaments',
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
    ornaments: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['type', 'start', 'end'],
            properties: {
              type: {
                type: 'string',
              },
              start: {
                type: 'object',
                required: ['n'],
                properties: {
                  n: {
                    type: 'integer',
                  },
                  r: {
                    type: 'boolean'
                  },
                  s: {
                    type: 'string',
                  },
                  l: {
                    type: 'integer',
                  },
                },
              },
              end: {
                type: 'object',
                required: ['n'],
                properties: {
                  n: {
                    type: 'integer',
                  },
                  r: {
                    type: 'boolean'
                  },
                  s: {
                    type: 'string',
                  },
                  l: {
                    type: 'integer',
                  },
                },
              },
              size: {
                type: 'object',
                required: [],
                properties: {
                  tag: {
                    type: 'string',
                  },
                  w: {
                    type: 'object',
                    required: ['value', 'unit'],
                    properties: {
                      tag: {
                        type: 'string',
                      },
                      value: {
                        type: 'number',
                      },
                      unit: {
                        type: 'string',
                      },
                    },
                  },
                  d: {
                    type: 'object',
                    required: ['value', 'unit'],
                    properties: {
                      tag: {
                        type: 'string',
                      },
                      value: {
                        type: 'number',
                      },
                      unit: {
                        type: 'string',
                      },
                    },
                  },
                  h: {
                    type: 'object',
                    required: ['value', 'unit'],
                    properties: {
                      tag: {
                        type: 'string',
                      },
                      value: {
                        type: 'number',
                      },
                      unit: {
                        type: 'string',
                      },
                    },
                  },
                  note: {
                    type: 'string',
                  },
                },
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
