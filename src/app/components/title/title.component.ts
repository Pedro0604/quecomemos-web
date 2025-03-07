import {
  AfterViewInit,
  booleanAttribute,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {LayoutService} from '../../layout/layout.service';
import {capitalize} from '../../utils/utils';

@Component({
  selector: 'app-title',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './title.component.html',
  standalone: true
})
export class TitleComponent implements AfterViewInit, OnChanges {
  @Input({transform: booleanAttribute}) showVegetariano: boolean = false;
  @Input({transform: booleanAttribute}) femenino: boolean = false;
  @Input({transform: booleanAttribute}) showVolver: boolean = false;
  @Input({required: true}) title!: string;

  constructor(private layoutService: LayoutService) {
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  setTitle(): void {
    this.title = this.title.split(' ').map(word => word.length > 3 ? capitalize(word) : word).join(' ');
    this.layoutService.setTitle(this.title);
  }

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
    this.setTitle();
  }

  getClasses(): string {
    if (this.showVegetariano) {
      if (this.showVolver) {
        return 'justify-between';
      } else {
        return 'justify-end';
      }
    }
    if (this.showVolver) {
      return 'justify-start';
    }
    return '';
  }

  protected readonly history = history;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['title']) {
      this.setTitle();
    }
  }
}
