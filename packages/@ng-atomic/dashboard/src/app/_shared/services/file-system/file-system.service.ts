import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, from, lastValueFrom } from 'rxjs';
import { get, set } from 'idb-keyval';
import { FileNode, FileSystemTree } from '@webcontainer/api';
import { TreeNode } from '@ng-atomic/components/templates/file-tree';
// import { Tree } from '@angular-devkit/schematics/src/tree/interface'; 
// import { EmptyTree } from '@angular-devkit/schematics/src/tree/empty';
import { Path, PathFragment, fragment, split, virtualFs } from '@angular-devkit/core/src/virtual-fs';
import { HostCapabilities, HostWatchEvent, HostWatchOptions, Stats } from '@angular-devkit/core/src/virtual-fs/host';

const allows = [
  './package.json',
  './package-lock.json',
  './decorate-angular-cli.js',
];

function isIgnored(path: string) {
  return !(
    path.startsWith('./projects')
    || path.startsWith('./packages')
    || allows.includes(path)
  );
}

export async function walk(
  dirHandle: FileSystemDirectoryHandle,
  callback: (key: string, handle: FileSystemFileHandle, parent?: FileSystemDirectoryHandle) => void,
  cwd: string = '.',
  parent?: FileSystemDirectoryHandle
) {
  const entries = await toArray(dirHandle.entries());
  await Promise.all(
    entries.map(async ([key, entry]) => {
      const path = `${cwd}/${key}`;
      if (!isIgnored(path)) {
        return entry.kind === 'directory'
          ? await walk(entry, callback, `${cwd}/${entry.name}`)
          : callback(`${cwd}/${key}`, entry, parent);
      }
    })
  );
}

async function toArray<T>(
  asyncIterator: AsyncIterableIterator<T>
): Promise<T[]> {
  const arr = [];
  for await (const i of asyncIterator) arr.push(i);
  return arr;
}

@Injectable({providedIn: 'root'})
export class FileSystemService implements virtualFs.Host<Stats<any>> {
  // private _fileHandleMap = new Map<string, FileSystemFileHandle>();
  // refresh$ = new ReplaySubject(1);

  // saveKeyDown$ = fromEvent<Event & { key: string }>(document, 'keydown').pipe(
  //   filter((e) => isMetaKey(e) && e.key === 's'),
  //   tap((e) => e.preventDefault())
  // );

  private rootHandle: FileSystemDirectoryHandle;
  readonly capabilities: HostCapabilities;

  async initialize(): Promise<void> {
    this.rootHandle = await window.showDirectoryPicker();
    await set('dirHandle', this.rootHandle);
  }

