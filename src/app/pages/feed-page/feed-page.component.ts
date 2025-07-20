import { Component, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '../../data/interfaces/post.interface';
import { PostComponent } from "./post/post.component";
import { AsyncPipe } from '@angular/common';
import { PostService } from '../../data/services/post.service';
import { NewPostComponent } from './new-post/new-post.component';
import { FilterService } from '../../data/services/filter.service';
import { SvgIconComponent } from '../../common-ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-feed-page',
  imports: [
    PostComponent,
    AsyncPipe,
    NewPostComponent,
    SvgIconComponent
],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss'
})
export class FeedPageComponent {
  private postService = inject(PostService);
  private filterService = inject(FilterService);

  private postsSubject = new BehaviorSubject<Post[]>([]); // Check
  posts$ = this.postsSubject.asObservable();

  isNewPostFormOpen = signal(false);

  ngOnInit() {
    this.filterService.filters$.subscribe(filters => {
      this.loadPosts(
        filters.user?.trim() === ''
          ? undefined
          : filters.user,
        filters.tags?.trim() === ''
          ? undefined
          : filters.tags?.split(',').map(val => val.trim())
      );
    });

    this.loadPosts();
  }

  loadPosts(authorUsername?: string, tags?: string[]) {
    this.postService.getFilteredPosts(authorUsername, tags)
      .subscribe(posts => this.postsSubject.next(posts));
  }

  toggleNewPostForm() {
    this.isNewPostFormOpen.update(val => !val);
  }
}
