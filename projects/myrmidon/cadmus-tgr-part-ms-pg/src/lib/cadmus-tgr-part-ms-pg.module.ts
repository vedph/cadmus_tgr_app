import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';

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
import { FlexLayoutModule } from '@angular/flex-layout';

// general Cadmus modules
import { CadmusCoreModule, PendingChangesGuard } from '@myrmidon/cadmus-core';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';

import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import {
  CadmusTgrPartMsUiModule,
  MSCONTENTS_PART_TYPEID,
  MSFORMAL_FEATURES_PART_TYPEID,
  MSHISTORY_PART_TYPEID,
  MSORNAMENTS_PART_TYPEID,
  MSPLACES_PART_TYPEID,
  MSSCRIPTS_PART_TYPEID,
  MSSIGNATURES_PART_TYPEID,
  MSUNITS_PART_TYPEID,
} from '@myrmidon/cadmus-tgr-part-ms-ui';

import { CadmusUiPgModule } from '@myrmidon/cadmus-ui-pg';

import { MsContentsPartFeatureComponent } from './ms-contents-part-feature/ms-contents-part-feature.component';
import { MsUnitsPartFeatureComponent } from './ms-units-part-feature/ms-units-part-feature.component';
import { MsScriptsPartFeatureComponent } from './ms-scripts-part-feature/ms-scripts-part-feature.component';
import { MsFormalFeaturesPartFeatureComponent } from './ms-formal-features-part-feature/ms-formal-features-part-feature.component';
import { MsOrnamentsPartFeatureComponent } from './ms-ornaments-part-feature/ms-ornaments-part-feature.component';
import { MsHistoryPartFeatureComponent } from './ms-history-part-feature/ms-history-part-feature.component';
import { MsPlacesPartFeatureComponent } from './ms-places-part-feature/ms-places-part-feature.component';
import { MsSignaturesPartFeatureComponent } from './ms-signatures-part-feature/ms-signatures-part-feature.component';
import { NgToolsModule } from '@myrmidon/ng-tools';
import { CadmusRefsDocReferencesModule } from '@myrmidon/cadmus-refs-doc-references';
import { CadmusRefsHistoricalDateModule } from '@myrmidon/cadmus-refs-historical-date';

// https://github.com/ng-packagr/ng-packagr/issues/778
export const RouterModuleForChild = RouterModule.forChild([
  {
    path: `${MSCONTENTS_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsContentsPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSFORMAL_FEATURES_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsFormalFeaturesPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSHISTORY_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsHistoryPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSORNAMENTS_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsOrnamentsPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSPLACES_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsPlacesPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSSCRIPTS_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsScriptsPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSSIGNATURES_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsSignaturesPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${MSUNITS_PART_TYPEID}/:pid`,
    pathMatch: 'full',
    component: MsUnitsPartFeatureComponent,
    canDeactivate: [PendingChangesGuard],
  },
]);

@NgModule({
  declarations: [
    MsContentsPartFeatureComponent,
    MsFormalFeaturesPartFeatureComponent,
    MsHistoryPartFeatureComponent,
    MsOrnamentsPartFeatureComponent,
    MsPlacesPartFeatureComponent,
    MsScriptsPartFeatureComponent,
    MsSignaturesPartFeatureComponent,
    MsUnitsPartFeatureComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    // material
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
    FlexLayoutModule,
    // Cadmus
    NgToolsModule,
    CadmusCoreModule,
    CadmusUiModule,
    CadmusUiPgModule,
    CadmusTgrCoreModule,
    CadmusTgrPartMsUiModule,
    CadmusRefsDocReferencesModule,
    CadmusRefsHistoricalDateModule
  ],
  exports: [
    MsContentsPartFeatureComponent,
    MsFormalFeaturesPartFeatureComponent,
    MsHistoryPartFeatureComponent,
    MsOrnamentsPartFeatureComponent,
    MsPlacesPartFeatureComponent,
    MsScriptsPartFeatureComponent,
    MsSignaturesPartFeatureComponent,
    MsUnitsPartFeatureComponent,
  ],
})
export class CadmusTgrPartMsPgModule {}
