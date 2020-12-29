import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';
import {
  EditFragmentState,
  EditFragmentStoreApi,
  editFragmentInitialState,
} from '@myrmidon/cadmus-state';
// change this import as required
import { INTERPOLATIONS_FRAGMENT_TYPEID } from '@myrmidon/cadmus-tgr-part-gr-ui';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: INTERPOLATIONS_FRAGMENT_TYPEID })
export class EditInterpolationsFragmentStore
  extends Store<EditFragmentState>
  implements EditFragmentStoreApi {
  constructor() {
    super(editFragmentInitialState);
  }

  public setDirty(value: boolean): void {
    this.update({ dirty: value });
  }
  public setSaving(value: boolean): void {
    this.update({ saving: value });
  }
}
