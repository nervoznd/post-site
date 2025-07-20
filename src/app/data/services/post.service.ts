import { inject, Injectable } from '@angular/core';
import { child, Database, get, increment, push, ref, remove, set, update } from '@angular/fire/database';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private db = inject(Database);
  private postsRef = ref(this.db, 'posts');

  addPost(post: Post): Observable<string> {
    const newPostRef = push(this.postsRef);
    const id = newPostRef.key;
    const postWithId = { ...post, id };
    return from(set(newPostRef, postWithId)).pipe(map(() => id));
  }

  updatePost(id: string, data: Partial<Post>): Observable<void> {
    return from(update(child(this.postsRef, id), data));
  }

  incrementCommentCount(id: string, value: number): Observable<void> {
    return from(update(child(this.postsRef, id), { commentCount: increment(value) }));
  }

  incrementLikeCount(postId: string, userId: string): Observable<boolean> {
    const likeRef = ref(this.db, `post_likes/${postId}/${userId}`);
    return from(get(likeRef)).pipe(
      switchMap(snapshot => {
        if (snapshot.exists()) {
          const updates: any = {};
          updates[`post_likes/${postId}/${userId}`] = null;
          updates[`posts/${postId}/likeCount`] = increment(-1);

          return from(update(ref(this.db), updates))
            .pipe(
              map(() => false)
            );
        }
        else {
          const updates: any = {};
          updates[`post_likes/${postId}/${userId}`] = true;
          updates[`posts/${postId}/likeCount`] = increment(1);
          return from(update(ref(this.db), updates))
            .pipe(
              map(() => true)
            );
        }
      })
    );
  }

  incrementDislikeCount(postId: string, userId: string): Observable<boolean> {
    const dislikeRef = ref(this.db, `post_dislikes/${postId}/${userId}`);
    return from(get(dislikeRef)).pipe(
      switchMap(snapshot => {
        if (snapshot.exists()) {
          const updates: any = {};
          updates[`post_dislikes/${postId}/${userId}`] = null;
          updates[`posts/${postId}/dislikeCount`] = increment(-1);

          return from(update(ref(this.db), updates))
            .pipe(
              map(() => false)
            );
        }
        else {
          const updates: any = {};
          updates[`post_dislikes/${postId}/${userId}`] = true;
          updates[`posts/${postId}/dislikeCount`] = increment(1);
          return from(update(ref(this.db), updates))
            .pipe(
              map(() => true)
            );
        }
      })
    );
  }

  getPost(id: string): Observable<Post> { // !add id
    return from(get(child(this.postsRef, id)))
      .pipe(
        map(snapshot => {
          if (!snapshot.exists()) {
            throw new Error('Post not found');
          }
          return snapshot.val() as Post;
        })
      );
  }

  deletePost(id: string): Observable<void> {
    return from(remove(child(this.postsRef, id)));
  }

  getAllPosts(): Observable<Post[]> {
    return from(get(this.postsRef))
      .pipe(
        map(snapshot => {
          const val = snapshot.val();
          if (!val) return [];
          return Object.entries(val).map(([id, post]) => ({ ...(post as Post), id}));
        }),
        map(posts => posts.sort((a, b) => b.timestamp - a.timestamp))
      )
  }

  getFilteredPosts(authorUsername?: string, tags?: string[]): Observable<Post[]> {
    return this.getAllPosts()
      .pipe(
        map(posts => posts.filter(post => {
              const matchesAuthor = authorUsername
                ? post.authorUsername.toLowerCase().includes(authorUsername.toLowerCase())
                : true;

              const matchesTags = (tags && tags.length > 0)
                ? post.tags.some(tag => tags.includes(tag))
                : true;

              return matchesAuthor && matchesTags;
          })
        )
      );
  }
}
