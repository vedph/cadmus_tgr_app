import { Injectable } from '@angular/core';
import { EditPartQueryBase } from '@myrmidon/cadmus-state';
import { EditMsSignaturesPartStore } from './edit-ms-signatures-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsSignaturesPartQuery extends EditPartQueryBase {
  constructor(store: EditMsSignaturesPartStore) {
    super(store);
  }
}
