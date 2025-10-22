import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
    private baseUrl = `${env.envUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  getCommentsByArticle(articleId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${articleId}`);
  }

  createComment(comment: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, comment);
  }
}
