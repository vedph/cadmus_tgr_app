import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditMsUnitsPartStore } from './edit-ms-units-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsUnitsPartQuery extends EditPartQueryBase {
  constructor(store: EditMsUnitsPartStore) {
    super(store);
  }
}
