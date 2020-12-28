import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditVarQuotationsFragmentQuery } from './edit-var-quotations-fragment.query';
import { EditVarQuotationsFragmentService } from './edit-var-quotations-fragment.service';
import {
  EditItemQuery,
  EditItemService,
  EditLayerPartQuery,
  EditLayerPartService,
  EditFragmentFeatureBase,
} from '@myrmidon/cadmus-state';
import { LibraryRouteService } from '@myrmidon/cadmus-core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tgr-var-quotations-fragment-feature',
  templateUrl: './var-quotations-fragment-feature.component.html',
  styleUrls: ['./var-quotations-fragment-feature.component.css'],
})
export class VarQuotationsFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditVarQuotationsFragmentQuery,
    editFrService: EditVarQuotationsFragmentService,
    editItemQuery: EditItemQuery,
    editItemService: EditItemService,
    editLayersQuery: EditLayerPartQuery,
    editLayersService: EditLayerPartService,
    libraryRouteService: LibraryRouteService
  ) {
    super(
      router,
      route,
      snackbar,
      editFrQuery,
      editFrService,
      editItemQuery,
      editItemService,
      editLayersQuery,
      editLayersService,
      libraryRouteService
    );
  }

  ngOnInit() {
    this.initEditor([
      'quotation-tags',
      'quotation-authorities',
      'author-works',
      'apparatus-witnesses',
      'apparatus-authors',
      'apparatus-author-tags',
    ]);
  }
}
