import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditInterpolationsFragmentStore } from './edit-interpolations-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditInterpolationsFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditInterpolationsFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
