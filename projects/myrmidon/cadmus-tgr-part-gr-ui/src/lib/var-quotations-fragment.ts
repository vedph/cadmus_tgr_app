import { Fragment } from '@myrmidon/cadmus-core';
import {
  AnnotatedValue,
  ApparatusEntryType,
  LocAnnotatedValue,
} from '@myrmidon/cadmus-part-philology-ui';

/**
 * A parallel quotation.
 */
export interface QuotationParallel {
  tag?: string;
  work: string;
  location: string;
  note?: string;
}

/**
 * A quotation's variant.
 */
export interface QuotationVariant {
  lemma: string;
  type: ApparatusEntryType;
  value: string;
  note?: string;
  witnesses?: AnnotatedValue[];
  authors?: LocAnnotatedValue[];
}

/**
 * Quotation with variants.
 */
export interface VarQuotation {
  tag?: string;
  authority: string;
  work: string;
  location: string;
  note?: string;
  parallels?: QuotationParallel[];
  variants?: QuotationVariant[];
}

/**
 * The quotations with variants layer fragment server model.
 */
export interface VarQuotationsFragment extends Fragment {
  quotations: VarQuotation[];
}

export const VAR_QUOTATIONS_FRAGMENT_TYPEID = 'fr.it.vedph.tgr.var-quotations';

export const VAR_QUOTATIONS_FRAGMENT_SCHEMA = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/fragments/tgr/gr/' +
    VAR_QUOTATIONS_FRAGMENT_TYPEID +
    '.json',
  type: 'object',
  title: 'VarQuotationsFragment',
  required: ['location', 'quotations'],
  properties: {
    location: {
      $id: '#/properties/location',
      type: 'string',
    },
    baseText: {
      $id: '#/properties/baseText',
      type: 'string',
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
              note: {
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
                        note: {
                          type: 'string'
                        }
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
                        note: {
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
};
