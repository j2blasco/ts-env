# ts-env

A TypeScript utility for securely managing environment variables through file encryption and runtime loading.

## Overview

`ts-env` provides two main functionalities:

1. **CLI Tool**: Encrypt and decrypt environment files using AES-128-CBC encryption
2. **Runtime Library**: Load encrypted environment files as Node.js environment variables

## Installation

```bash
npm install @j2blasco/ts-env
```

## CLI Usage

The `ts-env` command-line tool allows you to encrypt and decrypt environment files.

### Prerequisites

Before using the CLI, you need to set an environment variable containing your encryption key:

```bash
# For environment type "alpha"
export ENV_ALPHA_KEY="your-128-bit-hex-key"

# For environment type "production"  
export ENV_PRODUCTION_KEY="your-128-bit-hex-key"
```

**Note**: The key must be a 32-character hexadecimal string (128-bit). You can generate one at [https://generate-random.org/encryption-key-generator](https://generate-random.org/encryption-key-generator?count=1&bytes=16&cipher=aes-128-cbc).

### File Naming Convention

Environment files must follow the naming pattern: `env.{environment-type}.json`

Examples:
- `env.alpha.json`
- `env.beta.json` 
- `env.production.json`

### Encrypting Files

```bash
# Encrypt an environment file
ts-env encrypt path/to/env.alpha.json

# The file will be encrypted in-place
```

### Decrypting Files

```bash
# Decrypt an environment file
ts-env decrypt path/to/env.alpha.json

# The file will be decrypted in-place
```

## Runtime Usage

Use the `setEnvironment` function to load encrypted environment files into `process.env` at runtime.

### Basic Example

```typescript
import { setEnvironment } from '@j2blasco/ts-env';

async function initializeApp() {
  try {
    await setEnvironment({
      envPath: './config',
      envType: 'alpha'
    });
    
    // Environment variables are now available in process.env
    console.log(process.env.DATABASE_URL);
    console.log(process.env.API_KEY);
  } catch (error) {
    console.error('Failed to load environment:', error);
  }
}

initializeApp();
```

### Function Parameters

- `envPath`: Directory containing the environment file
- `envType`: Environment type (used to construct filename and find encryption key)

### How It Works

1. Constructs filename as `env.{envType}.json` in the specified path
2. Looks for encryption key in environment variable `ENV_{ENVTYPE}_KEY`
3. Decrypts the file to a temporary location
4. Parses the JSON content
5. Sets all key-value pairs as environment variables in `process.env`
6. Cleans up temporary files

## Environment File Format

Environment files should be valid JSON with string key-value pairs:

```json
{
  "DATABASE_URL": "postgresql://localhost:5432/mydb",
  "API_KEY": "secret-api-key",
  "NODE_ENV": "production",
  "PORT": "3000"
}
```

## Security Features

- **AES-128-CBC Encryption**: Industry-standard encryption algorithm
- **Random IV**: Each encryption uses a fresh initialization vector
- **File Markers**: Encrypted files are marked to prevent double-encryption
- **Key Validation**: Ensures encryption keys are the correct length
- **Temporary Decryption**: Files are decrypted to temporary locations only

## Error Handling

The library provides detailed error messages for common issues:

- Missing encryption keys
- Invalid key lengths
- File not found
- Invalid JSON format
- Decryption failures

## Development Scripts

```bash
# Encrypt environment file (development)
npm run env:encrypt

# Decrypt environment file (development)  
npm run env:decrypt

# Use built CLI tool
npm run env:bin:encrypt
npm run env:bin:decrypt
```

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

