import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EditItemQuery,
  EditItemService,
  EditLayerPartQuery,
  EditLayerPartService,
  EditFragmentFeatureBase,
} from '@myrmidon/cadmus-state';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryRouteService } from '@myrmidon/cadmus-core';
import { EditAvailableWitnessesFragmentQuery } from './edit-available-witnesses-fragment.query';
import { EditAvailableWitnessesFragmentService } from './edit-available-witnesses-fragment.service';

@Component({
  selector: 'cadmus-available-witnesses-fragment-feature',
  templateUrl: './available-witnesses-fragment-feature.component.html',
  styleUrls: ['./available-witnesses-fragment-feature.component.css'],
})
export class AvailableWitnessesFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editFrQuery: EditAvailableWitnessesFragmentQuery,
    editFrService: EditAvailableWitnessesFragmentService,
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
    this.initEditor(['apparatus-witnesses']);
  }
}
