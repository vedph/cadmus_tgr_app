import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditAvailableWitnessesFragmentStore } from './edit-available-witnesses-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditAvailableWitnessesFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditAvailableWitnessesFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
