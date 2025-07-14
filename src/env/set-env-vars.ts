import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { decryptFile } from './encrypt-file';

export function getEnvKeyEnvironmentVariable(envType: string): string {
  return `ENV_${envType.toUpperCase().replace(/-/g, '_')}_KEY`;
}

export async function setEnvironment(args: {
  envPath: string;
  envType: string;
}) {
  return new Promise<void>(async (resolve, reject) => {
    const envTypeInput = args?.envType ?? process.env.ENV_TYPE ?? '';
    const envType = envTypeInput;

    const envFileName = `env.${envType}.json`;
    const envFilePath = `${args.envPath}/${envFileName}`;
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'system-env-'));
    const decryptedEnvPath = path.join(tempDir, envFileName);

    try {
      const key = process.env[getEnvKeyEnvironmentVariable(envType)];
      if (!key) {
        throw new Error(`${getEnvKeyEnvironmentVariable(envType)} is not set`);
      }
      decryptFile(envFilePath, decryptedEnvPath, key);

      fs.readFile(decryptedEnvPath, 'utf8', (err, data) => {
        if (err) {
          console.error(
            `[Environment-Variables] Error reading file from disk - ${envType}: ${err}`,
          );
          reject(err);
        } else {
          try {
            const envConfig = JSON.parse(data);
            for (const key in envConfig) {
              if (envConfig.hasOwnProperty(key)) {
                process.env[key] = envConfig[key];
              }
            }
            resolve();
          } catch (err) {
            console.error(
              `[Environment-Variables] Error parsing JSON string - ${envType}: ${err}`,
            );
            reject(err);
          }
        }
      });
    } catch (err) {
      console.error(
        `[Environment-Variables] Error decrypting file - ${envType}: ${err}`,
      );
      reject(err);
    }
  });
}
