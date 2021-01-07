import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor';

// general Cadmus modules
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';

// project-specific modules
import { CadmusItineraCoreModule } from '@myrmidon/cadmus-itinera-core';
import { CadmusItineraUiModule } from '@myrmidon/cadmus-itinera-ui';
import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusTgrUiModule } from '@myrmidon/cadmus-tgr-ui';
import { MsUnitsPartComponent } from './ms-units-part/ms-units-part.component';
import { MsPalimpsestComponent } from './ms-palimpsest/ms-palimpsest.component';
import { MsGuardSheetComponent } from './ms-guard-sheet/ms-guard-sheet.component';
import { MsUnitComponent } from './ms-unit/ms-unit.component';
import { MsContentsPartComponent } from './ms-contents-part/ms-contents-part.component';
import { MsContentComponent } from './ms-content/ms-content.component';
import { MsScriptsPartComponent } from './ms-scripts-part/ms-scripts-part.component';
import { MsHandComponent } from './ms-hand/ms-hand.component';
import { MsScriptComponent } from './ms-script/ms-script.component';
import { MsFormalFeaturesPartComponent } from './ms-formal-features-part/ms-formal-features-part.component';
import { MsFormalFeatureComponent } from './ms-formal-feature/ms-formal-feature.component';
import { MsOrnamentComponent } from './ms-ornament/ms-ornament.component';
import { MsOrnamentsPartComponent } from './ms-ornaments-part/ms-ornaments-part.component';
import { MsHistoryPartComponent } from './ms-history-part/ms-history-part.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    MsContentComponent,
    MsContentsPartComponent,
    MsFormalFeatureComponent,
    MsFormalFeaturesPartComponent,
    MsGuardSheetComponent,
    MsHandComponent,
    MsHistoryPartComponent,
    MsOrnamentComponent,
    MsOrnamentsPartComponent,
    MsPalimpsestComponent,
    MsScriptComponent,
    MsScriptsPartComponent,
    MsUnitComponent,
    MsUnitsPartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    MarkdownModule,
    // Cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    // Cadmus itinera
    CadmusItineraCoreModule,
    CadmusItineraUiModule,
    CadmusTgrCoreModule,
    CadmusTgrUiModule,
  ],
  exports: [
    MsContentComponent,
    MsContentsPartComponent,
    MsFormalFeatureComponent,
    MsFormalFeaturesPartComponent,
    MsGuardSheetComponent,
    MsHandComponent,
    MsHistoryPartComponent,
    MsOrnamentComponent,
    MsOrnamentsPartComponent,
    MsPalimpsestComponent,
    MsScriptComponent,
    MsScriptsPartComponent,
    MsUnitComponent,
    MsUnitsPartComponent
  ],
})
export class CadmusTgrPartMsUiModule {}
