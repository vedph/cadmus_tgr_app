import { HistoricalDate, Part } from '@myrmidon/cadmus-core';
import { MsLocation, PhysicalSize } from '@myrmidon/cadmus-itinera-core';

export interface MsPalimpsest {
  locations?: MsLocation[];
  date?: HistoricalDate;
  note?: string;
}

export interface MsWatermark {
  value: string;
  description: string;
}

export interface MsGuardSheet {
  isBack?: boolean;
  material?: string;
  watermarks?: MsWatermark[];
  note?: string;
}

export interface MsRuling {
  manner: string;
  system: string;
  type?: string;
  description?: string;
}

export interface MsUnit {
  start: MsLocation;
  end: MsLocation;
  material: string;
  sheetCount: number;
  guardSheetCount: number;
  groupId?: string;
  groupOrdinal?: number;
  quires?: string;
  sheetNumbering?: string;
  quireNumbering?: string;
  state?: string;
  binding?: string;
  palimpsests?: MsPalimpsest[];
  guardSheets?: MsGuardSheet[];
  leafSizes?: PhysicalSize[];
  writtenAreaSize?: PhysicalSize;
  rulings?: MsRuling[];
  watermarks?: MsWatermark[];
}

/**
 * The MsUnits part model.
 */
export interface MsUnitsPart extends Part {
  units: MsUnit[];
}

/**
 * The type ID used to identify the MsUnitsPart type.
 */
export const MSUNITS_PART_TYPEID = 'it.vedph.tgr.ms-units';

/**
 * JSON schema for the MsUnits part. This is used in the editor demo.
 * You can use the JSON schema tool at https://jsonschema.net/.
 */
export const MSUNITS_PART_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id:
    'www.vedph.it/cadmus/parts/tgr/ms/' +
    MSUNITS_PART_TYPEID +
    '.json',
  type: 'object',
  title: 'MsUnitsPart',
  required: [
    'id',
    'itemId',
    'typeId',
    'timeCreated',
    'creatorId',
    'timeModified',
    'userId',
    // TODO: add other required properties here...
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

    // TODO: add properties and fill the "required" array as needed
  },
};
