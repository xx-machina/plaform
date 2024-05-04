import { RouterModule } from '@angular/router';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { WebContainer } from '@webcontainer/api';
import { FileSystemService } from './_shared/services/file-system';
import { Terminal } from 'xterm';
import { FileTreeTemplate, TreeNode } from '@ng-atomic/components/templates/file-tree';
import { CodeEditorTemplate } from '@ng-atomic/components/templates/code-editor';
import { TabEditorTemplate } from '@ng-atomic/components/templates/tab-editor';
import { Effect, NgAtomicComponent } from '@ng-atomic/common/stores/component-store';
import { DividerFrame } from '@ng-atomic/components/frames/divider';
import { fragment } from '@angular-devkit/core/src/virtual-fs';

const files = {
  'index.js': {
    file: {
      contents: `
import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Welcome to a WebContainers app! 🥳');
});

app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});`,
    },
  },
  'package.json': {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon --watch './' index.js"
  }
}`,
    },
  },
};

@Component({
  standalone: true,
  imports: [
    RouterModule,
    FileTreeTemplate,
    CodeEditorTemplate,
    TabEditorTemplate,
    DividerFrame,
  ],
  selector: 'app-root',
  template: `
  <div class="left">
    <templates-file-tree
      [treeNode]="fileTree"
      (action)="dispatch($event)"
    ></templates-file-tree>
  </div>
  <div class="right">
    <frames-divider (action)="dispatch($event)">
      <iframe #iframe src="/assets/loading.html" first></iframe>
      <templates-tab-editor
        [files]="files"
        second
      ></templates-tab-editor>
    </frames-divider>
  </div>
  <button style="position: fixed; bottom: 16px; right: 16px;" (click)="loadProject()">Load Project</button>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends NgAtomicComponent {
  title = 'ng-atomic-dashboard';
  private fs = inject(FileSystemService);
  fileTree: TreeNode[] = [];

  files: File[] = [
    new File([''], 'test'),
  ];

  @ViewChild('iframe')
  iframe!: ElementRef<HTMLIFrameElement>;

  wc!: WebContainer;

  xterm: Terminal = new Terminal({ convertEol: true });

  async ngOnInit() {
    const tree = await this.fs.makeTree();
    console.debug('tree:', tree);
  }

  async loadProject() {
    await this.fs.initialize();
    this.fs.read(fragment('package.json')).subscribe(content => {
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(content);
      console.debug('text:', text);
    });

    this.fs.list(fragment('packages')).subscribe(paths => {
      console.debug('paths:', paths);
    });

    const text = new TextEncoder().encode('Hello World!')
    this.fs.write(fragment('test'), text).subscribe(() => {});

    // this.fs.rename(fragment('test'), fragment('example')).subscribe(() => {});
    // const tree = await this.fs.getFileSystemTree();
    // this.wc = await WebContainer.boot();
    // // await this.wc.mount(files);
    // await this.wc.mount(tree);
    // const packageJSON = await this.wc.fs.readFile('package.json', 'utf-8');
    // console.log(packageJSON);
    // this.fileTree = await this.fs.getFileTree();
    // console.debug('this.fileTree:', this.fileTree);

    // const exitCode = await this.installDependencies(this.xterm);
    // if (exitCode !== 0) {
    //   throw new Error('Installation failed');
    // };

    // await this.wc.spawn('npm', ['run', 'start']);

    // console.debug('Server is running?')

    // // Wait for `server-ready` event
    // this.wc.on('server-ready', (port, url) => {
    //   console.debug(url)
    //   this.iframe.nativeElement.src = url;
    // });
  }

  async installDependencies(terminal: Terminal) {
    // Install dependencies
    const installProcess = await this.wc.spawn('npm', ['install']);
    installProcess.output.pipeTo(new WritableStream({
      write(data) {
        terminal.write(data);
      }
    }))
    // Wait for install command to exit
    return installProcess.exit;
  }

  @Effect(FileTreeTemplate.ActionId.OPEN_FILE)
  async openFile(node: TreeNode) {
    // function walk(node: TreeNode, path?: string): string {
    //   if (node.parent) {
    //     path = path ? `${node.name}/${path}` : node.name;
    //     return walk(node.parent, path);
    //   }
    //   return `./${path}`;
    // }

    // const path = walk(node);
    // console.debug('path:', path);
    // const file = await this.fs.loadFile(path);
    // this.files = [...this.files, file];
  }

}

