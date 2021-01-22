import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// general Cadmus modules
import { CadmusCoreModule, PendingChangesGuard } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';

// project-specific modules
import { CadmusItineraCoreModule } from '@myrmidon/cadmus-itinera-core';
import { CadmusItineraUiModule } from '@myrmidon/cadmus-itinera-ui';

import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusTgrUiModule } from '@myrmidon/cadmus-tgr-ui';
import {
  CadmusTgrPartMsUiModule,
  MSCONTENTS_PART_TYPEID,
  MSFORMAL_FEATURES_PART_TYPEID,
  MSHISTORY_PART_TYPEID,
  MSORNAMENTS_PART_TYPEID,
  MSPLACES_PART_TYPEID,
  MSSCRIPTS_PART_TYPEID,
  MSUNITS_PART_TYPEID,
} from '@myrmidon/cadmus-tgr-part-ms-ui';

import { MsContentsPartFeatureComponent } from './ms-contents-part-feature/ms-contents-part-feature.component';
import { MsUnitsPartFeatureComponent } from './ms-units-part-feature/ms-units-part-feature.component';
import { MsScriptsPartFeatureComponent } from './ms-scripts-part-feature/ms-scripts-part-feature.component';
import { MsFormalFeaturesPartFeatureComponent } from './ms-formal-features-part-feature/ms-formal-features-part-feature.component';
import { MsOrnamentsPartFeatureComponent } from './ms-ornaments-part-feature/ms-ornaments-part-feature.component';
import { MsHistoryPartFeatureComponent } from './ms-history-part-feature/ms-history-part-feature.component';
import { MsPlacesPartFeatureComponent } from './ms-places-part-feature/ms-places-part-feature.component';

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
    MsUnitsPartFeatureComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModuleForChild,
    // Cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    // Cadmus itinera
    CadmusItineraCoreModule,
    CadmusItineraUiModule,
    CadmusTgrCoreModule,
    CadmusTgrUiModule,
    CadmusTgrPartMsUiModule,
  ],
  exports: [
    MsContentsPartFeatureComponent,
    MsFormalFeaturesPartFeatureComponent,
    MsHistoryPartFeatureComponent,
    MsOrnamentsPartFeatureComponent,
    MsPlacesPartFeatureComponent,
    MsScriptsPartFeatureComponent,
    MsUnitsPartFeatureComponent
  ],
})
export class CadmusTgrPartMsPgModule {}
