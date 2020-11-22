import { Injectable } from '@angular/core';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { EditFragmentServiceBase } from '@myrmidon/cadmus-state';
import { EditLingTagsFragmentStore } from './edit-ling-tags-fragment.store';

@Injectable({ providedIn: 'root' })
export class EditLingTagsFragmentService extends EditFragmentServiceBase {
  constructor(
    editPartStore: EditLingTagsFragmentStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
