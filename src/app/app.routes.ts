import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {MenuListComponent} from './menu-list/menu-list.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './login/guards/auth.guards';

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
    path: 'home',
    component: HomeComponent,
    title: 'Home',
    canActivate: [AuthGuard]
  },
  {
    path: '**', component: PageNotFoundComponent
  },
];
