import { Inject, Injectable } from "@angular/core";
import { GoogleService } from "./google.service";
import { calendar_v3, drive_v3, google } from "googleapis";
import { GOOGLE_CONFIG, GoogleConfig } from "./google.config";
import { GaxiosPromise } from "googleapis/build/src/apis/abusiveexperiencereport";
import dayjs from 'dayjs';

@Injectable()
export class GoogleServiceImpl extends GoogleService {
  constructor(
    @Inject(GOOGLE_CONFIG) private config: GoogleConfig,
  ) {
    super();
  }

  get client() {
    return new google.auth.OAuth2({
      clientId: this.config.credential.web.client_id,
      clientSecret: this.config.credential.web.client_secret,
      redirectUri: 'http://localhost:3330/api/links/google/callback',
    });
  }

  async getClient(credentials: any): Promise<any> {
    const client = new google.auth.OAuth2({
      clientId: this.config.credential.web.client_id,
      clientSecret: this.config.credential.web.client_secret,
    });
    client.setCredentials(credentials);
    return client;
  };

  getClientByAccessToken(cred: {accessToken: string, refreshToken: string}): any {
    const client = new google.auth.OAuth2();
    client.setCredentials({
      access_token: cred.accessToken,
      refresh_token: cred.refreshToken,
    });
    return client;
  }

  generateAuthUrl(client = this.client): string {
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      redirect_uris: [
        'http://localhost:3330/api/auth/callback'
      ]
    });
    return url
  }

  getToken(code: string): Promise<any> {
    return this.client.getToken(code);
  }

  async getFileMetadata(client: any, id: string): GaxiosPromise<drive_v3.Schema$File> {
    const drive = google.drive({version: 'v3', auth: client});
    return drive.files.get({fileId: id});
  }

  async getFileBuffer(client: any, id: string): GaxiosPromise<drive_v3.Schema$File> {
    const drive = google.drive({version: 'v3', auth: client});
    return drive.files.get({fileId: id, alt: 'media'}, { responseType: 'arraybuffer' });
  }

  async listCalendars(client: typeof this.client): Promise<calendar_v3.Schema$CalendarListEntry[]> {
    const calendar = google.calendar({version: 'v3', auth: client});
    const res = await calendar.calendarList.list({});
    return res.data.items;
  }

  /** @deprecated */
  async listEvents(client: typeof this.client, {calendarId = 'primary'}: { calendarId?: string } = {}): Promise<any> {
    // const calendar = google.calendar({version: 'v3', auth: client});
    // const res = await calendar.events.list({
    //   calendarId,
    //   timeMin: (new Date()).toISOString(),
    //   maxResults: 100,
    //   singleEvents: true,
    //   orderBy: 'startTime',
    // });

    // return res.data.items;
  }

  async deleteEvent(client: typeof this.client, event: { eventId: string }) {
    const calendar = google.calendar({version: 'v3', auth: client});
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: event.eventId,
    });
  }

  getCalendar(client: typeof this.client): calendar_v3.Calendar {
    return google.calendar({version: 'v3', auth: client});
  }

  async createEvent(client: typeof this.client, event: { start: string, end: string, title: string, description: string }) {
    const calendar = google.calendar({version: 'v3', auth: client});
    await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        start: {
          dateTime: event.start,
          timeZone: 'Asia/Tokyo',
        },
        end: {
          dateTime: event.end,
          timeZone: 'Asia/Tokyo',
        },
        summary: event.title,
        description: event.description,
      }
    });
  }

  async refreshAccessToken(client: typeof this.client) {
    const res = await client.refreshAccessToken();
    return res.credentials.access_token;
  }
}
