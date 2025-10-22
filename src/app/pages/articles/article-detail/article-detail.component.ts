import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../shared/article.service';
import { CommentService } from '../../shared/comment.service';
import { SocketService } from '../../shared/socket.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentThreadComponent } from '../comments/comments.component'; 
import { env } from '../../../../environment/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CommentThreadComponent,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  article: any = { title: '', content: '', image: null };  
  comments: any[] = [];
  newComment = '';
  editing = false;  
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private commentService: CommentService,
    private socketService: SocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(id);
      this.loadComments(id);
      this.initSocket(id);
    }
  }

  
/**
 * Fetch a single article by its ID.
 * @param {string} id - The ID of the article to load
 */
  loadArticle(id: string) {
    this.articleService.getArticleById(id)
      .subscribe(data => this.article = data);
  }

  
/**
 * Fetch all comments for a specific article.
 * @param {string} articleId - The ID of the article
 */
  loadComments(articleId: string) {
    this.commentService.getCommentsByArticle(articleId)
      .subscribe(data => this.comments = data);
  }

  /**
 * Initialize socket connection for a specific article to listen for new comments/replies.
 * @param {string} articleId - The ID of the article
 */
  initSocket(articleId: string) {
    this.socketService.connect();
    this.socketService.emit('joinArticle', { articleId });

    this.subs.push(
      this.socketService.on<any>('newComment').subscribe(comment => {
        if (comment.articleId === articleId) this.comments.push(comment);
      })
    );

    this.subs.push(
      this.socketService.on<any>('newReply').subscribe(reply => {
        const parent = this.findCommentById(reply.parentId, this.comments);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(reply);
        }
      })
    );
  }

  /**
 * Recursively find a comment by its ID in a comment tree.
 * @param {string} id - The ID of the comment to find
 * @param {any[]} comments - Array of comments to search
 * @returns {any|null} The found comment or null if not found
 */
  findCommentById(id: string, comments: any[]): any {
    for (const c of comments) {
      if (c._id === id) return c;
      if (c.children) {
        const found = this.findCommentById(id, c.children);
        if (found) return found;
      }
    }
    return null;
  }

  /**
 * Add a new comment to the article and emit it through the socket.
 */
  addComment() {
    if (!this.newComment.trim()) return;

    const comment = {
      articleId: this.article._id,
      content: this.newComment,
      parentId: null
    };

    this.commentService.createComment(comment).subscribe({
      next: (res) => {
        this.comments.push(res);
        this.newComment = '';
      },
      error: (err) => console.error(err)
    });

    this.socketService.emit('newComment', comment);
  }

  /**
 * Save the article (create or update) based on whether it has an ID.
 * @param {HTMLFormElement} form - The HTML form element containing article data
 */
  saveArticle(form: HTMLFormElement) {
    const formData = new FormData(form);

    if (this.article._id) {
      // Update
      this.articleService.updateArticle(this.article._id, formData)
        .subscribe({
          next: res => {
            this.article = res;
            this.editing = false;
          },
          error: err => console.error(err)
        });
    } else {
      // Create
      this.articleService.createArticle(formData)
        .subscribe({
          next: res => {
            this.article = res;
            this.editing = false;
          },
          error: err => console.error(err)
        });
    }
  }

  /**
 * Enable edit mode for the current article.
 */
  editArticle() {
    this.editing = true;
  }

  /**
 * Delete the current article after user confirmation.
 */
  deleteArticle() {
    if (!this.article._id) return;

    if (confirm('Are you sure you want to delete this article?')) {
      this.articleService.deleteArticle(this.article._id)
        .subscribe({
          next: () => {
            alert('Article deleted!');
            this.article = null; 
          },
          error: err => console.error(err)
        });
    }
  }

  
/**
 * Clean up on component destroy: leave socket room and unsubscribe from subscriptions.
 */
  ngOnDestroy(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.socketService.emit('leaveArticle', { articleId: id });
    this.subs.forEach(s => s.unsubscribe());
    this.socketService.disconnect();
  }

  /**
 * Construct the full URL for an image.
 * @param {string} imagePath - Path of the image
 * @returns {string} Full URL or empty string if path is invalid
 */
  getImageUrl(imagePath: string) {    
    return imagePath ? `${env.envUrl}${imagePath}` : '';
  }

  /**
 * Navigate back to the articles list page.
 */
  goBack() {
    this.router.navigate(['/articles']); 
  }
}