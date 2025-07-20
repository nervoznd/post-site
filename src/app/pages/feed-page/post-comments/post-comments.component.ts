import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { CommentService } from '../../../data/services/comment.service';
import { BehaviorSubject } from 'rxjs';
import { PostComment } from '../../../data/interfaces/comment.interface';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-post-comments',
  imports: [
    SvgIconComponent,
    AsyncPipe,
    ReactiveFormsModule
  ],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.scss'
})
export class PostCommentsComponent {
  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  @Input() postId: string = '';
  @Output() onCommentAdded = new EventEmitter<void>();

  private commentsSubject = new BehaviorSubject<PostComment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  newCommentContent = new FormControl('', Validators.required);

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.commentService.getPostComments(this.postId)
      .subscribe(comments => this.commentsSubject.next(comments));
  }

  publishComment() {
    const content = this.newCommentContent.value;

    if (!content || this.newCommentContent.invalid) {
      console.log('Invalid data.');
      return;
    }

    const newComment: PostComment = {
      content: content,
      authorId: this.authService.currentUser!.uid,
      authorUsername: this.authService.currentUserProfile!.username,
      timestamp: Date.now()
    }

    this.commentService.addComment(this.postId, newComment).subscribe({
      next: () => {
        this.newCommentContent.reset();
        this.onCommentAdded.emit();
        this.loadComments();
      },
      error: (error) => {
        console.error('Add comment error:', error);
      }
    });
  }
}
