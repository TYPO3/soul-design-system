#!/usr/bin/env node
/* A diagram's text in, its SVG file out: the asset to keep and reuse.

   Shipped with the package, so a project draws its own figures with the
   system's grammar and faces, and needs nothing else. The file carries its
   faces and reads the same in an image, a README or a slide.

     npx soul-diagram figures/            # every .diagram under it, an .svg beside each
     npx soul-diagram flow.diagram -o out/
     npx soul-diagram flow.diagram --stdout > flow.svg
*/
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';

import { diagram, parse } from '../packages/frontend/src/lib/diagram/index.ts';
import * as report from './lib/report.ts';

const args = process.argv.slice(2);
const stdout = args.includes('--stdout');
const outAt = args.indexOf('-o');
const out = outAt >= 0 ? args[outAt + 1] : undefined;
const paths = args.filter((a, i) => !a.startsWith('-') && (outAt < 0 || i !== outAt + 1));

/* The texts under a path: the file itself, or every `.diagram` below a
   directory. */
const texts = (path: string): string[] => {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];
  return readdirSync(path, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? texts(join(path, e.name)) : e.name.endsWith('.diagram') ? [join(path, e.name)] : [],
  );
};

const missing = paths.filter((p) => !existsSync(p));
if (missing.length) {
  process.stderr.write(`soul-diagram: no such file: ${missing.join(', ')}\n`);
  process.exit(1);
}
const files = paths.flatMap((p) => texts(resolve(p)));
if (!files.length) {
  process.stderr.write('soul-diagram: name a .diagram file or a directory that holds one\n');
  process.exit(1);
}
if (stdout && files.length > 1) {
  process.stderr.write('soul-diagram: --stdout takes one file\n');
  process.exit(1);
}

const failed: string[] = [];
if (!stdout) report.open('diagram', 'the texts drawn into SVG files');
for (const file of files) {
  const name = basename(file).replace(/\.diagram$/, '');
  try {
    const { svg, width, height } = diagram(parse(readFileSync(file, 'utf8')), { name });
    if (stdout) {
      process.stdout.write(svg);
      continue;
    }
    const dir = out ? resolve(out) : dirname(file);
    mkdirSync(dir, { recursive: true });
    const target = join(dir, `${name}.svg`);
    writeFileSync(target, svg);
    report.row('ok', relative(process.cwd(), file), relative(process.cwd(), target), `${width} × ${height}`);
  } catch (error) {
    const message = `${relative(process.cwd(), file)}: ${(error as Error).message.replace(`${name}: `, '')}`;
    if (stdout) process.stderr.write(`${message}\n`);
    else report.row('bad', relative(process.cwd(), file), (error as Error).message.replace(`${name}: `, ''));
    failed.push(message);
  }
}
if (!stdout) report.summary(`${files.length - failed.length} of ${files.length} drawn`, failed);
process.exit(failed.length ? 1 : 0);
