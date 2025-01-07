import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { MsContentsPartComponent } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Component({
  selector: 'tgr-ms-contents-part-feature',
  templateUrl: './ms-contents-part-feature.component.html',
  styleUrls: ['./ms-contents-part-feature.component.css'],
  imports: [CurrentItemBarComponent, MsContentsPartComponent],
})
export class MsContentsPartFeatureComponent
  extends EditPartFeatureBase
  implements OnInit
{
  constructor(
    router: Router,
    route: ActivatedRoute,
    snackbar: MatSnackBar,
    itemService: ItemService,
    thesaurusService: ThesaurusService,
    editorService: PartEditorService
  ) {
    super(
      router,
      route,
      snackbar,
      itemService,
      thesaurusService,
      editorService
    );
  }

  protected override getReqThesauriIds(): string[] {
    return ['author-works', 'doc-reference-tags', 'doc-reference-types'];
  }
}
