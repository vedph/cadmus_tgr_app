import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditAvailableWitnessesPartStore } from './edit-available-witnesses-part.store';

@Injectable({ providedIn: 'root' })
export class EditAvailableWitnessesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditAvailableWitnessesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
