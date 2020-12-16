import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// general Cadmus modules
import { CadmusCoreModule } from '@myrmidon/cadmus-core';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { CadmusUiModule } from '@myrmidon/cadmus-ui';

// project-specific modules
import { CadmusItineraCoreModule } from '@myrmidon/cadmus-itinera-core';
import { CadmusItineraUiModule } from '@myrmidon/cadmus-itinera-ui';

import { CadmusTgrCoreModule } from '@myrmidon/cadmus-tgr-core';
import { CadmusTgrUiModule } from '@myrmidon/cadmus-tgr-ui';
import { CadmusTgrPartMsUiModule } from '@myrmidon/cadmus-tgr-part-ms-ui';

import { MsUnitsPartFeatureComponent } from './ms-units-part-feature/ms-units-part-feature.component';

@NgModule({
  declarations: [MsUnitsPartFeatureComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Cadmus
    CadmusCoreModule,
    CadmusMaterialModule,
    CadmusUiModule,
    // Cadmus itinera
    CadmusItineraCoreModule,
    CadmusItineraUiModule,
    CadmusTgrCoreModule,
    CadmusTgrUiModule,
    CadmusTgrPartMsUiModule
  ],
  exports: [MsUnitsPartFeatureComponent],
})
export class CadmusTgrPartMsPgModule { }
