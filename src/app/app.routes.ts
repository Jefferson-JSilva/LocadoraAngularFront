import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Atores } from './atores/atores';
import { Classes } from './classes/classes';
import { Diretores } from './diretores/diretores';
export const routes: Routes = [
  { path: '', component: Inicio, title: 'Início | Locadora' },
  { path: 'atores', component: Atores, title: 'Atores | Locadora' },
  { path: 'classes', component: Classes, title: 'Classes | Locadora' },
  { path: 'diretores', component: Diretores, title: 'Diretores | Locadora' },
  { path: '**', redirectTo: '' },
];
