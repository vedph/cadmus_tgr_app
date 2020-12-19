import {
  CATEGORIES_PART_TYPEID,
  HISTORICAL_DATE_PART_TYPEID,
  KEYWORDS_PART_TYPEID,
  INDEX_KEYWORDS_PART_TYPEID,
  NOTE_PART_TYPEID,
  TOKEN_TEXT_PART_TYPEID,
  // TILED_TEXT_PART_TYPEID,
  COMMENT_FRAGMENT_TYPEID,
  BIBLIOGRAPHY_PART_TYPEID,
  CHRONOLOGY_FRAGMENT_TYPEID,
} from '@myrmidon/cadmus-part-general-ui';
import {
  APPARATUS_FRAGMENT_TYPEID,
  ORTHOGRAPHY_FRAGMENT_TYPEID,
  QUOTATIONS_FRAGMENT_TYPEID,
} from '@myrmidon/cadmus-part-philology-ui';
import { PartEditorKeys } from '@myrmidon/cadmus-core';
import { LING_TAGS_FRAGMENT_TYPEID } from '@myrmidon/cadmus-tgr-part-gr-ui';
import {
  MSPLACE_PART_TYPEID,
  MSSIGNATURES_PART_TYPEID,
} from '@myrmidon/cadmus-itinera-part-ms-ui';
import {
  MSCONTENTS_PART_TYPEID,
  MSSCRIPTS_PART_TYPEID,
  MSUNITS_PART_TYPEID,
} from '@myrmidon/cadmus-tgr-part-ms-ui';

const GENERAL = 'general';
const PHILOLOGY = 'philology';
const ITINERA_MS = 'itinera-ms';
const TGR_GR = 'tgr-gr';
const TGR_MS = 'tgr-ms';
const TOKEN_TEXT_LAYER_PART_TYPEID = 'it.vedph.token-text-layer';

/**
 * The parts and fragments editor keys for this UI.
 * Each property is a part type ID, mapped to a value of type PartGroupKey,
 * having a part property with the part's editor key, and a fragments property
 * with the mappings between fragment type IDs and their editor keys.
 */
export const PART_EDITOR_KEYS: PartEditorKeys = {
  [BIBLIOGRAPHY_PART_TYPEID]: {
    part: GENERAL,
  },
  [CATEGORIES_PART_TYPEID]: {
    part: GENERAL,
  },
  [HISTORICAL_DATE_PART_TYPEID]: {
    part: GENERAL,
  },
  [INDEX_KEYWORDS_PART_TYPEID]: {
    part: GENERAL,
  },
  [KEYWORDS_PART_TYPEID]: {
    part: GENERAL,
  },
  [NOTE_PART_TYPEID]: {
    part: GENERAL,
  },
  // [TILED_TEXT_PART_TYPEID]: {
  //   part: GENERAL,
  // },
  [TOKEN_TEXT_PART_TYPEID]: {
    part: GENERAL,
  },
  [MSSIGNATURES_PART_TYPEID]: {
    part: ITINERA_MS,
  },
  [MSPLACE_PART_TYPEID]: {
    part: ITINERA_MS,
  },
  [MSCONTENTS_PART_TYPEID]: {
    part: TGR_MS,
  },
  [MSUNITS_PART_TYPEID]: {
    part: TGR_MS,
  },
  [MSSCRIPTS_PART_TYPEID]: {
    part: TGR_MS,
  },
  // layer parts
  [TOKEN_TEXT_LAYER_PART_TYPEID]: {
    part: GENERAL,
    fragments: {
      [CHRONOLOGY_FRAGMENT_TYPEID]: GENERAL,
      [COMMENT_FRAGMENT_TYPEID]: GENERAL,
      [APPARATUS_FRAGMENT_TYPEID]: PHILOLOGY,
      [ORTHOGRAPHY_FRAGMENT_TYPEID]: PHILOLOGY,
      [QUOTATIONS_FRAGMENT_TYPEID]: PHILOLOGY,
      [LING_TAGS_FRAGMENT_TYPEID]: TGR_GR,
    },
  },
  // [TILED_TEXT_LAYER_PART_TYPEID]: {
  //   part: GENERAL,
  //   fragments: {
  //     [CHRONOLOGY_FRAGMENT_TYPEID]: GENERAL,
  //     [COMMENT_FRAGMENT_TYPEID]: GENERAL,
  //     [APPARATUS_FRAGMENT_TYPEID]: PHILOLOGY,
  //     [ORTHOGRAPHY_FRAGMENT_TYPEID]: PHILOLOGY,
  //     [QUOTATIONS_FRAGMENT_TYPEID]: PHILOLOGY,
  //   },
  // },
};
