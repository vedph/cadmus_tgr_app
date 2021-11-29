import { HistoricalDateModel, Part, PhysicalSize } from '@myrmidon/cadmus-core';
import { MsLocation } from '@myrmidon/cadmus-tgr-core';

export interface MsPalimpsest {
  locations?: MsLocation[];
  date?: HistoricalDateModel;
  note?: string;
}

export interface MsWatermark {
  value: string;
  description: string;
}

export interface MsGuardSheet {
  isBack?: boolean;
  material?: string;
  note?: string;
  watermarks?: MsWatermark[];
}

export interface MsRuling {
  manner: string;
  system: string;
  type?: string;
  description?: string;
}

export interface MsUnit {
  start?: MsLocation | null;
  end?: MsLocation | null;
  material?: string | null;
  guardSheetMaterial?: string;
  sheetCount: number;
  guardSheetCount: number;
  backGuardSheetCount: number;
  groupId?: string;
  groupOrdinal?: number;
  date?: HistoricalDateModel;
  quires?: string;
  sheetNumbering?: string;
  quireNumbering?: string;
  state?: string;
  binding?: string;
  palimpsests?: MsPalimpsest[];
  guardSheets?: MsGuardSheet[];
  leafSizes?: PhysicalSize[];
  leafSizeSamples?: MsLocation[];
  writtenAreaSizes?: PhysicalSize[];
  writtenAreaSizeSamples?: MsLocation[];
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
  $id: 'www.vedph.it/cadmus/parts/tgr/ms/' + MSUNITS_PART_TYPEID + '.json',
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
    'start',
    'end',
    'material',
    'sheetCount',
    'guardSheetCount',
    'backGuardSheetCount',
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
    material: {
      type: 'string',
    },
    guardSheetMaterial: {
      type: 'string',
    },
    sheetCount: {
      type: 'integer',
    },
    guardSheetCount: {
      type: 'integer',
    },
    backGuardSheetCount: {
      type: 'integer',
    },
    groupId: {
      type: 'string',
    },
    groupOrdinal: {
      type: 'integer',
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
    quires: {
      type: 'string',
    },
    sheetNumbering: {
      type: 'string',
    },
    quireNumbering: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    binding: {
      type: 'string',
    },
    palimpsests: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: [],
            properties: {
              locations: {
                type: 'array',
                items: {
                  anyOf: [
                    {
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
                  ],
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
              note: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
    guardSheets: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: [],
            properties: {
              isBack: {
                type: 'boolean',
              },
              material: {
                type: 'string',
              },
              note: {
                type: 'string',
              },
              watermarks: {
                type: 'array',
                items: {
                  anyOf: [
                    {
                      type: 'object',
                      required: ['value', 'description'],
                      properties: {
                        value: {
                          type: 'string',
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
          },
        ],
      },
    },
    leafSizes: {
      type: 'array',
      items: {
        anyOf: [
          {
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
        ],
      },
    },
    leafSizeSamples: {
      type: 'array',
      items: {
        anyOf: [
          {
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
        ],
      },
    },
    writtenAreaSizes: {
      type: 'array',
      items: {
        anyOf: [
          {
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
        ],
      },
    },
    writtenAreaSizeSamples: {
      type: 'array',
      items: {
        anyOf: [
          {
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
        ],
      },
    },
    rulings: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['manner', 'system'],
            properties: {
              manner: {
                type: 'string',
              },
              system: {
                type: 'string',
              },
              type: {
                type: 'string',
              },
              description: {
                type: 'string',
              },
            },
          },
        ],
      },
    },
    watermarks: {
      type: 'array',
      items: {
        anyOf: [
          {
            type: 'object',
            required: ['value', 'description'],
            properties: {
              value: {
                type: 'string',
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
