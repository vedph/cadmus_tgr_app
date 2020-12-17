import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditMsContentsPartStore } from './edit-ms-contents-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsContentsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsContentsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
