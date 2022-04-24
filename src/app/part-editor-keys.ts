import {
  CATEGORIES_PART_TYPEID,
  HISTORICAL_DATE_PART_TYPEID,
  KEYWORDS_PART_TYPEID,
  INDEX_KEYWORDS_PART_TYPEID,
  NOTE_PART_TYPEID,
  TOKEN_TEXT_PART_TYPEID,
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
import {
  LING_TAGS_FRAGMENT_TYPEID,
  VAR_QUOTATIONS_FRAGMENT_TYPEID,
  INTERPOLATIONS_FRAGMENT_TYPEID,
  AVAILABLE_WITNESSES_PART_TYPEID,
  AVAILABLE_WITNESSES_FRAGMENT_TYPEID,
} from '@myrmidon/cadmus-tgr-part-gr-ui';
import {
  MSCONTENTS_PART_TYPEID,
  MSFORMAL_FEATURES_PART_TYPEID,
  MSHISTORY_PART_TYPEID,
  MSORNAMENTS_PART_TYPEID,
  MSPLACES_PART_TYPEID,
  MSSCRIPTS_PART_TYPEID,
  MSSIGNATURES_PART_TYPEID,
  MSUNITS_PART_TYPEID,
} from '@myrmidon/cadmus-tgr-part-ms-ui';

const GENERAL = 'general';
const PHILOLOGY = 'philology';
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
  [TOKEN_TEXT_PART_TYPEID]: {
    part: GENERAL,
  },
  [AVAILABLE_WITNESSES_PART_TYPEID]: {
    part: TGR_GR,
  },
  [MSSIGNATURES_PART_TYPEID]: {
    part: TGR_MS,
  },
  [MSPLACES_PART_TYPEID]: {
    part: TGR_MS,
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
  [MSFORMAL_FEATURES_PART_TYPEID]: {
    part: TGR_MS,
  },
  [MSHISTORY_PART_TYPEID]: {
    part: TGR_MS,
  },
  [MSORNAMENTS_PART_TYPEID]: {
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
      [VAR_QUOTATIONS_FRAGMENT_TYPEID]: TGR_GR,
      [INTERPOLATIONS_FRAGMENT_TYPEID]: TGR_GR,
      [LING_TAGS_FRAGMENT_TYPEID]: TGR_GR,
      [AVAILABLE_WITNESSES_FRAGMENT_TYPEID]: TGR_GR,
    },
  },
};
