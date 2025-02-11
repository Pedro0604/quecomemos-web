import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatError, MatFormField, MatPrefix} from '@angular/material/form-field';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatInput, MatLabel, MatHint} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSelect} from '@angular/material/select';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {User, UserDTO} from '../user.model';
import {FormErrorService, onlyLettersValidator, urlValidator} from '../../formError/form-error.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LayoutService} from '../../layout/layout.service';
import {NotificationService} from '../../notification/notification.service';
import {UserService} from '../service/user.service';

type UserFormData = {
  nombre: string,
  apellido: string,
  dni: number,
  email: string,
  urlImagen: string,
  clave: string,
  confirmClave: string
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

  constructor(
    private formErrorService: FormErrorService,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private layoutService: LayoutService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), onlyLettersValidator]],
      apellido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), onlyLettersValidator]],
      dni: ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      email: ['', [Validators.required, Validators.email]],
      urlImagen: ['', [Validators.required, urlValidator]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      confirmClave: ['', [Validators.required]],
    }, {
      validators: this.claveMatchValidator
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
    this.errorMessages[controlName] = this.formErrorService.updateErrorMessage(control);
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

    console.log('User data: ', dto);
    console.log('ID: ', this.user?.id);

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
      this.saveUser(userData);
    } else {
      this.notificationService.show('Error al enviar el formulario. Vuelva a intentarlo.');
    }
  }

  claveMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const clave = group.get('clave')?.value;
    const confirmClave = group.get('confirmClave')?.value;

    if (clave && confirmClave && clave !== confirmClave) {
      group.get('confirmClave')?.setErrors({clavesDoNotMatch: true});
      return {clavesDoNotMatch: true};
    }
    return null;
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
  }

  protected readonly history = history;
}