  read(path: Path): Observable<ArrayBuffer> {
    return from((async () => {
      const fragments = split(path);
      const fileName = fragments.pop()!;
      let handle = this.rootHandle;
  
      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }
  
      const fileHandle = await handle.getFileHandle(fileName);
      const file = await fileHandle.getFile();
      return file.arrayBuffer();
    })());
  }

  list(path: Path): Observable<PathFragment[]> {
    return from((async () => {
      const fragments = split(path);
      let handle = this.rootHandle;

      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }

      const keys = await toArray(handle.keys());
      return keys.map(([key]) => fragment(key));
    })());
  }

  exists(path: Path): Observable<boolean> {
    return from((async () => {
      const fragments = split(path);
      const target = fragments.pop()!;
      let handle = this.rootHandle;
  
      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }
      handle.resolve

      const entries = await toArray(handle.entries());
      return entries.some(([key]) => key === target);
    })());
  }

  isDirectory(path: Path): Observable<boolean> {
    return from((async () => {
      const fragments = split(path);
      const target = fragments.pop()!;
      let handle = this.rootHandle;
  
      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }
  
      const entries = await toArray(handle.entries());
      return entries.some(([key, entry]) => key === target && entry.kind === 'directory');
    })());
  }

  isFile(path: Path): Observable<boolean> {
    return from((async () => {
      const fragments = split(path);
      const target = fragments.pop()!;
      let handle = this.rootHandle;
  
      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }
  
      const entries = await toArray(handle.entries());
      return entries.some(([key, entry]) => key === target && entry.kind === 'file');
    })());
  }

  stat(path: Path): Observable<Stats<{}>> {
    throw new Error('Method not implemented.');
    // return from((async () => {
    //   const fragments = split(path);
    //   const target = fragments.pop()!;
    //   let handle = this.rootHandle;

    //   for (const fragment of fragments) {
    //     handle = await handle.getDirectoryHandle(fragment);
    //   }

    //   const entries = await toArray(handle.entries());
    //   const [key, entry] = entries.find(([key]) => key === target)!;
    //   const file = await entry.getFile();
    //   return {
    //     path: fragment(key),
    //     type: entry.kind === 'directory' ? 'dir' : 'file',
    //     size: ,
    //     atime: new Date(),
    //     birthtime: new Date(),
    //     mtime: new Date(),
    //     ctime: new Date(),
    //     isFile: () => entry.kind === 'file',
    //     isDirectory: () => entry.kind === 'directory',
    //     isSymbolicLink: () => false,
    //   };
    // })());
  }

  write(path: Path, content: ArrayBufferLike): Observable<void> {
    return from((async () => {
      const fragments = split(path);
      const fileName = fragments.pop()!;
      let handle = this.rootHandle;
  
      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }
  
      const fileHandle = await handle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    })());
  }

  delete(path: Path): Observable<void> {
    return from((async () => {
      const fragments = split(path);
      const fileName = fragments.pop()!;
      let handle = this.rootHandle;
  
      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }

      await handle.removeEntry(fileName);
    })());
  }

  rename(from_: Path, to: Path): Observable<void> {
    return from((async () => {
      const fragments = split(from_);
      const fileName = fragments.pop()!;
      let handle = this.rootHandle;

      for (const fragment of fragments) {
        handle = await handle.getDirectoryHandle(fragment);
      }

      const fileHandle = await handle.getFileHandle(fileName);
      await (fileHandle as any).rename(split(to).at(-1)!);
    })());
  }

  watch(path: Path, options?: HostWatchOptions): Observable<HostWatchEvent> {
    throw new Error('Method not implemented.');
  }

  // get isLoaded(): boolean {
  //   return !!this._fileHandleMap.size;
  // }

  // get fileHandleMap(): Map<string, FileSystemFileHandle> {
  //   return this._fileHandleMap;
  // }

  async loadFileHandleMap(): Promise<void> {
    await this.loadFileHandleMapFromIndexedDB();
    // await this.loadFileHandleMapByPicker();
  }

  async loadFileHandleMapFromIndexedDB() {
    // this.rootHandle = (await get('dirHandle'))!;
    // if (!this.rootHandle) return;

    // const options = { mode: 'readwrite' } as any;

    // if ((await this.rootHandle.queryPermission(options)) === 'granted') {
    //   await this.loadProject(this.rootHandle);
    // } else if ((await this.rootHandle.requestPermission(options)) === 'granted') {
    //   await this.loadProject(this.rootHandle);
    // }
    // console.debug
  }

  async loadFileHandleMapByPicker(): Promise<void> {
    // await this.loadProject(this.rootHandle);
  }

  // async loadProject(handle: FileSystemDirectoryHandle): Promise<void> {
  //   await walk(handle, (key, handle) => this._fileHandleMap.set(key, handle));
  //   console.debug('fileHandleMap:', this._fileHandleMap);
  // }

  // async loadFileText(path: string | RegExp): Promise<string> {
  //   const handle =
  //     typeof path === 'string'
  //       ? this._fileHandleMap.get(path)
  //       : this.matchPath(path);
  //   const file = await handle!.getFile();
  //   return file.text();
  // }

  // async loadFile(path: string | RegExp): Promise<File> {
  //   const handle = typeof path === 'string'
  //     ? this._fileHandleMap.get(path)
  //     : this.matchPath(path);
  //   return handle!.getFile();
  // }

  // private matchPath(regExp: RegExp): FileSystemFileHandle {
  //   return [...this._fileHandleMap.entries()].find(
  //     ([key]) => !!key.match(regExp)
  //   )?.[1]!;
  // }

  async overwrite(path: string, contents: string): Promise<void> {
    // const handle = this._fileHandleMap.get(path);
    // const writable = await (handle as FileSystemFileHandle).createWritable();

    // await writable.write(contents);
    // await writable.close();
  }

  async makeTree(): Promise<any> {
    // const tree = new EmptyTree();
    // return tree;
  }

  async getFileTree(): Promise<TreeNode[]> {
    async function walk(
      handle: FileSystemDirectoryHandle,
      parent: TreeNode = { name: './', type: 'directory',children: []},
      cwd: string = '.'
    ) {
      for await (const [name, entry] of handle.entries()) {
        const path = `${cwd}/${name}`;
        console.debug('path:', path);

        if(!isIgnored(path)) {
          if (entry.kind === 'directory') {
            const node: TreeNode = {name, type: 'directory', parent, children: []};
            parent.children.push(node);
            await walk(entry, node, `${cwd}/${entry.name}`);
          } else {
            const node: TreeNode = {name, type: 'file', parent, children: []};
            parent.children.push(node);
          }
        }
      }
      return parent;
    }
    
    return (await walk(this.rootHandle)).children;
  }

  async getFileSystemTree(): Promise<FileSystemTree> {
    return {
      // 'packages': {
      //   directory: {
      //     '@ng-atomic': {
      //       directory: {
      //         'dashboard': {
      //           directory: {
      //             'project.json': {
      //               file: {
      //                 contents: await (await this._fileHandleMap.get('packages/@ng-atomic/dashboard/project.json')?.getFile())?.text()!,
      //               }
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // },
      // 'decorate-angular-cli.js': { file: { contents: await this.loadFileText('./decorate-angular-cli.js') } },
      // 'package-lock.json': { file: { contents: await this.loadFileText('./package-lock.json') } },
      // 'package.json': { file: { contents: await this.loadFileText('./package.json') } },
    }
  }
}
