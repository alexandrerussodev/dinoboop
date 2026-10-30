
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  rmSync,
} from 'node:fs';
import { join } from 'node:path';

const outputDirectory = 'dist';

rmSync(outputDirectory, { recursive: true, force: true });

mkdirSync(join(outputDirectory, 'backend'), {
  recursive: true,
});

cpSync('backend/dist', join(outputDirectory, 'backend/dist'), {
  recursive: true,
});

cpSync('frontend/dist', join(outputDirectory, 'frontend/dist'), {
  recursive: true,
});

copyFileSync(
  'backend/package.json',
  join(outputDirectory, 'backend/package.json')
);

copyFileSync(
  'backend/package-lock.json',
  join(outputDirectory, 'backend/package-lock.json')
);

console.log('Deployment files prepared successfully.');
