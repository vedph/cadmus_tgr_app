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
import { MsUnitsPartComponent } from './ms-units-part/ms-units-part.component';
import { MsPalimpsestComponent } from './ms-palimpsest/ms-palimpsest.component';

@NgModule({
  declarations: [
    MsPalimpsestComponent,
    MsUnitsPartComponent
  ],
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
  ],
  exports: [
    MsPalimpsestComponent,
    MsUnitsPartComponent
  ],
})
export class CadmusTgrPartMsUiModule {}