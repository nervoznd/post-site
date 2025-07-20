import { Component, inject, Input, signal } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { Post } from '../../../data/interfaces/post.interface';
import { DatePipe } from '@angular/common';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { increment } from '@angular/fire/database';
import { PostService } from '../../../data/services/post.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-post',
  imports: [
    SvgIconComponent,
    DatePipe,
    PostCommentsComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  postService = inject(PostService);
  authService = inject(AuthService);

  @Input() post!: Post;

  isCommentsOpen = signal(false);

  toggleComments() {
    this.isCommentsOpen.update(val => !val);
  }

  incrementComment() {
    this.post.commentCount++;
  }

  like() {
    this.postService.incrementLikeCount(this.post.id!, this.authService.currentUser!.uid).subscribe(res => {
      if (res) {
        this.post.likeCount++;
      }
      else {
        this.post.likeCount--;
      }
    })
  }

  dislike() {
    this.postService.incrementDislikeCount(this.post.id!, this.authService.currentUser!.uid).subscribe(res => {
      if (res) {
        this.post.dislikeCount++;
      }
      else {
        this.post.dislikeCount--;
      }
    })
  }
}
