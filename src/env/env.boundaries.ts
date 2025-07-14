import type { Boundaries } from '@j2blasco/ts-boundaries';

const boundaries: Boundaries = {
  name: 'env',
  internal: [],
  external: ['fs', 'os', 'path', 'crypto', 'url'],
};

export default boundaries;
