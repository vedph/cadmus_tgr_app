import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditPartServiceBase } from '@myrmidon/cadmus-state';
import { EditMsUnitsPartStore } from './edit-ms-units-part.store';

@Injectable({ providedIn: 'root' })
export class EditMsUnitsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsUnitsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
