import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../../shared/article.service';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { env } from '../../../../environment/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule, SlicePipe],
})
export class ArticleListComponent implements OnInit {
  articles: any[] = [];
  filteredArticles: any[] = []; 
  page = 1;
  limit = 10;
  search = '';
  loading = false; 
  hasMoreArticles = true;
  totalArticles = 0;

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.loadArticles();
  }


  /**
 * Navigate to the article creation page.
 */
  createArticle() {
    this.router.navigate(['/articles/create']); 
  }

  /**
 * Navigate to the article edit page for a specific article.
 * @param {any} article - The article object to edit
 */
  editArticle(article: any) {
    this.router.navigate(['/articles/edit', article._id]); 
  }

  /**
 * Navigate to the view page for a specific article.
 * @param {any} article - The article object to view
 */
  viewArticle(article: any) {
    this.router.navigate(['/articles', article._id]); 
  }

  /**
 * Delete a specific article with confirmation dialog.
 * @param {any} article - The article object to delete
 */
  deleteArticle(article: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
  
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert the deletion of "${article.title}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.articleService.deleteArticle(article._id).subscribe(
          () => {
            this.articles = this.articles.filter(a => a._id !== article._id);
            this.filteredArticles = [...this.articles];
  
            swalWithBootstrapButtons.fire(
              'Deleted!',
              'Your article has been deleted.',
              'success'
            );
          },
          (error) => {
            console.error('Error deleting article:', error);
            swalWithBootstrapButtons.fire(
              'Error!',
              'Failed to delete the article.',
              'error'
            );
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your article is safe :)',
          'error'
        );
      }
    });
  }

  /**
 * Execute a search for articles, resetting the page to 1.
 */
  searchArticles() {
    this.page = 1;
    this.loadArticles();
  }

  /**
 * Clear the current search and reload articles from the first page.
 */
  clearSearch() {
    this.search = '';
    this.page = 1;
    this.loadArticles();
  }

/**
 * Filter articles on the client side based on the search term.
 */
  filterArticles() {
    if (!this.search.trim()) {
      this.filteredArticles = this.articles;
    } else {
      const searchTerm = this.search.toLowerCase();
      this.filteredArticles = this.articles.filter(article =>
        article.title?.toLowerCase().includes(searchTerm) ||
        article.author?.name?.toLowerCase().includes(searchTerm) ||
        article.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm)) ||
        article.content?.toLowerCase().includes(searchTerm)
      );
    }
  }

/**
 * Load articles from the server with pagination and optional search term.
 */
  loadArticles() {
    this.loading = true;
    this.articleService.getArticles(this.page, this.limit, this.search)
      .subscribe({
        next: (data: any) => {
          if (this.page === 1) {
            this.articles = data.articles || data;
            this.filteredArticles = data.articles || data;
          } else {
            this.articles = [...this.articles, ...(data.articles || data)];
            this.filteredArticles = [...this.filteredArticles, ...(data.articles || data)];
          }
          
          this.hasMoreArticles = (data.articles || data).length === this.limit;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading articles:', error);
          this.loading = false;
        }
      });
  }
  
  /**
 * Load more articles by incrementing the page number.
 */
  loadMore() {
    this.page++;
    this.loadArticles();
  }

/**
 * Construct the full URL for an image.
 * @param {string} imagePath - Path of the image
 * @returns {string} Full URL or empty string if path is invalid
 */
  getImageUrl(imagePath: string) {    
    return imagePath ? `${env.envUrl}${imagePath}` : '';
  }
}