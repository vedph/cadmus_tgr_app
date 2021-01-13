import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditPartFeatureBase,
} from '@myrmidon/cadmus-state';

import { EditAvailableWitnessesPartService } from './edit-available-witnesses-part.service';
import { EditAvailableWitnessesPartQuery } from './edit-available-witnesses-part.query';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-available-witnesses-part-feature',
  templateUrl: './available-witnesses-part-feature.component.html',
  styleUrls: ['./available-witnesses-part-feature.component.css'],
})
export class AvailableWitnessesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditAvailableWitnessesPartQuery,
    editPartService: EditAvailableWitnessesPartService,
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
    this.initEditor(['apparatus-witnesses']);
  }
}
