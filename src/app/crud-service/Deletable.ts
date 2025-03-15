import {Observable} from 'rxjs';

export interface Deletable {
  delete(id: number): Observable<void>;
}
