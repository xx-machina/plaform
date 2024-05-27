import { Injectable } from "@angular/core";
import type { drive_v3, calendar_v3, google } from "googleapis";
import type { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";

@Injectable({ providedIn: 'root' })
export abstract class GoogleService {
  abstract client: (typeof google)['auth']['OAuth2']['prototype'];
  abstract getClient(credentials: any): Promise<any>;
  abstract getClientByAccessToken(cred: {accessToken: string, refreshToken: string}): (typeof google)['auth']['OAuth2']['prototype'];
  abstract generateAuthUrl(): string;
  abstract getToken(code: string): Promise<any>;
  abstract getFileMetadata(client: any, id: string): GaxiosPromise<drive_v3.Schema$File>;
  abstract getFileBuffer(client: any, id: string): GaxiosPromise<drive_v3.Schema$File>;
  abstract listCalendars(client: typeof this.client): Promise<calendar_v3.Schema$CalendarListEntry[]>;
  abstract listEvents(client: typeof this.client, props: {calendarId: string}): Promise<any>;
  abstract createEvent(client: typeof this.client, event: { start: string, end: string, title: string, description: string }): Promise<any>;
  abstract deleteEvent(client: typeof this.client, event: { eventId: string }): Promise<any>;
  abstract getCalendar(client: typeof this.client): calendar_v3.Calendar;
  abstract refreshAccessToken(client: typeof this.client, refreshToken: string): Promise<any>;
}