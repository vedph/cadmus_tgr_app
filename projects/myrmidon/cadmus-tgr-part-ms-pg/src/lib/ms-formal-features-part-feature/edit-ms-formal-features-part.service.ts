import { Injectable } from "@angular/core";
import { ItemService, ThesaurusService } from "@myrmidon/cadmus-api";
import { EditPartServiceBase } from "@myrmidon/cadmus-state";
import { EditMsFormalFeaturesPartStore } from "./edit-ms-formal-features-part.store";

@Injectable({ providedIn: "root" })
export class EditMsFormalFeaturesPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsFormalFeaturesPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
