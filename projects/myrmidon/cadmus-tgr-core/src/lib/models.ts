/**
 * A tagged note used in AnnotatedTag.
 */
export interface TaggedNote {
  tag: string;
  note: string;
}

/**
 * An annotated tag used in LingTaggedForm.
 */
export interface AnnotatedTag {
  value: string;
  notes?: TaggedNote[];
}

/**
 * A linguistically tagged form.
 */
export interface LingTaggedForm {
  lemmata?: string[];
  isDubious?: boolean;
  note?: string;
  tags: AnnotatedTag[];
}

// from Itinera

/**
 * Location of a sheet in a manuscript.
 */
 export interface MsLocation {
  n: number;
  r?: boolean;
  s?: string;
  l?: number;
  p?: boolean;
}

/**
 * A range of manuscript's locations.
 */
 export interface MsLocationRange {
  start: MsLocation;
  end: MsLocation;
}

/**
 * A geographical location, expressed as an area plus an
 * optional "address", which contains any number of topographic
 * names separated by commas, from the widest to the narrowest.
 */
 export interface GeoAddress {
  area: string;
  address?: string;
}
