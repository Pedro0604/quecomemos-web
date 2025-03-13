import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../notification/notification.service';
import {FormStateHandler} from './FormStateHandler';
import {CrudService} from '../crud-service/crud.service';
import {FormService} from './service/form.service';
import {Injectable, OnInit, signal} from '@angular/core';
import {firstValueFrom} from 'rxjs';

@Injectable()
export abstract class BaseEntityForm<T extends { id: number }, DTO, R> extends FormStateHandler implements OnInit {
    protected abstract redirectUrlOnCreation: string;

    entity: T | null = null;
    relatedData: R[] = [];

    readonly title = signal('');
    readonly submittingText = signal('');

    private readonly articulo: string;
    private readonly entidadConArticulo: string;

    protected constructor(
        protected router: Router,
        protected notificationService: NotificationService,
        protected formService: FormService,
        protected service: CrudService<T, DTO>,
        protected route: ActivatedRoute,
        private entityName: string,
        femenino: boolean
    ) {
        super();
        this.service = service;
        this.articulo = femenino ? 'la' : 'el';
        this.entidadConArticulo = `${this.articulo} ${entityName}`;

        this.title.set(`Crear ${this.entityName}`);
        this.submittingText.set(`Creando ${this.entityName}`);
    }

    // Metodo para cargar datos relacionados como menús/comidas para autocomplete
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
                this.form.patchValue(this.entity);
                this.title.set(`Modificar ${this.entityName}`);
                this.submittingText.set(`Modificando ${this.entityName}`);
            }
        } catch (error) {
            this.error = true;
            console.error(`Error al obtener ${this.entidadConArticulo}`);
            console.error(error);
            this.notificationService.show('Ha ocurrido un error. Por favor, intente nuevamente más tarde');
        } finally {
            this.loading = false;
        }
    }

    // Metodo abstracto para realizar acciones adicionales en el ngOnInit
    protected extraOnInit(): void {
    }

    async ngOnInit(): Promise<void> {
        const id = this.route.snapshot.params['id'];
        this.loading = true;

        await this.loadEntityData(id);

        this.extraOnInit();
    }

    protected saveEntity(): void {
        const dto: DTO = this.mapToDTO(this.form.value);

        const isModification = !!this.entity;
        const request$ = isModification ? this.service.update(this.entity!.id, dto) : this.service.create(dto);

        this.loading = true;
        request$.subscribe({
            error: (error: any) => {
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
            complete: () => {
                this.notificationService.show(`${isModification ? 'Modificación' : 'Creación'} exitosa de ${this.entidadConArticulo}`);
                this.router.navigate([this.redirectUrlOnCreation]);
                this.loading = false;
            }
        });
    }

    abstract mapToDTO(formValue: any): DTO;

    onSubmit(): void {
        if (this.form.valid && this.form.dirty && !this.error && !this.loading) {
            this.saveEntity();
        } else {
            this.formService.validateAllFields(this.form);
        }
    }
}
