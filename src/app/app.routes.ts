import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MenuListComponent} from './menu-list/menu-list.component';

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
    path: 'register',
    component: RegisterComponent,
    title: 'Registro de usuario'
  },
  {path: '**', component: PageNotFoundComponent}
];
