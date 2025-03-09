import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatInput, MatLabel, MatHint} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, UserDTO} from '../user.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {UserService} from '../service/user.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {concatMap, first, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService, Credenciales} from '../../auth/service/auth.service';
import {FormService, onlyLettersValidator, urlValidator} from '../../forms/service/form.service';

type UserFormData = {
  nombre: string,
  apellido: string,
  dni: number,
  email: string,
  urlImagen: string,
  clave: string
}

@Component({
  selector: 'app-user-form',
  imports: [
    MatError,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    MatHint,
  ],
  templateUrl: './user-form.component.html',
  standalone: true,
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit, AfterViewInit {
  user: User | null = null;

  error: boolean = false;

  form: FormGroup

  errorMessages: { [key: string]: string } = {};

  roles: ('clientes' | 'responsables' | 'administradores')[] = ['clientes', 'responsables', 'administradores'];

  constructor(
    private formService: FormService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), onlyLettersValidator]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator]],
      dni: ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      email: ['', [Validators.required, Validators.email]],
      urlImagen: ['', [Validators.required, urlValidator]],
      clave: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.userService.getUserById(id).subscribe({
        next: (data) => {
          this.user = data;
          this.form.get('nombre')?.setValue(this.user.nombre);
          this.form.get('apellido')?.setValue(this.user.apellido);
          this.form.get('dni')?.setValue(this.user.dni);
          this.form.get('email')?.setValue(this.user.email);
          this.form.get('urlImagen')?.setValue(this.user.urlImagen);
          this.form.get('clave')?.setValue(this.user.clave);
        },
        error: error => {
          this.error = true;
          console.error('Error al obtener el usuario', error);
          this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde.');
        }
      });

      this.layoutService.setTitle('Editar usuario');
    }
  }

  updateErrorMessage(controlName: string) {
    const control = this.form.get(controlName);
    this.errorMessages[controlName] = this.formService.updateErrorMessage(control);
  }

  saveUser(userData: UserFormData): void {
    const dto: UserDTO = {
      nombre: userData.nombre,
      apellido: userData.apellido,
      dni: userData.dni,
      email: userData.email,
      urlImagen: userData.urlImagen,
      clave: userData.clave
    }

    if (this.user?.id) {
      this.userService.updateUser(this.user.id, dto).subscribe({
        complete: () => {
          this.notificationService.show('Usuario actualizado correctamente');
          this.router.navigate(['/carta']);
        },
        error: error => {
          this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde.');
          console.error('Error al modificar el usuario', error);
        }
      });
    }

  }

  onSubmit(): void {
    if (this.form.valid) {
      const userData: UserFormData = this.form.value;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        disableClose: true // Evita que se cierre sin elegir una opción
      });

      dialogRef.afterClosed().subscribe(password => {
        if (password) {
          const credenciales: Credenciales = {
            dni: userData.dni.toString(),
            clave: password
          };

          of(...this.roles).pipe(
            concatMap((role) =>
              this.authService.authenticate(role, credenciales).pipe(
                catchError(() => of(null)) // Si falla, retorna null y sigue con el siguiente rol
              )
            ),
            first((response) => response && response.headers && response.headers.get("authorization"), null)// Detiene el flujo en el primer login exitoso
          ).subscribe({
            next: (response) => {
              if (response) {
                this.saveUser(userData);
              } else {
                this.notificationService.show('La contraseña ingresada es incorrecta. Vuelva a intentarlo');
              }
          },
            error: () => {
            this.notificationService.show('Error en la autenticación. Vuelva a intentarlo');
          }
          });

        } else {
          console.log('Modificación cancelada');
        }

      });

    } else {
      this.notificationService.show('Error al enviar el formulario. Vuelva a intentarlo.');
    }

  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
  }

  protected readonly history = history;
}
