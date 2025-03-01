import {booleanAttribute, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './spinner.component.html',
  standalone: true
})
export class SpinnerComponent implements OnInit, OnChanges {
  @Input({required: true, transform: booleanAttribute}) loading!: boolean;

  showSpinner: boolean = false;

  ngOnInit(): void {
    this.setLoadingState(this.loading);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading']) {
      this.setLoadingState(changes['loading'].currentValue);
    }
  }

  setLoadingState(isLoading: boolean): void {
    this.loading = isLoading;
    if (isLoading) {
      setTimeout(() => {
        if (this.loading) {
          this.showSpinner = true;
        }
      }, 300);
    } else {
      this.showSpinner = false;
    }
  }
}
