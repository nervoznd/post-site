import { inject, Injectable } from '@angular/core';
import { child, Database, get, push, ref, set } from '@angular/fire/database';
import { PostComment } from '../interfaces/comment.interface';
import { from, map, Observable, switchMap } from 'rxjs';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private db = inject(Database);
  private postService = inject(PostService);
  private commentsRef = ref(this.db, 'post_comments');

  addComment(postId: string, comment: PostComment): Observable<string> {
    const newCommentRef = push(child(this.commentsRef, postId));
    const id = newCommentRef.key;
    const commentWithId = { ...comment, id };
    return from(set(newCommentRef, commentWithId))
      .pipe(
        switchMap(() => 
          this.postService.incrementCommentCount(postId, 1).pipe(
            map(() => id)
          )
        )
      );
  }

  getPostComments(postId: string): Observable<PostComment[]> {
    return from(get(child(this.commentsRef, postId)))
      .pipe(
        map(snapshot => {
          const val = snapshot.val();
          if (!val) return [];
          return Object.values(val) as PostComment[];
        }),
        map(comments => comments.sort((a, b) => b.timestamp - a.timestamp))
      );
  }
}
