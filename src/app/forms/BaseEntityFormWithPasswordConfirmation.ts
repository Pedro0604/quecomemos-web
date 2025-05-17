import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {CrudService} from '../crud-service/crud.service';
import {FormService} from './service/form.service';
import {Injectable, OnInit} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Entidad} from '../permiso/entidad';
import {BaseEntityForm} from './BaseEntityForm';
import {DialogConfirmWithPassword} from '../components/dialog-confirmar/dialog-confirm-with-password.component';
import {Credenciales} from '../user/user.model';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../auth/service/auth.service';

@Injectable()
export abstract class BaseEntityFormWithPasswordConfirmation<T extends {
  id: number
}, DTO, R> extends BaseEntityForm<T, DTO, R> implements OnInit {
  protected constructor(
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: CrudService<T, DTO>,
    route: ActivatedRoute,
    entidad: Entidad,
    private dialog: MatDialog,
    protected authService: AuthService,
    private onlyOnEdition: boolean = true,
    submitHeaders: HttpHeaders = new HttpHeaders(),
  ) {
    super(router, notificationService, formService, service, route, entidad, submitHeaders);
  }

  protected override async beforeSavingEntity(): Promise<boolean> {
    if (this.onlyOnEdition && !!this.entity) {
      const dialogRef = this.dialog.open(DialogConfirmWithPassword, {
        width: '400px',
        disableClose: true
      });

      const password = await firstValueFrom(dialogRef.afterClosed());

      if (!password) {
        return false;
      }

      const credenciales: Credenciales = {
        dni: this.form.get('dni')?.value,
        clave: password
      };

      try {
        const response = await firstValueFrom(this.authService.authenticate(credenciales, new HttpHeaders({'X-Skip-Auth-Redirect': 'true'})));

        const token = response?.headers?.get('Authorization');

        if (!token || !this.authService.isTokenValid(token)) {
          this.notificationService.show('Contraseña incorrecta. Intentá nuevamente.');
          return false;
        }

        return true;
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.notificationService.show('Contraseña incorrecta. Intentá nuevamente.');
        } else {
          this.notificationService.show('Error al autenticar. Por favor, intenta nuevamente.');
        }
        return false;
      }
    }
    return true;
  }

}
