import { Component, inject, signal } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { FilterService } from '../../data/services/filter.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Filters } from '../../data/interfaces/filters.interface';

@Component({
  selector: 'app-filter-menu',
  imports: [
    SvgIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './filter-menu.component.html',
  styleUrl: './filter-menu.component.scss'
})
export class FilterMenuComponent {
  private filterService = inject(FilterService);

  isTagFilterOpen = signal(false);
  isUserFilterOpen = signal(false);

  form = new FormGroup({
    tags: new FormControl(''),
    user: new FormControl('')
  })

  constructor() {
    this.form.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        map(formValue => {
          this.filterService.updateFilters(formValue as Filters);
        }),
        takeUntilDestroyed()
      ).subscribe();
  }

  toggleTagFilter() {
    this.isTagFilterOpen.update((val) => !val);
  }

  toggleUserFilter() {
    this.isUserFilterOpen.update((val) => !val);
  }
}
