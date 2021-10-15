import { Part } from '@myrmidon/cadmus-core';

/**
 * A manuscript's signature.
 */
 export interface MsSignature {
  tag?: string;
  city: string;
  library: string;
  fund?: string;
  location: string;
}

/**
 * The manuscript's signatures part model.
 */
export interface MsSignaturesPart extends Part {
  signatures: MsSignature[];
}

/**
 * The type ID used to identify the MsSignaturesPart type.
 */
export const MSSIGNATURES_PART_TYPEID = 'it.vedph.tgr.ms-signatures';

/**
 * JSON schema for the MsSignatures part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSSIGNATURES_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/parts/tgr/ms/' +
    MSSIGNATURES_PART_TYPEID +
    '.json',
  type: 'object',
  title: 'MsSignaturesPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    'signatures',
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
    signatures: {
      type: 'array',
      items: {
        $id: '#/properties/signatures/items',
        anyOf: [
          {
            type: 'object',
            required: ['city', 'library', 'location'],
            properties: {
              tag: {
                type: 'string',
              },
              city: {
                type: 'string',
              },
              library: {
                type: 'string',
              },
              fund: {
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
  },
};
