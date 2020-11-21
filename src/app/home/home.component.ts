import { Component } from '@angular/core';
import { EnvService, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';

@Component({
  selector: 'cadmus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public title: string;
  public logged: boolean;

  public tagEntries: ThesaurusEntry[];
  public auxEntries: ThesaurusEntry[];

  constructor(env: EnvService, authService: AuthService) {
    this.title = env.name;
    this.logged = authService.currentUserValue !== null;

    this.tagEntries = [
      {
        id: 'architecture',
        value: 'architecture',
      },
      {
        id: 'geography',
        value: 'geography',
      },
      {
        id: 'geography.cities',
        value: 'geography: cities',
      },
      {
        id: 'geography.regions',
        value: 'geography: regions',
      },
      {
        id: 'ethnography',
        value: 'ethnography',
      },
      {
        id: 'ethnography.death',
        value: 'ethnography: death',
      },
      {
        id: 'ethnography.food',
        value: 'ethnography: food',
      },
      {
        id: 'ethnography.peoples',
        value: 'ethnography: peoples',
      },
      {
        id: 'ethnography.religion',
        value: 'ethnography: religion',
      },
      {
        id: 'ethnography.religion.deities',
        value: 'ethnography: religion deities',
      },
      {
        id: 'ethnography.religion.rites',
        value: 'ethnography: religion rites',
      },
      {
        id: 'history',
        value: 'history',
      },
      {
        id: 'language',
        value: 'language',
      },
      {
        id: 'language.phonology',
        value: 'language: phonology',
      },
      {
        id: 'language.morphology',
        value: 'language: morphology',
      },
      {
        id: 'language.syntax',
        value: 'language: syntax',
      },
      {
        id: 'literature',
        value: 'literature',
      },
    ];

    this.auxEntries = [
      {
        id: 'language.syntax--alpha',
        value: 'a-syntax'
      },
      {
        id: 'language.syntax--beta',
        value: 'b-syntax'
      },
    ];
  }
}
