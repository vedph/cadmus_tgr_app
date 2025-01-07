import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { MsHistoryPartComponent } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Component({
  selector: 'tgr-ms-history-part-feature',
  templateUrl: './ms-history-part-feature.component.html',
  styleUrls: ['./ms-history-part-feature.component.css'],
  imports: [CurrentItemBarComponent, MsHistoryPartComponent],
})
export class MsHistoryPartFeatureComponent
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
    return ['ms-languages'];
  }
}
