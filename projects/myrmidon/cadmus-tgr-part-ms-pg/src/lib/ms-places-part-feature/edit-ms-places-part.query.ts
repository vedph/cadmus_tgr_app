import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditMsPlacesPartStore } from './edit-ms-places-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsPlacesPartQuery extends EditPartQueryBase {
  constructor(store: EditMsPlacesPartStore) {
    super(store);
  }
}
