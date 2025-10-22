import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ← Add this import
import { SocketService } from '../../shared/socket.service';
import { CommentService } from '../../shared/comment.service';

@Component({
  selector: 'app-comment-thread',
  standalone: true, // ← Make it standalone
  imports: [CommonModule, FormsModule], // ← Add FormsModule here
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentThreadComponent {
  @Input() comment: any;
  @Input() articleId!: string;
  replyContent = '';
  showReplyForm = false;

  constructor(private socketService: SocketService, private commentService: CommentService,
  ) {}

  /**
 * Toggle the visibility of the reply form for a comment.
 */
  toggleReplyForm() {
    this.showReplyForm = !this.showReplyForm;
  }

  /**
 * Send a reply to a comment, update the comment's children, and reset the form.
 */
  sendReply() {
    if (!this.replyContent.trim()) return;

    const reply = {
      articleId: this.articleId,
      content: this.replyContent,
      parentId: this.comment._id
    };

    this.commentService.createComment(reply).subscribe({
      next: (res) => {
        this.comment.children = this.comment.children || [];
        this.comment.children.push(res);
        this.replyContent = '';
        this.showReplyForm = false;
      },
      error: (err) => console.error(err)
    });
  }
}