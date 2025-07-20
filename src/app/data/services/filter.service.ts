import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Filters } from '../interfaces/filters.interface';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<Filters>({ tags: '', user: '' });
  filters$ = this.filtersSubject.asObservable();

  updateFilters(newFilters: Filters) {
    this.filtersSubject.next(newFilters);
  }
}
