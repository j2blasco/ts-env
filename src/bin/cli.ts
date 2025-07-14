import { KEY_LENGTH, encryptFile, decryptFile } from 'env/encrypt-file';
import { getEnvKeyEnvironmentVariable } from 'env/set-env-vars';
import { basename } from 'path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: ts-env <encrypt|decrypt> <envFilePath>\n');
  process.exit(1);
}

const [action, envFilePath] = args;

// Extract environment type from filename (e.g., env.alpha.json -> alpha)
const fileName = basename(envFilePath);
const envFilePattern = /^env\.(.+)\.json$/;
const match = fileName.match(envFilePattern);

if (!match) {
  console.error('Invalid file name. Expected format: env.{env_type}.json');
  process.exit(1);
}

const envType = match[1];
const envPath = envFilePath;
const key = process.env[getEnvKeyEnvironmentVariable(envType)];

if (!key) {
  console.error(`ENV_${envType.toUpperCase()}_KEY is not set.`);
  process.exit(1);
}

const keyCharLength = KEY_LENGTH * 2;
if (key.length !== keyCharLength) {
  console.error(
    `The key must be a 128-bit (${keyCharLength}-character hexadecimal) string. Provided key length: ${key.length}`,
  );
  throw new Error('Invalid key length');
}

if (action === 'encrypt') {
  encryptFile(envPath, envPath, key);
} else if (action === 'decrypt') {
  decryptFile(envPath, envPath, key);
} else {
  console.error('Invalid action. Use "encrypt" or "decrypt".');
  process.exit(1);
}
