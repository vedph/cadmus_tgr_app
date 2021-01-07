import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditInterpolationsFragmentQuery } from './edit-interpolations-fragment.query';
import { EditInterpolationsFragmentService } from './edit-interpolations-fragment.service';
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
  selector: 'tgr-interpolations-fragment-feature',
  templateUrl: './interpolations-fragment-feature.component.html',
  styleUrls: ['./interpolations-fragment-feature.component.css'],
})
export class InterpolationsFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditInterpolationsFragmentQuery,
    editFrService: EditInterpolationsFragmentService,
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
      '!interpolation-roles',
      '!interpolation-tags',
      '!interpolation-languages',
      '!quotation-tags',
      '!quotation-authorities',
      '!author-works',
      '!apparatus-author-tags',
      'apparatus-witnesses',
      'apparatus-authors',
    ]);
  }
}
