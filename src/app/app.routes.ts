import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {NotFoundComponent} from './error-pages/page-not-found/not-found.component';
import {MenuListComponent} from './menu/list/menu-list.component';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './auth/guards/auth.guards';
import {MenuFormComponent} from './menu/form/menu-form.component';
import {ComidaFormComponent} from './comida/form/comida-form.component';
import {ComidaListComponent} from './comida/list/comida-list.component';
import {MenuDiarioListComponent} from './menu-diario/list/menu-diario-list.component';
import {MenuDiarioFormComponent} from './menu-diario/form/menu-diario-form.component';
import {UserFormComponent} from './user/form/user-form.component';
import {GuestGuard} from './auth/guards/guest.guards';
import {ForbiddenComponent} from './error-pages/forbidden-page/forbidden.component';
import {SugerenciaListComponent} from './sugerencia/list/sugerencia-list.component';
import {SugerenciaFormComponent} from './sugerencia/form/sugerencia-form.component';
import {BuzonComponent} from './sugerencia/buzon/buzon.component';
import {Entidad, getEntidadLink} from './permiso/entidad';
import {Accion} from './permiso/accion';
import {ResponsableListComponent} from './responsable/list/responsable-list.component';
import {ResponsableFormComponent} from './responsable/form/responsable-form.component';
import {CarritoComponent} from './carrito/component/carrito.component';
import {PagoComponent} from './pago/component/pago.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/carta',
    pathMatch: 'full'
  },
  {
    path: 'carta',
    component: HomeComponent,
    title: 'Carta Semanal',
    data: {
      includeInLayout: true
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Inicio de Sesión',
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro de Usuario',
    canActivate: [GuestGuard]
  },
  {
    path: getEntidadLink(Entidad.MENU_DIARIO),
    component: MenuDiarioListComponent,
    title: 'Menús Diarios',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER_TODOS,
        entidad: Entidad.MENU_DIARIO
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.MENU_DIARIO)}/create`,
    component: MenuDiarioFormComponent,
    title: 'Crear un Menú Diario',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.CREAR,
        entidad: Entidad.MENU_DIARIO
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.MENU_DIARIO)}/edit/:id`,
    component: MenuDiarioFormComponent,
    title: 'Editar un Menú Diario',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.EDITAR,
        entidad: Entidad.MENU_DIARIO
      }
    }
  },
  {
    path: `${getEntidadLink((Entidad.MENU))}`,
    component: MenuListComponent,
    title: 'Menús',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER_TODOS,
        entidad: Entidad.MENU
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink((Entidad.MENU))}/create`,
    component: MenuFormComponent,
    title: 'Crear un Menú',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.CREAR,
        entidad: Entidad.MENU
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.MENU)}/edit/:id`,
    component: MenuFormComponent,
    title: 'Editar un Menú',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.EDITAR,
        entidad: Entidad.MENU
      }
    }
  },
  {
    path: getEntidadLink(Entidad.COMIDA),
    component: ComidaListComponent,
    title: 'Comidas',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER_TODOS,
        entidad: Entidad.COMIDA
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.COMIDA)}/create`,
    component: ComidaFormComponent,
    title: 'Crear una Comida',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.CREAR,
        entidad: Entidad.COMIDA
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.COMIDA)}/edit/:id`,
    component: ComidaFormComponent,
    title: 'Editar una Comida',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.EDITAR,
        entidad: Entidad.COMIDA
      }
    }
  },
  {
    path: `${getEntidadLink(Entidad.SUGERENCIA)}`,
    component: SugerenciaListComponent,
    title: 'Sugerencias',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER_TODOS,
        entidad: Entidad.SUGERENCIA
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.SUGERENCIA)}/create`,
    component: SugerenciaFormComponent,
    title: 'Crear una Sugerencia',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.CREAR,
        entidad: Entidad.SUGERENCIA
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.SUGERENCIA)}/edit/:id`,
    component: SugerenciaFormComponent,
    title: 'Editar una Sugerencia',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.EDITAR,
        entidad: Entidad.SUGERENCIA
      }
    }
  },
  {
    path: 'buzon',
    component: BuzonComponent,
    title: 'Buzón de Sugerencias',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER_BUZON,
        entidad: Entidad.CLIENTE
      }
    }
  },
  {
    path: `${getEntidadLink(Entidad.RESPONSABLE_DE_TURNO)}`,
    component: ResponsableListComponent,
    title: 'Responsables de Turno',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER_TODOS,
        entidad: Entidad.RESPONSABLE_DE_TURNO
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.RESPONSABLE_DE_TURNO)}/create`,
    component: ResponsableFormComponent,
    title: 'Crear un Responsable de Turno',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.CREAR,
        entidad: Entidad.RESPONSABLE_DE_TURNO
      },
      includeInLayout: true
    }
  },
  {
    path: `${getEntidadLink(Entidad.RESPONSABLE_DE_TURNO)}/:id`,
    component: ResponsableFormComponent,
    title: 'Editar un Responsable de Turno',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.EDITAR,
        entidad: Entidad.RESPONSABLE_DE_TURNO
      }
    }
  },
  {
    path: `${getEntidadLink(Entidad.CLIENTE)}/:id`,
    component: UserFormComponent,
    title: 'Mi Perfil',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.EDITAR,
        entidad: Entidad.CLIENTE
      }
    }
  },
  {
    path: 'carrito',
    component: CarritoComponent,
    title: 'Mi Carrito',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.VER,
        entidad: Entidad.PEDIDO
      }
    }
  },
  {
    path: 'pagar',
    component: PagoComponent,
    title: 'Finalizar Compra',
    canActivate: [AuthGuard],
    data: {
      permiso: {
        accion: Accion.CREAR,
        entidad: Entidad.PAGO
      }
    }
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
    title: 'Acceso Prohibido'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'No encontrado'
  }
];
