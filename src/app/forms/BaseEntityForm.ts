import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {FormStateHandler} from './FormStateHandler';
import {CrudService} from '../crud-service/crud.service';
import {FormService} from './service/form.service';
import {Injectable, OnInit, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Injectable()
export abstract class BaseEntityForm<T extends { id: number }, DTO, R> extends FormStateHandler implements OnInit {
  abstract redirectUrlOnCreation: string;

  entity: T | null = null;
  relatedData: R[] = [];

  // TODO - VER SI TIENE SENTIDO ISEDITION APLICARLO
  readonly isEdition = signal(false);
  readonly title = signal('Crear Elemento')
  readonly submittingText = signal('Creando Elemento')

  protected constructor(
    protected router: Router,
    protected notificationService: NotificationService,
    protected formService: FormService,
    protected service: CrudService<T, DTO>,
    protected route: ActivatedRoute,
  ) {
    super();
    this.service = service;
  }

  // Método para cargar datos relacionados como menús/comidas para autocomplete
  protected loadRelatedData(): Promise<R[]> {
    return Promise.resolve([]);
  }

  private async loadEntityData(id: number | null): Promise<void> {
    try {
      const entityPromise: Promise<T | null> = id
        ? firstValueFrom(this.service.getById(id))
        : Promise.resolve(null);
      const relatedDataPromise: Promise<R[]> = this.loadRelatedData();
      const [entityData, relatedData] = await Promise.all([entityPromise, relatedDataPromise]);
      this.relatedData = relatedData;

      if (entityData) {
        this.entity = entityData;
        console.log(this.entity)
        this.form.patchValue(this.entity);
        this.isEdition.set(true);
        this.title.set('Modificar Elemento');
        this.submittingText.set('Modificando Elemento');
      }
    } catch (error) {
      this.error = true;
      console.error('Error al obtener datos');
      console.error(error);
      this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
    } finally {
      this.loading = false;
    }
  }

  // Método abstracto para realizar acciones adicionales en el ngOnInit
  protected abstract extraOnInit(): void;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    this.loading = true;

    await this.loadEntityData(id);

    this.extraOnInit();
  }

  protected saveEntity(dto: DTO): void {
    this.loading = true;
    const isModification = !!this.entity;
    const request$ = isModification ? this.service.update(this.entity!.id, dto) : this.service.create(dto);

    request$.subscribe({
      error: (error: any) => {
        // TODO - DE ESTA MANERA SI SE CREA UN MENU CON EL MISMO NOMBRE Q UNO VIEJO, ME DEJA DE ANDAR EL FORM
        this.error = true;
        this.notificationService.show(isModification ? 'Error al modificar el elemento' : 'Error al crear el elemento');
        console.error(isModification ? 'Error al modificar el elemento' : 'Error al crear el elemento');
        console.error(error);
        this.loading = false;
      },
      complete: () => {
        // TODO - REEMPLAZAR ELEMENTO POR NOMBRE DE ENTIDAD
        this.notificationService.show(isModification ? 'Elemento modificado exitosamente' : 'Elemento creado exitosamente');
        this.router.navigate([this.redirectUrlOnCreation]);
        this.loading = false;
      }
    });
  }

  abstract mapToDTO(formValue: any): DTO;

  onSubmit(): void {
    if (this.form.valid && this.form.dirty && !this.error && !this.loading) {
      this.saveEntity(this.mapToDTO(this.form.value));
    } else {
      this.formService.validateAllFields(this.form);
    }
  }
}
