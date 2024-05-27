import { Injectable, inject } from "@angular/core";
import { merge } from "lodash-es";
import { ProxyIdService } from "./proxy-id.service";

export type Entity = {id: string};

interface BaseTask {
  type: 'create' | 'update' | 'delete' | 'noop';
  timestamp: number;
}

interface CreateAction<T extends Entity> extends BaseTask {
  type: 'create';
  payload: T;
}

interface UpdateAction<T extends Entity> extends BaseTask {
  type: 'update';
  payload: Partial<T> & Entity;
}

interface DeleteAction extends BaseTask {
  type: 'delete';
  payload: Entity;
}

interface NoopAction extends BaseTask {
  type: 'noop';
  payload: {};
}

export type Task<T extends Entity> = CreateAction<T> | UpdateAction<T> | DeleteAction | NoopAction;

export function pushMap<T>(map: Map<string, T[]>, id: string,  item: T): Map<string, T[]> {
  const items = map.get(id) ?? [];
  items.push(item);
  map.set(id, items);
  return map;
}

@Injectable({providedIn: 'root'})
export class TaskComposerService {
  readonly proxyId = inject(ProxyIdService);

  composeTasks<T extends Entity>(tasks: Task<T>[]): Task<T>[] {
    const map = new Map<string, Task<T>[]>();
    tasks.sort((a, b) => a.timestamp - b.timestamp).forEach((task) => {
      let id = (task.payload as any)?.id;
      switch(task.type) {
        case 'noop':
          break
        case 'create':
          id = this.proxyId.proxyId(task.payload.id);
          pushMap(map, id, {...task, payload: {...task.payload, id}} as Task<T>);
          break;
        case 'update':
        case 'delete':
          pushMap(map, this.proxyId.resolve(id), task);
          break;
      }
    });

    const _tasks: Task<T>[] = [];
    for (const tasks of map.values()) {
      _tasks.push(this.compose(tasks));
    }
    return _tasks.filter(task => task.type !== 'noop');
  }

  compose<T extends Entity>(tasks: Task<T>[]): Task<T> {
    let created = false;
    return tasks.reduce((a, b) => {
      switch(b.type) {
        case 'create':
          created = true;
          return {
            type: 'create',
            payload: b.payload,
            timestamp: b.timestamp,
          } as Task<T>;
        case 'update':
          return {
            type: created ? 'create' : 'update',
            payload: merge(a.payload, b.payload),
            timestamp: b.timestamp,
          } as Task<T>;
        case 'delete':
          return {
            type: created ? 'noop' : 'delete',
            payload: b.payload,
            timestamp: b.timestamp,
          } as Task<T>;
      }
    }, {type: 'noop', payload: {}} as Task<T>)
  }
}
