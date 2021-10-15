import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { EditItemQuery, EditItemService, EditPartFeatureBase } from '@myrmidon/cadmus-state';
import { EditMsSignaturesPartQuery } from './edit-ms-signatures-part.query';
import { EditMsSignaturesPartService } from './edit-ms-signatures-part.service';

@Component({
  selector: 'itinera-ms-signatures-part-feature',
  templateUrl: './ms-signatures-part-feature.component.html',
  styleUrls: ['./ms-signatures-part-feature.component.css'],
})
export class MsSignaturesPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editPartQuery: EditMsSignaturesPartQuery,
    editPartService: EditMsSignaturesPartService,
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

  ngOnInit(): void {
    this.initEditor(['ms-signature-tags']);
  }
}
