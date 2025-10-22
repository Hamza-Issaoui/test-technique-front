import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
    private baseUrl = `${env.envUrl}/api/articles`;

  constructor(private http: HttpClient) {}

  getArticles(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit)
      .set('search', search);
    return this.http.get<any>(this.baseUrl, { params });
  }

  getArticleById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createArticle(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, formData);
  }

  updateArticle(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
