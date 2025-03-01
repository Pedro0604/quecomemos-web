import {AfterViewInit, booleanAttribute, Component, Input, TemplateRef, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';
import {LayoutService} from '../../layout/layout.service';

@Component({
  selector: 'app-title-extra',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './title-extra.component.html',
  standalone: true
})
export class TitleExtraComponent implements AfterViewInit {
  @Input({transform: booleanAttribute}) showVegetariano: boolean = false;
  @Input({transform: booleanAttribute}) femenino: boolean = false;
  @Input({transform: booleanAttribute}) showVolver: boolean = false;

  constructor(private layoutService: LayoutService) {
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setExtra(this.extraTemplate);
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
}
