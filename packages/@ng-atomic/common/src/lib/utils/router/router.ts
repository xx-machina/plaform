import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from "@angular/router";

export function walkActivatedRouteSnapshot(
  snapshot: ActivatedRouteSnapshot,
  callback: (snapshot: ActivatedRouteSnapshot) => boolean,
  target: 'children' | 'parent' = 'children',
): void {
  if(callback(snapshot)) return;
  if (target === 'children') {
    snapshot.children.forEach(child => walkActivatedRouteSnapshot(child, callback, target));
  }
}


export function skippedResolver(outlet = 'primary') {
	let skipped: boolean;

	return (route: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot) => {
		const routes = [];
		walkActivatedRouteSnapshot(snapshot.root, snapshot => {
			if (snapshot.outlet === outlet) {
				routes.push(snapshot);
				return false;
			}
			return true;
		});

		if (route === routes.at(-1)) {
			return skipped = false;
		}

		return skipped ??= route !== routes.at(-1);
	}
}

function resolveModule(m: any) {
  if (m.default) {
    return m.default;
  }
  return m;
}

export function wrapRoutes(routes: Routes) {
  return (routes ?? []).map(route => {
    if (route.loadChildren) {
      return {
        ...route,
        loadChildren: () => (route.loadChildren() as Promise<Routes>).then(routes => {
					return wrapRoutes(resolveModule(routes))
				}),
        resolve: {
          ...(route?.resolve || {}),
          skipped: skippedResolver(),
        }
      };
    }
    return {
      ...route,
      resolve: {
        ...(route?.resolve || {}),
        skipped: skippedResolver(),
      },
    };
  });
}