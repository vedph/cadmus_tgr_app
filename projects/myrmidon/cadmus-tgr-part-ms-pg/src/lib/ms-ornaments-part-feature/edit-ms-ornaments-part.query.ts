import { Injectable } from "@angular/core";
import { EditPartQueryBase } from "@myrmidon/cadmus-state";
import { EditMsOrnamentsPartStore } from "./edit-ms-ornaments-part.store";

@Injectable({ providedIn: "root" })
export class EditMsOrnamentsPartQuery extends EditPartQueryBase {
  constructor(store: EditMsOrnamentsPartStore) {
    super(store);
  }
}
