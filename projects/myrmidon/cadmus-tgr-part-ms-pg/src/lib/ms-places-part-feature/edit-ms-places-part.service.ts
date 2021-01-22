import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditMsPlacesPartStore } from './edit-ms-places-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsPlacesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsPlacesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
