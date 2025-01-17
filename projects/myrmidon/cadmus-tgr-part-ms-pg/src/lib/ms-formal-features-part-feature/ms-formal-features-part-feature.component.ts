import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';
import { CurrentItemBarComponent } from '@myrmidon/cadmus-ui-pg';
import { MsFormalFeaturesPartComponent } from '@myrmidon/cadmus-tgr-part-ms-ui';

@Component({
  selector: 'tgr-ms-formal-features-part-feature',
  templateUrl: './ms-formal-features-part-feature.component.html',
  styleUrls: ['./ms-formal-features-part-feature.component.css'],
  imports: [CurrentItemBarComponent, MsFormalFeaturesPartComponent],
})
export class MsFormalFeaturesPartFeatureComponent
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
}
