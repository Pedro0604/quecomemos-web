import {isPlatformServer} from '@angular/common';
import {Directive, ElementRef, Inject, Input, OnChanges, PLATFORM_ID, Renderer2, SimpleChanges,} from '@angular/core';

type ImageSrc = string | null | undefined;

@Directive({
  // TODO - VER COMO HACER Q ANDE PARA TODAS LAS IMG
  selector: 'img',
  standalone: true
})
export class DefaultImageDirective implements OnChanges {
  @Input({required: true}) src: ImageSrc = null;

  // url link to some default image
  private defaultLocalImage = "https://static-00.iconduck.com/assets.00/no-image-icon-2048x2048-2t5cx953.png";

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private imageRef: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initImage();
  }

  private initImage() {
    // do not evaluate on SSR
    if (isPlatformServer(this.platformId)) {
      return;
    }

    // show skeleton before image is loaded
    this.renderer.addClass(this.imageRef.nativeElement, 'g-skeleton');

    const img = new Image();

    // return on no src
    if (!this.src) {
      this.setImage(this.defaultLocalImage);
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
      return;
    }

    // if possible to load image, set it to img
    img.onload = () => {
      this.setImage(this.resolveImage(this.src));
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
    };

    img.onerror = () => {
      // Set a placeholder image
      this.setImage(this.defaultLocalImage);
      this.renderer.removeClass(this.imageRef.nativeElement, 'g-skeleton');
    };

    // triggers http request to load image
    img.src = this.resolveImage(this.src);
  }

  private setImage(src: ImageSrc) {
    this.imageRef.nativeElement.setAttribute('src', src);
  }

  private resolveImage(src: ImageSrc): string {
    if (!src) {
      return this.defaultLocalImage;
    }

    return src;
  }
}
