import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditMsScriptsPartStore } from './edit-ms-scripts-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsScriptsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsScriptsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
