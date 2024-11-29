import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LibraryRouteService } from '@myrmidon/cadmus-core';

import {
  EditFragmentFeatureBase,
  FragmentEditorService,
} from '@myrmidon/cadmus-state';

@Component({
  selector: 'cadmus-available-witnesses-fragment-feature',
  templateUrl: './available-witnesses-fragment-feature.component.html',
  styleUrls: ['./available-witnesses-fragment-feature.component.css'],
  standalone: false,
})
export class AvailableWitnessesFragmentFeatureComponent
  extends EditFragmentFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    editorService: FragmentEditorService,
    libraryRouteService: LibraryRouteService
  ) {
    super(router, route, snackbar, editorService, libraryRouteService);
  }

  protected override getReqThesauriIds(): string[] {
    return ['apparatus-witnesses'];
  }
}
