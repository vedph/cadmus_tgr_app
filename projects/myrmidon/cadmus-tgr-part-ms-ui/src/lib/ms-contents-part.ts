import { Part, DocReference } from '@myrmidon/cadmus-core';
import { MsLocation } from '@myrmidon/cadmus-itinera-core';

export interface MsContent {
  start: MsLocation;
  end: MsLocation;
  work?: string;
  location?: string;
  title?: string;
  incipit: string;
  explicit: string;
  note?: string;
  editions?: DocReference[];
}

/**
 * The manuscript's contents part model.
 */
export interface MsContentsPart extends Part {
  contents: MsContent[];
}

/**
 * The type ID used to identify the MsContentsPart type.
 */
export const MSCONTENTS_PART_TYPEID = 'it.vedph.tgr.ms-contents';

/**
 * JSON schema for the ms contents part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSCONTENTS_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'www.vedph.it/cadmus/parts/tgr/ms/' + MSCONTENTS_PART_TYPEID + '.json',
  type: 'object',
  title: 'MsContentsPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'contents',
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
    contents: {
      $id: '#/properties/contents',
      type: 'array',
      title: 'The contents schema',
      description: 'An explanation about the purpose of this instance.',
      default: [],
      examples: [
        [
          {
            start: {},
            end: {},
            work: '',
            location: '',
            title: '',
            incipit: '',
            explicit: '',
            note: '',
            editions: [{}],
          },
        ],
      ],
      additionalItems: true,
      items: {
        $id: '#/properties/contents/items',
        anyOf: [
          {
            $id: '#/properties/contents/items/anyOf/0',
            type: 'object',
            title: 'The first anyOf schema',
            description: 'An explanation about the purpose of this instance.',
            default: {},
            examples: [
              {
                start: {},
                end: {},
                work: '',
                location: '',
                title: '',
                incipit: '',
                explicit: '',
                note: '',
                editions: [{}],
              },
            ],
            required: [
              'start',
              'end',
              'work',
              'location',
              'title',
              'incipit',
              'explicit',
              'note',
              'editions',
            ],
            properties: {
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
              work: {
                type: 'string',
              },
              location: {
                type: 'string',
              },
              title: {
                type: 'string',
              },
              incipit: {
                type: 'string',
              },
              explicit: {
                type: 'string',
              },
              note: {
                type: 'string',
              },
              sources: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      required: ['author', 'work'],
                      properties: {
                        tag: {
                          type: 'string',
                        },
                        author: {
                          type: 'string',
                        },
                        work: {
                          type: 'string',
                        },
                        location: {
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
