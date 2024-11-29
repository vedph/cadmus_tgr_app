import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryRouteService } from '@myrmidon/cadmus-core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  EditFragmentFeatureBase,
  FragmentEditorService,
} from '@myrmidon/cadmus-state';

@Component({
  selector: 'tgr-var-quotations-fragment-feature',
  templateUrl: './var-quotations-fragment-feature.component.html',
  styleUrls: ['./var-quotations-fragment-feature.component.css'],
  standalone: false,
})
export class VarQuotationsFragmentFeatureComponent
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
      '!quotation-tags',
      '!quotation-authorities',
      '!author-works',
      '!apparatus-author-tags',
      'apparatus-witnesses',
      'apparatus-authors',
    ];
  }
}
