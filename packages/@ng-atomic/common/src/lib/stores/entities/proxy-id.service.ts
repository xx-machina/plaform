import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ProxyIdService {
  proxyMap = new Map<string, string>();

  isProxyId(id: string | null): boolean {
    return !!id?.startsWith('proxy-');
  }

  proxyId(_id: string): string {
    const id = this.isProxyId(_id) ? _id : `proxy-${this.proxyMap.size}`;
    if (!this.proxyMap.get(id)) this.proxyMap.set(id, id);
    return id;
  }

  update(proxyId: string, id: string) {
    this.proxyMap.set(proxyId, id);
  }

  resolve(proxyIdOrId: string): string {
    return this.isProxyId(proxyIdOrId) ? this.proxyMap.get(proxyIdOrId) : proxyIdOrId;
  }
}
