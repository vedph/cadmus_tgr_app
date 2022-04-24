import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditAvailableWitnessesFragmentStore } from './edit-available-witnesses-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditAvailableWitnessesFragmentQuery extends EditFragmentQueryBase {
  constructor(protected store: EditAvailableWitnessesFragmentStore) {
    super(store);
  }
}
