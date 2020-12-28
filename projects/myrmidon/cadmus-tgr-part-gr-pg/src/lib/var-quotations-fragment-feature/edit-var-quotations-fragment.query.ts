import { Injectable } from '@angular/core';
import { EditFragmentQueryBase } from '@myrmidon/cadmus-state';
import { EditVarQuotationsFragmentStore } from './edit-var-quotations-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditVarQuotationsFragmentQuery extends EditFragmentQueryBase {
  constructor(protected store: EditVarQuotationsFragmentStore) {
    super(store);
  }
}
