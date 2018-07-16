import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../shared/response.model';
import { catchError, map, tap } from 'rxjs/operators';
import { Meeting } from '../shared/meeting.model';
import { backEndUrl, CustomError } from '../shared/constants';
import { Request } from '../shared/request.model';
import { colors } from '../routes/activity/colors';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  private addMeetingUrl = backEndUrl + 'createMeeting';
  private getRequestUrl = backEndUrl + 'getRequest';
  private getMeetingsUrl = backEndUrl + 'getMeeting';
  private updateMeetingUrl = backEndUrl + 'updateMeeting';

  constructor(private http: HttpClient) { }

  createMeeting(meeting: Meeting): Observable<void> {
    console.log("Invocando servicio de createMeeting=" + this.addMeetingUrl);
    let body = JSON.stringify(meeting);
    return this.http
      .post<void>(this.addMeetingUrl, body, httpOptions)
      .pipe(
        tap((resp: Response) => {
          console.log(resp);
          if (resp.statusCode != 201) {
            throw new CustomError("MeetingService.createMeeting()", resp.errors);
          }          
        })
      )
  }

  updateMeeting(meeting: Meeting): Observable<void> {
    console.log("Invocando servicio de updateMeeting=" + this.updateMeetingUrl);
    let body = JSON.stringify(meeting);
    return this.http
      .post<void>(this.updateMeetingUrl, body, httpOptions)
      .pipe(
        tap((resp: Response) => {
          console.log(resp);
          if (resp.statusCode != 201) {
            throw new CustomError("MeetingService.updateMeeting()", resp.errors);
          }          
        })
      )
  }

  loadRequest(): Observable<Request[]> {
    console.log("Invocando servicio de loadRequest=" + this.getRequestUrl);
    return this.http
      .get<Request[]>(this.getRequestUrl, httpOptions)
      .pipe(
        map((resp: Response) => {
          console.log("Estatus = " + resp.statusCode);
          if (resp.statusCode == 200) {
            return resp.body;
          }
          throw new CustomError("MeetingService.loadRequest()", resp.errors);
        })
      )
  }

  getMeetings(){
    console.log("Invocando servicio de getMeetings=" + this.getMeetingsUrl);
    return this.http
      .get(this.getMeetingsUrl, httpOptions)
      .pipe(
        map((resp: Response) => {
          console.log(resp);
          if (resp.statusCode == 200) {//Good login
            console.log("Reuniones cargadas correctamente");
            return resp.body.map((meeting:Meeting)=>{
              console.log("Start", meeting.fdscheduledate)
              return {
                title: meeting.fccomments,
                color: colors.yellow,
                start: new Date(meeting.fdscheduledate),
                id: meeting.fibinnaclemeetingid,
                meta: {
                  meeting
                }
              }
            })
          }
        })        
      )
  }

}

