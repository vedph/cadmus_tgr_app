import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditInterpolationsFragmentStore } from './edit-interpolations-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditInterpolationsFragmentQuery extends EditFragmentQueryBase {
  constructor(protected store: EditInterpolationsFragmentStore) {
    super(store);
  }
}
