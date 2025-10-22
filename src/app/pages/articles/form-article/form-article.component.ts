import { MatCardModule } from '@angular/material/card';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../shared/article.service';
import { CommonModule, SlicePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-article',
  templateUrl: './form-article.component.html',
  styleUrls: ['./form-article.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule, SlicePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule],
})
export class ArticleFormComponent implements OnInit {
  articleForm!: FormGroup;
  selectedFile!: File | null;
  previewUrl: string | ArrayBuffer | null = null;
  isEdit = false;
  articleId!: string;
  isHovering = false;
  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['']
    });

    // Si un ID existe dans l’URL so mode édition
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    if (this.articleId) {
      this.isEdit = true;
      this.articleService.getArticleById(this.articleId).subscribe((article) => {
        this.articleForm.patchValue({
          title: article.title,
          content: article.content,
          tags: article.tags?.join(', ') || ''
        });
        if (article.image) {
          this.previewUrl = article.image;
        }
      });
    }
  }

  /**
 * Handle file selection from an input element and generate a preview.
 * @param {any} event - The file input change event
 */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.selectedFile);
    }
  }

/**
 * Submit the article form to create or update an article.
 * Includes author ID, optional image, and shows success/error alerts.
 */
  onSubmit() { 
    if (this.articleForm.invalid) return;
  
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      Swal.fire({
        icon: 'error',
        title: 'Utilisateur non authentifié',
        text: 'Veuillez vous connecter pour créer ou modifier un article.',
      });
      return;
    }
  
    const user = JSON.parse(storedUser);
    const authorId = user._id; 
  
    const formData = new FormData();
    Object.entries(this.articleForm.value).forEach(([key, value]) => {
        formData.append(key, value != null ? String(value) : '');
      });
    formData.append('author', authorId);
    if (this.selectedFile) formData.append('image', this.selectedFile);
  
    const request$ = this.isEdit
      ? this.articleService.updateArticle(this.articleId, formData)
      : this.articleService.createArticle(formData);  
  
    request$.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEdit ? 'Article mis à jour' : 'Article créé',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['/articles']);
      },
      error: (err) => {
        console.error('Erreur:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue. Veuillez réessayer.',
        });
      }
    });
  }
  
/**
 * Handle a file dropped via drag-and-drop and generate a preview.
 * @param {DragEvent} event - The drag-and-drop event
 */
  onFileDropped(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

/**
 * Navigate back to the articles list page.
 */
  goBack() {
    this.router.navigate(['/articles']); 
  }
}
