import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditPartFeatureBase, PartEditorService } from '@myrmidon/cadmus-state';
import { ItemService, ThesaurusService } from '@myrmidon/cadmus-api';

@Component({
  selector: 'tgr-ms-units-part-feature',
  templateUrl: './ms-units-part-feature.component.html',
  styleUrls: ['./ms-units-part-feature.component.css'],
})
export class MsUnitsPartFeatureComponent
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
    return [
      'ms-materials',
      'ms-ruling-manners',
      'ms-ruling-systems',
      'physical-size-units',
      'physical-size-tags',
      'physical-dim-tags',
    ];
  }
}
