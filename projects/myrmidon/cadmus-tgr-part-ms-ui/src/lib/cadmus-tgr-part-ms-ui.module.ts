import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';

import { MonacoEditorModule } from 'ngx-monaco-editor';

// general Cadmus modules
import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CadmusRefsHistoricalDateModule } from '@myrmidon/cadmus-refs-historical-date';
import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusMatPhysicalSizeModule } from '@myrmidon/cadmus-mat-physical-size';
import { CadmusUiFlagsPickerModule } from '@myrmidon/cadmus-ui-flags-picker';

// locals
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
import { MsPlacesPartComponent } from './ms-places-part/ms-places-part.component';
import { MsPlaceComponent } from './ms-place/ms-place.component';
import { MsSignaturesPartComponent } from './ms-signatures-part/ms-signatures-part.component';

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
    MsPlaceComponent,
    MsPlacesPartComponent,
    MsScriptComponent,
    MsScriptsPartComponent,
    MsSignaturesPartComponent,
    MsUnitComponent,
    MsUnitsPartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    MarkdownModule,
    // material
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTooltipModule,
    MatTreeModule,
    // Cadmus
    NgToolsModule,
    CadmusCoreModule,
    CadmusUiFlagsPickerModule,
    CadmusUiModule,
    CadmusMatPhysicalSizeModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsHistoricalDateModule,
    CadmusTgrCoreModule,
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
    MsPlaceComponent,
    MsPlacesPartComponent,
    MsScriptComponent,
    MsScriptsPartComponent,
    MsSignaturesPartComponent,
    MsUnitComponent,
    MsUnitsPartComponent,
  ],
})
export class CadmusTgrPartMsUiModule {}
