import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { MsScriptsPartComponent } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Component({
  selector: 'tgr-ms-scripts-part-feature',
  templateUrl: './ms-scripts-part-feature.component.html',
  styleUrls: ['./ms-scripts-part-feature.component.css'],
  imports: [CurrentItemBarComponent, MsScriptsPartComponent],
})
export class MsScriptsPartFeatureComponent
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
    return ['ms-languages', 'ms-script-types', 'ms-script-roles'];
  }
}
