import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadmusMaterialModule } from '@myrmidon/cadmus-material';
import { ThesaurusTreeComponent } from './components/thesaurus-tree/thesaurus-tree.component';

@NgModule({
  declarations: [ThesaurusTreeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CadmusMaterialModule,
  ],
  exports: [ThesaurusTreeComponent],
})
export class CadmusTgrUiModule {}
