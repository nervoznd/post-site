import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FilterMenuComponent } from "../filter-menu/filter-menu.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [
    SidebarComponent,
    FilterMenuComponent,
    RouterOutlet
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
