import type { Host } from './nodra-plugin-sdk';
import type { IconEntry } from './nodra-plugin-sdk';
import pack from './aws.json';

export function register(host: Host): void {
  host.blocks.register(pack as IconEntry[]);
}
