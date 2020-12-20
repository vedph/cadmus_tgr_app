import { Injectable } from "@angular/core";
import { ItemService, ThesaurusService } from "@myrmidon/cadmus-api";
import { EditPartServiceBase } from "@myrmidon/cadmus-state";
import { EditMsOrnamentsPartStore } from "./edit-ms-ornaments-part.store";

@Injectable({ providedIn: "root" })
export class EditMsOrnamentsPartService extends EditPartServiceBase {
  constructor(
    editPartStore: EditMsOrnamentsPartStore,
    itemService: ItemService,
    thesaurusService: ThesaurusService
  ) {
    super(itemService, thesaurusService);
    this.store = editPartStore;
  }
}
