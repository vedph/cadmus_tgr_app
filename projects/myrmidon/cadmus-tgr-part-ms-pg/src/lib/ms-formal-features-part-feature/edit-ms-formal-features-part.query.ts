import { Injectable } from "@angular/core";
import { EditPartQueryBase } from "@myrmidon/cadmus-state";
import { EditMsFormalFeaturesPartStore } from "./edit-ms-formal-features-part.store";

@Injectable({ providedIn: "root" })
export class EditMsFormalFeaturesPartQuery extends EditPartQueryBase {
  constructor(store: EditMsFormalFeaturesPartStore) {
    super(store);
  }
}
