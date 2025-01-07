import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { AvailableWitnessesPartComponent } from '@myrmidon/cadmus-tgr-part-gr-ui';

@Component({
  selector: 'tgr-available-witnesses-part-feature',
  templateUrl: './available-witnesses-part-feature.component.html',
  styleUrls: ['./available-witnesses-part-feature.component.css'],
  imports: [CurrentItemBarComponent, AvailableWitnessesPartComponent],
})
export class AvailableWitnessesPartFeatureComponent
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
    return ['apparatus-witnesses'];
  }
}
