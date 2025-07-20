export interface Post {
  id?: string,
  title: string,
  content: string,
  authorId: string,
  timestamp: number,
  tags: string[],
  commentCount: number,
  likeCount: number,
  dislikeCount: number,
  authorUsername: string
}