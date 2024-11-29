import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryRouteService } from '@myrmidon/cadmus-core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EditFragmentFeatureBase,
  FragmentEditorService,
} from '@myrmidon/cadmus-state';

@Component({
  selector: 'tgr-interpolations-fragment-feature',
  templateUrl: './interpolations-fragment-feature.component.html',
  styleUrls: ['./interpolations-fragment-feature.component.css'],
  standalone: false,
})
export class InterpolationsFragmentFeatureComponent
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
    return [
      '!interpolation-roles',
      '!interpolation-tags',
      '!interpolation-languages',
      '!quotation-tags',
      '!quotation-authorities',
      '!author-works',
      '!apparatus-author-tags',
      'apparatus-witnesses',
      'apparatus-authors',
    ];
  }
}
