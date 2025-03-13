import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {User, UserDTO} from '../user.model';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {concatMap, first, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService, Credenciales, Role} from '../../auth/service/auth.service';
import {FormService, onlyLettersValidator, urlValidator} from '../../forms/service/form.service';
import {SubmitButtonComponent} from '../../forms/components/submit-button/submit-button.component';
import {FormComponent} from '../../forms/components/form/form.component';
import {TitleComponent} from '../../components/title/title.component';
import {InputComponent} from '../../forms/components/fields/input/input.component';
import {FormStateComponent} from '../../forms/components/form-state/form-state.component';
import {MatAnchor} from '@angular/material/button';
import {BaseEntityForm} from '../../forms/BaseEntityForm';
import {UserService} from '../service/user.service';
import {MatError} from '@angular/material/input';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    SubmitButtonComponent,
    FormComponent,
    TitleComponent,
    InputComponent,
    FormStateComponent,
    MatAnchor,
    MatError,
    RouterLink,
  ],
  templateUrl: './user-form.component.html',
  standalone: true,
  styleUrl: './user-form.component.css'
})
export class UserFormComponent extends BaseEntityForm<User, UserDTO, void> implements OnInit {
  user: User | null = null;

  form: FormGroup

  // roles: Role[] = ['clientes', 'responsables', 'administradores'];

  protected override redirectUrlOnCreation: string = '/carta';

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    router: Router,
    notificationService: NotificationService,
    formService: FormService,
    service: UserService,
    route: ActivatedRoute,
  ) {
    super(router, notificationService, formService, service, route, 'usuario', false);
    this.form = this.fb.group({
      nombre: ['', [onlyLettersValidator]],
      apellido: ['', [onlyLettersValidator]],
      dni: [''],
      email: [''],
      urlImagen: ['', [urlValidator]],
      clave: ['']
    });
  }

  protected override extraOnInit(): void {
    if (!this.entity) {
      this.error = true;
    }
  }

  // saveUser(): void {
  //   const dto: UserDTO = this.form.value;
  //
  //   if (this.user?.id) {
  //     this.service.update(this.user.id, dto).subscribe({
  //       complete: () => {
  //         this.notificationService.show('Usuario actualizado correctamente');
  //         this.router.navigate(['/carta']);
  //       },
  //       error: error => {
  //         this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde.');
  //         console.error('Error al modificar el usuario', error);
  //       }
  //     });
  //   }
  // }

  mapToDTO(formValue: any): UserDTO {
    return formValue as UserDTO;
  }

  // TODO - HACER Q SE MUESTRE LA CONFIRMACIÓN
  // onSubmit(): void {
  //   if (this.form.valid && this.form.dirty && !this.error && !this.loading) {
  //     const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //       width: '400px',
  //       disableClose: true // Evita que se cierre sin elegir una opción
  //     });
  //
  //     dialogRef.afterClosed().subscribe(password => {
  //       if (password) {
  //         const credenciales: Credenciales = {
  //           dni: this.user!.dni.toString(),
  //           clave: password
  //         };
  //
  //         of(...this.roles).pipe(
  //           concatMap((role) =>
  //             this.authService.authenticate(role, credenciales).pipe(
  //               catchError(() => of(null)) // Si falla, retorna null y sigue con el siguiente rol
  //             )
  //           ),
  //           first((response) => response && response.headers && response.headers.get("authorization"), null)// Detiene el flujo en el primer login exitoso
  //         ).subscribe({
  //           next: (response) => {
  //             if (response) {
  //               this.saveUser();
  //             } else {
  //               this.notificationService.show('La contraseña ingresada es incorrecta. Vuelva a intentarlo');
  //             }
  //           },
  //           error: () => {
  //             this.notificationService.show('Error en la autenticación. Vuelva a intentarlo');
  //           }
  //         });
  //
  //       } else {
  //         console.log('Modificación cancelada');
  //       }
  //     });
  //   } else {
  //     this.formService.validateAllFields(this.form);
  //   }
  // }
}
