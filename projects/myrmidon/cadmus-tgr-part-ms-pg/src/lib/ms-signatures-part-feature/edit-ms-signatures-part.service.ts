import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditMsSignaturesPartStore } from './edit-ms-signatures-part.store';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';

@Injectable({ providedIn: 'root' })
export class EditMsSignaturesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsSignaturesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
