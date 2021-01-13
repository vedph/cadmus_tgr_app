import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditAvailableWitnessesPartStore } from './edit-available-witnesses-part.store';

@Injectable({ providedIn: 'root' })
export class EditAvailableWitnessesPartQuery extends EditPartQueryBase {
  constructor(store: EditAvailableWitnessesPartStore) {
    super(store);
  }
}
