import {Injectable, TemplateRef} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private titleSource = new BehaviorSubject<string>('');
  currentTitle$ = this.titleSource.asObservable();

  setTitle(title: string): void {
    this.titleSource.next(title);
  }

  private extraSource = new BehaviorSubject<TemplateRef<any> | null>(null);
  currentExtra$ = this.extraSource.asObservable();

  setExtra(extra: TemplateRef<any> | null): void {
    this.extraSource.next(extra);
  }
}
