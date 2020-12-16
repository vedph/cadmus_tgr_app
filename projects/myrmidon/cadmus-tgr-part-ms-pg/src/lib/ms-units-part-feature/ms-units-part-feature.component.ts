import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMsUnitsPartService } from './edit-ms-units-part.service';
import { EditMsUnitsPartQuery } from './edit-ms-units-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-ms-units-part-feature',
  templateUrl: './ms-units-part-feature.component.html',
  styleUrls: ['./ms-units-part-feature.component.css'],
})
export class MsUnitsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsUnitsPartQuery,
    editPartService: EditMsUnitsPartService,
    editItemQuery: EditItemQuery,
    editItemService: EditItemService
  ) {
    super(
      router,
      route,
      snackbar,
      editPartQuery,
      editPartService,
      editItemQuery,
      editItemService
    );
  }

  public ngOnInit(): void {
    this.initEditor([
      'ms-materials',
      'ms-ruling-manners',
      'ms-ruling-systems',
      'physical-size-units',
      'physical-size-tags',
      'physical-dim-tags',
    ]);
  }
}
