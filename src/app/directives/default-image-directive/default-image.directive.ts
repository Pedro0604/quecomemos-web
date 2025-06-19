import {isPlatformServer} from '@angular/common';
import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  Optional,
  PLATFORM_ID,
  SimpleChanges,
} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';

type ImageSrc = string | null | undefined;

@Directive({
  selector: 'img[defaultImage]',
  standalone: true,
})
export class DefaultImageDirective implements OnChanges {
  @Input({required: true}) src: ImageSrc = null;

  private defaultLocalImage = "https://static-00.iconduck.com/assets.00/no-image-icon-2048x2048-2t5cx953.png"

  @HostBinding('class.g-skeleton') private _skeleton = true;

  handleTooltip = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private imageRef: ElementRef,
    @Optional() private tooltip: MatTooltip
  ) {
    if (this.tooltip) {
      if (this.tooltip.message) {
        this.handleTooltip = false;
      } else {
        this.tooltip.message = "Imagen no disponible";
        this.tooltip.showDelay = 500;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initImage();
  }

  private initImage() {
    // do not evaluate on SSR
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const img = new Image();
    this._skeleton = true;

    if (!this.src) {
      this.updateImage(this.defaultLocalImage, true);
      return;
    }

    img.onload = () => this.updateImage(this.src!, false);
    img.onerror = () => this.updateImage(this.defaultLocalImage, true);

    this.updateImage(this.src!, false);
    img.src = this.src;
  }

  /**
   * Aplica la imagen, quita el skeleton y controla el tooltip
   *
   * @param src URL a aplicar
   * @param isDefault si es la imagen por defecto
   */
  private updateImage(src: string, isDefault: boolean = false) {
    this.imageRef.nativeElement.src = src;
    this._skeleton = false;

    if (this.handleTooltip && this.tooltip) {
      this.tooltip.disabled = !isDefault;
    }
  }
}
