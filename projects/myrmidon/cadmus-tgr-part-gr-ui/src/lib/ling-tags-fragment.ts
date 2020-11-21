import { Fragment } from '@myrmidon/cadmus-core';
import { LingTaggedForm } from '@myrmidon/cadmus-tgr-core';

/**
 * The linguistic tags layer fragment server model.
 */
export interface LingTagsFragment extends Fragment {
  forms: LingTaggedForm[];
}

export const LING_TAGS_FRAGMENT_TYPEID = 'fr.it.vedph.tgr.ling-tags';

export const LING_TAGS_FRAGMENT_SCHEMA = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/fragments/tgr/' + LING_TAGS_FRAGMENT_TYPEID + '.json',
  type: 'object',
  title: 'LingTagsFragment',
  required: ['location', 'forms'],
  properties: {
    location: {
      $id: '#/properties/location',
      type: 'string',
    },
    baseText: {
      $id: '#/properties/baseText',
      type: 'string',
    },
    forms: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['tags'],
            properties: {
              lemmata: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'string',
                    },
                  ],
                },
              },
              isDubious: {
                type: 'boolean',
              },
              note: {
                type: 'string',
              },
              tags: {
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
                        notes: {
                          type: 'array',
                          items: {
                            anyOf: [
                              {
                                type: 'object',
                                required: ['tag', 'note'],
                                properties: {
                                  tag: {
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
