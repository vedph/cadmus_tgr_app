import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMsFormalFeaturesPartService } from './edit-ms-formal-features-part.service';
import { EditMsFormalFeaturesPartQuery } from './edit-ms-formal-features-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-ms-formal-features-part-feature',
  templateUrl: './ms-formal-features-part-feature.component.html',
  styleUrls: ['./ms-formal-features-part-feature.component.css'],
})
export class MsFormalFeaturesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsFormalFeaturesPartQuery,
    editPartService: EditMsFormalFeaturesPartService,
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
    this.initEditor(null);
  }
}
