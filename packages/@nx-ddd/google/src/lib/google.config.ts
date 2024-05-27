import { InjectionToken } from "@angular/core";

export interface GoogleConfig {
  credential: {
    web: {
      client_id: string;
      project_id: string;
      auth_uri: string;
      token_uri: string;
      auth_provider_x509_cert_url: string;
      client_secret: string;
      redirect_uris?: string[];
    };
  }
}
export const GOOGLE_CONFIG = new InjectionToken<GoogleConfig>('GOOGLE_CONFIG');
