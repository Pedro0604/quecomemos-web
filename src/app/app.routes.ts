import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MenuListComponent} from './menu-list/menu-list.component';
import {MenuFormComponent} from './menu-form/menu-form.component';

export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'menu',
    component: MenuListComponent,
    title: 'Todos los menús'
  },
  {
    path: 'menu/create',
    component: MenuFormComponent,
    title: 'Crear un menú'
  },
  {
    path: 'menu/edit:id',
    component: MenuFormComponent,
    title: 'Editar un menú'
  },
  {
    path: '**', component: PageNotFoundComponent
  }
];
