import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { env } from '../../../environment/environment';

@Injectable()
export class UserService {
  private path = env.envUrl

  constructor(private _httpClient: HttpClient) { }

  getOneUser(id: string) {
    const url = `${this.path}/users/${id}`
    return this._httpClient.get(url)
  }

  getAllUsers(): Observable<any> {
    const url = `${this.path}/users/`
    return this._httpClient.get(url)
  }

  updateUser(id: string, userData: any) {
    const url = `${this.path}/users/${id}`
    return this._httpClient.put(url, userData)
  }

  deleteUser(id: string): Observable<any> {
    const url = `${this.path}/users/${id}`
    return this._httpClient.delete(url)
  }

}
