import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMsOrnamentsPartService } from './edit-ms-ornaments-part.service';
import { EditMsOrnamentsPartQuery } from './edit-ms-ornaments-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-ms-ornaments-part-feature',
  templateUrl: './ms-ornaments-part-feature.component.html',
  styleUrls: ['./ms-ornaments-part-feature.component.css'],
})
export class MsOrnamentsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsOrnamentsPartQuery,
    editPartService: EditMsOrnamentsPartService,
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
      'ms-ornament-types',
      'physical-size-units',
      'physical-size-tags',
      'physical-dim-tags',
    ]);
  }
}
