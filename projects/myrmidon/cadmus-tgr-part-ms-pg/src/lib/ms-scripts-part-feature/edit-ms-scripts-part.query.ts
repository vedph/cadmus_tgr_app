import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditMsScriptsPartStore } from './edit-ms-scripts-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsScriptsPartQuery extends EditPartQueryBase {
  constructor(store: EditMsScriptsPartStore) {
    super(store);
  }
}
