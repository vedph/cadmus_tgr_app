import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LibraryRouteService } from '@myrmidon/cadmus-core';

import { MatSnackBar } from '@angular/material/snack-bar';

import {
  EditFragmentFeatureBase,
  FragmentEditorService,
} from '@myrmidon/cadmus-state';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { DecoratedTokenTextComponent } from '@myrmidon/cadmus-ui';
import { VarQuotationsFragmentComponent } from '@myrmidon/cadmus-tgr-part-gr-ui';

@Component({
  selector: 'tgr-var-quotations-fragment-feature',
  templateUrl: './var-quotations-fragment-feature.component.html',
  styleUrls: ['./var-quotations-fragment-feature.component.css'],
  imports: [
    CurrentItemBarComponent,
    DecoratedTokenTextComponent,
    VarQuotationsFragmentComponent,
  ],
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
