import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';

import { EditPartState, EditPartStoreApi } from '@myrmidon/cadmus-state';

import { MSFORMAL_FEATURES_PART_TYPEID } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: MSFORMAL_FEATURES_PART_TYPEID })
export class EditMsFormalFeaturesPartStore
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
