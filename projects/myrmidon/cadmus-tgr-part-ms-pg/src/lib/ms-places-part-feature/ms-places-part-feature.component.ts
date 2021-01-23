import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMsPlacesPartService } from './edit-ms-places-part.service';
import { EditMsPlacesPartQuery } from './edit-ms-places-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-ms-places-part-feature',
  templateUrl: './ms-places-part-feature.component.html',
  styleUrls: ['./ms-places-part-feature.component.css'],
})
export class MsPlacesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsPlacesPartQuery,
    editPartService: EditMsPlacesPartService,
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
    this.initEditor(['ms-place-areas', 'doc-reference-tags']);
  }
}
