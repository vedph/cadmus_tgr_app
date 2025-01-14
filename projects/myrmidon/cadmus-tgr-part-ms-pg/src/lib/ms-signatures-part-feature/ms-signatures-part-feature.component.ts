import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { MsSignaturesPartComponent } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Component({
  selector: 'tgr-ms-signatures-part-feature',
  templateUrl: './ms-signatures-part-feature.component.html',
  styleUrls: ['./ms-signatures-part-feature.component.css'],
  imports: [CurrentItemBarComponent, MsSignaturesPartComponent],
})
export class MsSignaturesPartFeatureComponent
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
    return ['ms-signature-tags'];
  }
}
