import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditVarQuotationsFragmentStore } from './edit-var-quotations-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditVarQuotationsFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditVarQuotationsFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
