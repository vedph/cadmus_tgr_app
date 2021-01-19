import { HistoricalDateModel, Part } from '@myrmidon/cadmus-core';
import { MsLocation } from '@myrmidon/cadmus-itinera-core';

/**
 * A letter's description in a MsHand.
 */
export interface MsHandLetter {
  letter: string;
  description: string;
  imageId?: string;
}

/**
 * A hand in a MsScript.
 */
export interface MsHand {
  id: string;
  start: MsLocation;
  end: MsLocation;
  date?: HistoricalDateModel;
  description?: string;
  abbreviations?: string;
  letters?: MsHandLetter[];
}

/**
 * A script in a MsScriptsPart.
 */
export interface MsScript {
  role: string;
  languages: string[];
  type?: string;
  hands?: MsHand[];
}

/**
 * The manuscript's scripts part model.
 */
export interface MsScriptsPart extends Part {
  scripts: MsScript[];
}

/**
 * The type ID used to identify the MsScriptsPart type.
 */
export const MSSCRIPTS_PART_TYPEID = 'it.vedph.tgr.ms-scripts';

/**
 * JSON schema for the MsScripts part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSSCRIPTS_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'www.vedph.it/cadmus/parts/tgr/ms/' + MSSCRIPTS_PART_TYPEID + '.json',
  type: 'object',
  title: 'MsScriptsPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'scripts',
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
    scripts: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['role', 'language'],
            properties: {
              role: {
                type: 'string',
              },
              languages: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'string',
                    },
                  ],
                },
              },
              type: {
                type: 'string',
              },
              hands: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      required: ['id', 'start', 'end', 'description'],
                      properties: {
                        id: {
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
                              type: 'boolean',
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
                              type: 'boolean',
                            },
                            s: {
                              type: 'string',
                            },
                            l: {
                              type: 'integer',
                            },
                          },
                        },
                        date: {
                          type: 'object',
                          required: ['a'],
                          properties: {
                            a: {
                              type: 'object',
                              required: ['value'],
                              properties: {
                                value: {
                                  type: 'integer',
                                },
                                isCentury: {
                                  type: 'boolean',
                                },
                                isSpan: {
                                  type: 'boolean',
                                },
                                isApproximate: {
                                  type: 'boolean',
                                },
                                isDubious: {
                                  type: 'boolean',
                                },
                                day: {
                                  type: 'integer',
                                },
                                month: {
                                  type: 'integer',
                                },
                                hint: {
                                  type: ['string', 'null'],
                                },
                              },
                            },
                            b: {
                              type: 'object',
                              required: ['value'],
                              properties: {
                                value: {
                                  type: 'integer',
                                },
                                isCentury: {
                                  type: 'boolean',
                                },
                                isSpan: {
                                  type: 'boolean',
                                },
                                isApproximate: {
                                  type: 'boolean',
                                },
                                isDubious: {
                                  type: 'boolean',
                                },
                                day: {
                                  type: 'integer',
                                },
                                month: {
                                  type: 'integer',
                                },
                                hint: {
                                  type: ['string', 'null'],
                                },
                              },
                            },
                          },
                        },
                        description: {
                          type: 'string',
                        },
                        abbreviations: {
                          type: 'string',
                        },
                        letters: {
                          type: 'array',
                          items: {
                            anyOf: [
                              {
                                type: 'object',
                                required: ['letter', 'description'],
                                properties: {
                                  letter: {
                                    type: 'string',
                                  },
                                  description: {
                                    type: 'string',
                                  },
                                  imageId: {
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
          },
        ],
      },
    },
  },
};
