import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditLingTagsFragmentStore } from './edit-ling-tags-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditLingTagsFragmentQuery extends EditFragmentQueryBase {
  constructor(protected store: EditLingTagsFragmentStore) {
    super(store);
  }
}
