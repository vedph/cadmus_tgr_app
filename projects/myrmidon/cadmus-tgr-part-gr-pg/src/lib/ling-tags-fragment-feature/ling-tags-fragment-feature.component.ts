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
import { LingTagsFragmentComponent } from '@myrmidon/cadmus-tgr-part-gr-ui';

@Component({
  selector: 'tgr-ling-tags-fragment-feature',
  templateUrl: './ling-tags-fragment-feature.component.html',
  styleUrls: ['./ling-tags-fragment-feature.component.css'],
  imports: [
    CurrentItemBarComponent,
    DecoratedTokenTextComponent,
    LingTagsFragmentComponent,
  ],
})
export class LingTagsFragmentFeatureComponent
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
    return ['ling-tags', 'ling-tags-aux'];
  }
}
