import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditMsScriptsPartService } from './edit-ms-scripts-part.service';
import { EditMsScriptsPartQuery } from './edit-ms-scripts-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-ms-scripts-part-feature',
  templateUrl: './ms-scripts-part-feature.component.html',
  styleUrls: ['./ms-scripts-part-feature.component.css'],
})
export class MsScriptsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsScriptsPartQuery,
    editPartService: EditMsScriptsPartService,
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
    this.initEditor(['ms-languages', 'ms-script-types', 'ms-script-roles']);
  }
}
