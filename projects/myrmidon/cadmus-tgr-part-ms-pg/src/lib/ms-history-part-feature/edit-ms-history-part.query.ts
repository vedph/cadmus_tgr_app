import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditMsHistoryPartStore } from './edit-ms-history-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsHistoryPartQuery extends EditPartQueryBase {
  constructor(store: EditMsHistoryPartStore) {
    super(store);
  }
}
