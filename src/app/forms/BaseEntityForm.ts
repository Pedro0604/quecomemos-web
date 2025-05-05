import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {FormStateHandler} from './FormStateHandler';
import {CrudService} from '../crud-service/crud.service';
import {FormService} from './service/form.service';
import {Injectable, OnInit, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import {Entidad, entidadIsFemenina, getEntidadNombre} from '../permiso/entidad';

@Injectable()
export abstract class BaseEntityForm<T extends { id: number }, DTO, R> extends FormStateHandler implements OnInit {
  entity: T | null = null;
  relatedData: R[] = [];
  readonly title = signal('');
  readonly submittingText = signal('');
  protected abstract redirectUrlOnCreation: string;
  private readonly articulo: string;
  private readonly entidadConArticulo: string;

  protected constructor(
    protected router: Router,
    protected notificationService: NotificationService,
    protected formService: FormService,
    protected service: CrudService<T, DTO>,
    protected route: ActivatedRoute,
    private entidad: Entidad,
    protected readonly submitHeaders: HttpHeaders = new HttpHeaders(),
  ) {
    super();
    this.service = service;
    this.articulo = entidadIsFemenina(this.entidad) ? 'la' : 'el';
    this.entidadConArticulo = `${this.articulo} ${getEntidadNombre(this.entidad)}`;

    this.title.set(`Crear ${getEntidadNombre(this.entidad)}`);
    this.submittingText.set(`Creando ${getEntidadNombre(this.entidad)}`);
  }

  public async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    this.loading = true;

    await this.loadEntityData(id);

    this.extraOnInit();
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && this.form.dirty && !this.error && !this.loading) {
      if (await this.beforeSavingEntity()) {
        this.saveEntity();
      }
    } else {
      this.formService.validateAllFields(this.form);
    }
  }

  // Metodo para cargar datos relacionados como menús/comidas para autocomplete
  protected loadRelatedData(): Promise<R[]> {
    return Promise.resolve([]);
  }

  // Metodo abstracto para realizar acciones adicionales en el ngOnInit
  protected extraOnInit(): void {
  }

  /*
    * Metodo que se ejecuta cuando ocurre un error en el submit
    * Retorna true si se manejo el error, false en caso contrario
   */
  protected onSubmitError(error: any): boolean {
    return false;
  }

  protected onSubmitSuccess(createdEntity: T): void {
  }

  protected saveEntity(): void {
    const dto: DTO = this.mapToDTO(this.form.value);

    const isModification = !!this.entity;
    const request$ = isModification ? this.service.update(this.entity!.id, dto, this.submitHeaders) : this.service.create(dto, this.submitHeaders);

    this.loading = true;
    request$.subscribe({
      error: (error: any) => {
        if (this.onSubmitError(error)) {
          this.loading = false;
          return;
        }

        let errorMessage = `Error al ${isModification ? 'modificar' : 'crear'} ${this.entidadConArticulo}`;
        if (error.status === 500) {
          this.error = true;
        } else {
          errorMessage = error.error || errorMessage;
        }

        this.notificationService.show(errorMessage);
        console.error(errorMessage);
        console.error(error);
        this.loading = false;
      },
      next: (createdEntity) => {
        this.onSubmitSuccess(createdEntity);
        this.loading = false;
      },
      complete: () => {
        this.notificationService.show(`${isModification ? 'Modificación' : 'Creación'} exitosa de ${this.entidadConArticulo}`);
        this.router.navigate([this.redirectUrlOnCreation]);
        this.loading = false;
      }
    });
  }

  protected abstract mapToDTO(formValue: any): DTO;

  protected beforeSavingEntity(): Promise<boolean> {
    return new Promise<boolean>((resolve) => resolve(true));
  }

  private async loadEntityData(id: number | null): Promise<void> {
    try {
      const entityPromise: Promise<T | null> = id
        ? firstValueFrom(this.service.getById(id))
        : Promise.resolve(null);
      const relatedDataPromise: Promise<R[]> = this.loadRelatedData();
      const [entityData, relatedData] = await Promise.all([entityPromise, relatedDataPromise]);
      this.relatedData = relatedData ?? [];

      if (entityData) {
        this.entity = entityData;
        this.form.patchValue(this.entity);
        this.title.set(`Modificar ${getEntidadNombre(this.entidad)}`);
        this.submittingText.set(`Modificando ${getEntidadNombre(this.entidad)}`);
      }
    } catch (error: any) {
      this.error = true;
      console.error(`Error al obtener ${this.entidadConArticulo}`);
      console.error(error);
      this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
    } finally {
      this.loading = false;
    }
  }
}
