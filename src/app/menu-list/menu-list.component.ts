import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {LayoutService} from '../layout/layout.service';
import {MenuComponent} from '../menu/menu.component';
import {Menu} from '../menu/menu.model';
import {TipoComida} from '../comida/comida.model';

@Component({
  selector: 'app-menu-list',
  imports: [
    MatIcon,
    MenuComponent
  ],
  templateUrl: './menu-list.component.html',
  standalone: true,
  styleUrl: './menu-list.component.css'
})

export class MenuListComponent implements AfterViewInit{
  menus: Menu[] = [
    {
      id: 1,
      nombre: 'Menu 1',
      precio: 3000,
      vegetariano: false,
      comidas: [
        {
          id: 1,
          nombre: 'Milanesa con papas fritas',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREkM-b52qYemhi5JAFK2WCDzoyuKDKao3tm0mYyi1n0uo-r98j7gFzb6QkeJ2rkfFjFwc&usqp=CAU',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2500,
          vegetariana: false
        },
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        }
      ]
    },
    {
      id: 2,
      nombre: 'Menu 2',
      precio: 1233,
      vegetariano: true,
      comidas: [
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        },
        {
          id: 3,
          nombre: 'Tarta de verduras',
          urlImagen: null,
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: true
        },
        {
          id: 4,
          nombre: 'Flan',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7yBxpmPgQ94Xn-SefUnOvawUKuBWFM3SGMvFKAOkEq1HysurMIesoCxaT_XNu_e1BZU&usqp=CAU',
          tipoComida: 'POSTRE',
          precio: 1000,
          vegetariana: true
        }
      ]
    },
    {
      id: 3,
      nombre: 'Menu 3',
      precio: 2345,
      vegetariano: false,
      comidas: [
        {
          id: 5,
          nombre: 'Canelones de verdura y carne',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIY3Yje7xvhDd0DcSpkio47P48Gg9kJPULzw&s',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: false
        },
        {
          id: 6,
          nombre: 'Jugo de naranja',
          urlImagen: null,
          tipoComida: 'BEBIDA',
          precio: 1000,
          vegetariana: false
        }
      ]
    },
    {
      id: 4,
      nombre: 'Menu 1',
      precio: 3000,
      vegetariano: false,
      comidas: [
        {
          id: 1,
          nombre: 'Milanesa con papas fritas',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREkM-b52qYemhi5JAFK2WCDzoyuKDKao3tm0mYyi1n0uo-r98j7gFzb6QkeJ2rkfFjFwc&usqp=CAU',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2500,
          vegetariana: false
        },
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        }
      ]
    },
    {
      id: 5,
      nombre: 'Menu 2',
      precio: 1233,
      vegetariano: true,
      comidas: [
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        },
        {
          id: 3,
          nombre: 'Tarta de verduras',
          urlImagen: null,
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: true
        },
        {
          id: 4,
          nombre: 'Flan',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7yBxpmPgQ94Xn-SefUnOvawUKuBWFM3SGMvFKAOkEq1HysurMIesoCxaT_XNu_e1BZU&usqp=CAU',
          tipoComida: 'POSTRE',
          precio: 1000,
          vegetariana: true
        }
      ]
    },
    {
      id: 6,
      nombre: 'Menu 3',
      precio: 2345,
      vegetariano: false,
      comidas: [
        {
          id: 5,
          nombre: 'Canelones de verdura y carne',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIY3Yje7xvhDd0DcSpkio47P48Gg9kJPULzw&s',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: false
        },
        {
          id: 6,
          nombre: 'Jugo de naranja',
          urlImagen: null,
          tipoComida: 'BEBIDA',
          precio: 1000,
          vegetariana: false
        }
      ]
    },
    {
      id: 7,
      nombre: 'Menu 1',
      precio: 3000,
      vegetariano: false,
      comidas: [
        {
          id: 1,
          nombre: 'Milanesa con papas fritas',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREkM-b52qYemhi5JAFK2WCDzoyuKDKao3tm0mYyi1n0uo-r98j7gFzb6QkeJ2rkfFjFwc&usqp=CAU',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2500,
          vegetariana: false
        },
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        }
      ]
    },
    {
      id: 8,
      nombre: 'Menu 2',
      precio: 1233,
      vegetariano: true,
      comidas: [
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        },
        {
          id: 3,
          nombre: 'Tarta de verduras',
          urlImagen: null,
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: true
        },
        {
          id: 4,
          nombre: 'Flan',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7yBxpmPgQ94Xn-SefUnOvawUKuBWFM3SGMvFKAOkEq1HysurMIesoCxaT_XNu_e1BZU&usqp=CAU',
          tipoComida: 'POSTRE',
          precio: 1000,
          vegetariana: true
        }
      ]
    },
    {
      id: 9,
      nombre: 'Menu 3',
      precio: 2345,
      vegetariano: false,
      comidas: [
        {
          id: 5,
          nombre: 'Canelones de verdura y carne',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIY3Yje7xvhDd0DcSpkio47P48Gg9kJPULzw&s',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: false
        },
        {
          id: 6,
          nombre: 'Jugo de naranja',
          urlImagen: null,
          tipoComida: 'BEBIDA',
          precio: 1000,
          vegetariana: false
        }
      ]
    },
    {
      id: 10,
      nombre: 'Menu 1',
      precio: 3000,
      vegetariano: false,
      comidas: [
        {
          id: 1,
          nombre: 'Milanesa con papas fritas',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREkM-b52qYemhi5JAFK2WCDzoyuKDKao3tm0mYyi1n0uo-r98j7gFzb6QkeJ2rkfFjFwc&usqp=CAU',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2500,
          vegetariana: false
        },
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        }
      ]
    },
    {
      id: 11,
      nombre: 'Menu 2',
      precio: 1233,
      vegetariano: true,
      comidas: [
        {
          id: 2,
          nombre: 'Agua',
          urlImagen: 'https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040129_f.jpg',
          tipoComida: 'BEBIDA',
          precio: 750,
          vegetariana: true
        },
        {
          id: 3,
          nombre: 'Tarta de verduras',
          urlImagen: null,
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: true
        },
        {
          id: 4,
          nombre: 'Flan',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs7yBxpmPgQ94Xn-SefUnOvawUKuBWFM3SGMvFKAOkEq1HysurMIesoCxaT_XNu_e1BZU&usqp=CAU',
          tipoComida: 'POSTRE',
          precio: 1000,
          vegetariana: true
        }
      ]
    },
    {
      id: 12,
      nombre: 'Menu 3',
      precio: 2345,
      vegetariano: false,
      comidas: [
        {
          id: 5,
          nombre: 'Canelones de verdura y carne',
          urlImagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIY3Yje7xvhDd0DcSpkio47P48Gg9kJPULzw&s',
          tipoComida: 'PLATO_PRINCIPAL',
          precio: 2000,
          vegetariana: false
        },
        {
          id: 6,
          nombre: 'Jugo de naranja',
          urlImagen: null,
          tipoComida: 'BEBIDA',
          precio: 1000,
          vegetariana: false
        }
      ]
    }
  ];

  ordenComidas: TipoComida[] = ['ENTRADA', 'PLATO_PRINCIPAL', 'POSTRE', 'BEBIDA'];

  constructor(private layoutService: LayoutService) {
    this.menus.forEach(menu => {
      menu.comidas.sort((a, b) => {
        return this.ordenComidas.indexOf(a.tipoComida) - this.ordenComidas.indexOf(b.tipoComida);
      });
    });
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any>;

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Todos los menús');
    this.layoutService.setExtra(this.extraTemplate);
  }
}
