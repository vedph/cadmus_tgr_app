import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditMsHistoryPartStore } from './edit-ms-history-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsHistoryPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsHistoryPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
