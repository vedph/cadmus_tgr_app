import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EditLingTagsFragmentQuery } from './edit-ling-tags-fragment.query';
import { EditLingTagsFragmentService } from './edit-ling-tags-fragment.service';
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
  selector: 'tgr-ling-tags-fragment-feature',
  templateUrl: './ling-tags-fragment-feature.component.html',
  styleUrls: ['./ling-tags-fragment-feature.component.css'],
})
export class LingTagsFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit {
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditLingTagsFragmentQuery,
    editFrService: EditLingTagsFragmentService,
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

  ngOnInit(): void {
    this.initEditor(['ling-tags', 'ling-tags-aux']);
  }
}
