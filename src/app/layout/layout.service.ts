import {Injectable, TemplateRef} from '@angular/core';
import {BehaviorSubject, filter} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private titleSource = new BehaviorSubject<string>('');
  currentTitle$ = this.titleSource.asObservable();
  private extraSource = new BehaviorSubject<TemplateRef<any> | null>(null);
  currentExtra$ = this.extraSource.asObservable();

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setTitle('');
        this.setExtra(null);
      });
  }

  setTitle(title: string): void {
    this.titleSource.next(title);
  }

  setExtra(extra: TemplateRef<any> | null): void {
    this.extraSource.next(extra);
  }
}
