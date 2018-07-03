import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators';
import { Response } from '../shared/response.model';
import { Complex } from "../shared/catalog.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ComplexService {

  private loginUrl = 'http://10.51.145.32:8080/request/';

  constructor(private http: HttpClient) { }

  getComplex(): Observable<Complex[]> {
    return this.http.get<Complex>(this.loginUrl + "getComplexity")
      .pipe(
        map((resp: Response) => {
          if (resp.statusCode == 200)
            return resp.body;
          else
            Observable.throw("Error al obtener el catálogo de prioridades");
        }),
        catchError(error => Observable.throw(error))
      );
  }
}