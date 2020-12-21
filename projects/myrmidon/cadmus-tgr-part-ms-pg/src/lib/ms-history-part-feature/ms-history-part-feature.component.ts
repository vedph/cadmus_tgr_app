import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMsHistoryPartService } from './edit-ms-history-part.service';
import { EditMsHistoryPartQuery } from './edit-ms-history-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-ms-history-part-feature',
  templateUrl: './ms-history-part-feature.component.html',
  styleUrls: ['./ms-history-part-feature.component.css'],
})
export class MsHistoryPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsHistoryPartQuery,
    editPartService: EditMsHistoryPartService,
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
    this.initEditor(['ms-languages']);
  }
}
