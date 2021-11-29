import { StoreConfig, Store } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { EditPartState, EditPartStoreApi } from '@myrmidon/cadmus-state';
import { MSSIGNATURES_PART_TYPEID } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: MSSIGNATURES_PART_TYPEID })
export class EditMsSignaturesPartStore
  extends Store<EditPartState>
  implements EditPartStoreApi
{
  constructor() {
    super({});
  }

  public setDirty(value: boolean): void {
    this.update({ dirty: value });
  }
  public setSaving(value: boolean): void {
    this.update({ saving: value });
  }
}
