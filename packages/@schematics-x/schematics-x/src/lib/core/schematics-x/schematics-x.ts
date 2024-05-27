import { inject, Injectable } from '@angular/core';
import { FileEntry, Tree } from "@angular-devkit/schematics";
import { OutputFileEntryEstimator } from '../estimators/output-file-entry';
import { OutputFilePathsEstimator } from '../estimators/output-file-paths';
import { RelatedFilePathsEstimator } from "../estimators/related-file-paths";
import { getFiles, promiseAllOrForLoop } from "../helpers/utils";
import { join } from "path";
import pLimit from 'p-limit';

export interface ExecuteOptions {
  instructions: string;
  inputScope: string;
  outputScope: string;
  inputFilePaths?: string[];
  outputFilePaths?: string[];

  parallel?: boolean;
}

@Injectable({providedIn: 'root'})
export class Glob {
  async glob(param: string, tree: Tree): Promise<string[]> {
    // TODO(nontangent): Implements
    return getFiles(tree.getDir(param)).map(p => join(param, p));
  }
}

@Injectable({providedIn: 'root'})
export class ScopeResolver {
  filter(paths: string[], scope: string): string[] {
    // TODO(nontangent): Implements
    return paths.filter(path => path.startsWith(scope));
  }
}

@Injectable({providedIn: 'root'})
export class SchematicsX {
  private readonly glob = inject(Glob);
  private readonly scopePathFilterPipe = inject(ScopeResolver);
  private readonly outputFilePaths = inject(OutputFilePathsEstimator);
  private readonly outputFileEntry = inject(OutputFileEntryEstimator);
  private readonly relatedFilePaths = inject(RelatedFilePathsEstimator);

  async execute(tree: Tree, options: ExecuteOptions): Promise<FileEntry[]> {
    const inputFilePaths = options.inputFilePaths ?? await this.glob.glob(options.inputScope, tree);
    const scopedInputFilePaths = this.scopePathFilterPipe.filter(inputFilePaths, options.inputScope);
    const outputFilePaths = options.outputFilePaths ?? await this.outputFilePaths.estimate(scopedInputFilePaths, options.instructions);
    const scopedOutputFilePaths = this.scopePathFilterPipe.filter(outputFilePaths, options.outputScope);

    const limit = pLimit(10);

    return Promise.all(scopedOutputFilePaths.map((scopedOutputFilePath) => {
      return limit(() => this.estimateFileEntry(tree, {
        inputFilePaths: scopedInputFilePaths,
        instructions: options.instructions,
        outputFilePath: scopedOutputFilePath
      }));
    }));
  }

  private async estimateFileEntry(tree: Tree, {inputFilePaths, instructions, outputFilePath}) {
    const relatedInputFilePaths = await this.relatedFilePaths.estimate(
      inputFilePaths, outputFilePath
    );
    const relatedInputFileEntries = relatedInputFilePaths
      .map((path) => tree.get(path))
      .filter((entry) => !!entry);

    return this.outputFileEntry.estimate(relatedInputFileEntries, instructions, outputFilePath);
  }
}
