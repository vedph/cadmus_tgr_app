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
