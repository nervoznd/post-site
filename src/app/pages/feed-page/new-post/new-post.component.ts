import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../../common-ui/text-input/text-input.component';
import { TextareaInputComponent } from '../../../common-ui/textarea-input/textarea-input.component';
import { Post } from '../../../data/interfaces/post.interface';
import { PostService } from '../../../data/services/post.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-new-post',
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    TextareaInputComponent
  ],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss'
})
export class NewPostComponent {
  private authService = inject(AuthService);
  private postService = inject(PostService);

  @Output() postAdded = new EventEmitter<void>();
  @Output() postCanceled = new EventEmitter<void>();

  title = new FormControl('', Validators.required);
  content = new FormControl('', Validators.required);
  tags = new FormControl('');

  form = new FormGroup({
    title: this.title,
    content: this.content,
    tags: this.tags
  });

  publishPost() {
    const { title, content, tags } = this.form.value;
    if (!title || !content || this.form.invalid) {
      console.log('Invalid data.');
      return;
    }

    const newPost: Post = {
      title: title,
      content: content,
      authorId: this.authService.currentUser!.uid,
      timestamp: Date.now(),
      tags: tags ? tags.split(',').map(val => val.trim()) : [],
      commentCount: 0,
      likeCount: 0,
      dislikeCount: 0,
      authorUsername: this.authService.currentUserProfile!.username
    }

    this.postService.addPost(newPost).subscribe({
      next: () => {
        this.form.reset();
        this.postAdded.emit();
      },
      error: (error) => {
        console.error('Add post error:', error);
      }
    })
  }

  cancel() {
    this.form.reset();
    this.postCanceled.emit();
  }
}
