import { Fragment } from '@myrmidon/cadmus-core';
import { AvailableWitness } from './available-witnesses-part';

/**
 * The AvailableWitnesses layer fragment server model.
 */
export interface AvailableWitnessesFragment extends Fragment {
  witnesses: AvailableWitness[];
}

export const AVAILABLE_WITNESSES_FRAGMENT_TYPEID =
  'fr.it.vedph.tgr.available-witnesses';

export const AVAILABLE_WITNESSES_FRAGMENT_SCHEMA = {
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/fragments/tgr/gr/' +
    AVAILABLE_WITNESSES_FRAGMENT_TYPEID +
    '.json',
  type: 'object',
  title: 'AvailableWitnessesFragment',
  required: ['location', 'witnesses'],
  properties: {
    location: {
      $id: '#/properties/location',
      type: 'string',
    },
    baseText: {
      $id: '#/properties/baseText',
      type: 'string',
    },
    witnesses: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['id'],
            properties: {
              id: {
                type: 'string',
              },
              isPartial: {
                type: 'boolean',
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
};
