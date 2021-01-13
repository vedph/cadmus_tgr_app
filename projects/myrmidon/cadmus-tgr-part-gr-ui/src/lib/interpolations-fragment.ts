import { Fragment } from '@myrmidon/cadmus-core';
import { ApparatusEntryType } from '@myrmidon/cadmus-part-philology-ui';
import { VarQuotation } from './var-quotations-fragment';

/**
 * Source for a reading in an Interpolation.
 */
export interface ReadingSource {
  witness: string;
  handId?: string;
}

/**
 * An interpolation entry in an InterpolationsFragment.
 */
export interface Interpolation {
  type: ApparatusEntryType;
  role: string;
  tag?: string;
  languages: string[];
  value: string;
  groupId?: string;
  note?: string;
  sources?: ReadingSource[];
  quotations?: VarQuotation[];
}

/**
 * The interpolations layer fragment server model.
 */
export interface InterpolationsFragment extends Fragment {
  interpolations: Interpolation[];
}

export const INTERPOLATIONS_FRAGMENT_TYPEID = 'fr.it.vedph.tgr.interpolations';

export const INTERPOLATIONS_FRAGMENT_SCHEMA = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/fragments/tgr/gr/' + INTERPOLATIONS_FRAGMENT_TYPEID + '.json',
  type: 'object',
  title: 'InterpFragment',
  required: ['location', 'interpolations'],
  properties: {
    location: {
      $id: '#/properties/location',
      type: 'string',
    },
    baseText: {
      $id: '#/properties/baseText',
      type: 'string',
    },
    interpolations: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['type', 'role', 'languages', 'value'],
            properties: {
              type: {
                type: 'string',
              },
              role: {
                type: 'string',
              },
              tag: {
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
              value: {
                type: 'string',
              },
              groupId: {
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
                      required: ['witness'],
                      properties: {
                        witness: {
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
              quotations: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      required: ['authority', 'work', 'location'],
                      properties: {
                        tag: {
                          type: 'string',
                        },
                        authority: {
                          type: 'string',
                        },
                        work: {
                          type: 'string',
                        },
                        location: {
                          type: 'string',
                        },
                        parallels: {
                          type: 'array',
                          items: {
                            anyOf: [
                              {
                                type: 'object',
                                required: ['work', 'location'],
                                properties: {
                                  tag: {
                                    type: 'string',
                                  },
                                  work: {
                                    type: 'string',
                                  },
                                  location: {
                                    type: 'string',
                                  },
                                },
                              },
                            ],
                          },
                        },
                        variants: {
                          type: 'array',
                          items: {
                            anyOf: [
                              {
                                type: 'object',
                                required: ['lemma', 'type', 'value'],
                                properties: {
                                  lemma: {
                                    type: 'string',
                                  },
                                  type: {
                                    type: 'integer',
                                  },
                                  value: {
                                    type: 'string',
                                  },
                                  witnesses: {
                                    type: 'array',
                                    items: {
                                      anyOf: [
                                        {
                                          type: 'object',
                                          required: ['value'],
                                          properties: {
                                            value: {
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
                                  authors: {
                                    type: 'array',
                                    items: {
                                      anyOf: [
                                        {
                                          type: 'object',
                                          required: ['value'],
                                          properties: {
                                            tag: {
                                              type: 'string',
                                            },
                                            value: {
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
