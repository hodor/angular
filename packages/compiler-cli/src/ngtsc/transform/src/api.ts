/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Expression, Statement, Type} from '@angular/compiler';
import * as ts from 'typescript';

import {Decorator} from '../../metadata';

/**
 * Provides the interface between a decorator compiler from @angular/compiler and the Typescript
 * compiler/transform.
 *
 * The decorator compilers in @angular/compiler do not depend on Typescript. The handler is
 * responsible for extracting the information required to perform compilation from the decorators
 * and Typescript source, invoking the decorator compiler, and returning the result.
 */
export interface DecoratorHandler<A> {
  /**
   * Scan a set of reflected decorators and determine if this handler is responsible for compilation
   * of one of them.
   */
  detect(decorator: Decorator[]): Decorator|undefined;

  /**
   * Perform analysis on the decorator/class combination, producing instructions for compilation
   * if successful, or an array of diagnostic messages if the analysis fails or the decorator
   * isn't valid.
   */
  analyze(node: ts.ClassDeclaration, decorator: Decorator): AnalysisOutput<A>;

  /**
   * Generate a description of the field which should be added to the class, including any
   * initialization code to be generated.
   */
  compile(node: ts.ClassDeclaration, analysis: A): CompileResult;
}

/**
 * The output of an analysis operation, consisting of possibly an arbitrary analysis object (used as
 * the input to code generation) and potentially diagnostics if there were errors uncovered during
 * analysis.
 */
export interface AnalysisOutput<A> {
  analysis?: A;
  diagnostics?: ts.Diagnostic[];
}

/**
 * A description of the static field to add to a class, including an initialization expression
 * and a type for the .d.ts file.
 */
export interface CompileResult {
  field: string;
  initializer: Expression;
  statements: Statement[];
  type: Type;
}
