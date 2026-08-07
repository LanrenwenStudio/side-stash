import { createSign } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const extensionRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
loadEnvFile(resolve(extensionRoot, '.env.submit'));

const options = parseArgs(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

run().catch((error) => {
  console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

async function run() {
  const extensionId = requiredEnv('CHROME_EXTENSION_ID');
  const publisherId = requiredEnv('CHROME_PUBLISHER_ID');
  const serviceAccount = loadServiceAccount();
  const accessToken = await createAccessToken(serviceAccount);
  const itemPath = `publishers/${encodeURIComponent(publisherId)}/items/${encodeURIComponent(extensionId)}`;
  const headers = { Authorization: `Bearer ${accessToken}` };

  if (options.dryRun) {
    const statusResponse = await fetch(`https://chromewebstore.googleapis.com/v2/${itemPath}:fetchStatus`, {
      headers,
    });
    await assertResponse(statusResponse, 'Chrome Web Store access check');
    console.log('✓ Chrome Web Store service-account authentication and publisher access succeeded.');
    return;
  }

  const zipPath = options.zipPath
    ? resolve(process.cwd(), options.zipPath)
    : findLatestChromeZip(resolve(extensionRoot, '.output'));

  if (!existsSync(zipPath)) {
    throw new Error(`Chrome ZIP was not found: ${zipPath}`);
  }

  const uploadResponse = await fetch(`https://chromewebstore.googleapis.com/upload/v2/${itemPath}:upload`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/zip' },
    body: readFileSync(zipPath),
  });
  await assertResponse(uploadResponse, 'Chrome Web Store upload');
  console.log(`✓ Uploaded ${zipPath}`);

  if (options.skipSubmitReview || isTruthy(process.env.CHROME_SKIP_SUBMIT_REVIEW)) {
    console.log('↪ Review submission skipped.');
    return;
  }

  const publishResponse = await fetch(`https://chromewebstore.googleapis.com/v2/${itemPath}:publish`, {
    method: 'POST',
    headers,
  });
  await assertResponse(publishResponse, 'Chrome Web Store publish');
  console.log('✓ Submitted to Chrome Web Store for review.');
}

function loadServiceAccount() {
  const keyFile = process.env.CHROME_SERVICE_ACCOUNT_KEY_FILE?.trim();
  if (!keyFile) {
    throw new Error('CHROME_SERVICE_ACCOUNT_KEY_FILE is required.');
  }

  const keyPath = resolveHomePath(keyFile);
  if (!existsSync(keyPath)) {
    throw new Error(`Service-account key file was not found: ${keyPath}`);
  }

  let credentials;
  try {
    credentials = JSON.parse(readFileSync(keyPath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read service-account JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (typeof credentials.client_email !== 'string' || typeof credentials.private_key !== 'string') {
    throw new Error('Service-account JSON must include client_email and private_key.');
  }

  return credentials;
}

async function createAccessToken({ client_email: clientEmail, private_key: privateKey }) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const encodedHeader = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const encodedClaims = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/chromewebstore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  );
  const unsignedToken = `${encodedHeader}.${encodedClaims}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsignedToken);
  signer.end();

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsignedToken}.${base64Url(signer.sign(privateKey))}`,
    }),
  });
  const payload = await responsePayload(response);

  if (!response.ok || typeof payload?.access_token !== 'string') {
    throw new Error(`Service-account authentication failed: ${responseError(payload, response.status)}`);
  }

  return payload.access_token;
}

async function assertResponse(response, action) {
  const payload = await responsePayload(response);
  if (!response.ok) {
    throw new Error(`${action} failed: ${responseError(payload, response.status)}`);
  }
}

async function responsePayload(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function responseError(payload, status) {
  if (typeof payload === 'string') {
    return `${status}: ${payload.slice(0, 300)}`;
  }

  const message = payload?.error?.message || payload?.error_description || payload?.error;
  return `${status}${message ? `: ${message}` : ''}`;
}

function findLatestChromeZip(outputDirectory) {
  if (!existsSync(outputDirectory)) {
    throw new Error(`Build output directory was not found: ${outputDirectory}. Run npm run zip first.`);
  }

  const candidates = readdirSync(outputDirectory)
    .filter((fileName) => fileName.endsWith('-chrome.zip'))
    .map((fileName) => {
      const path = resolve(outputDirectory, fileName);
      return { path, modifiedAt: statSync(path).mtimeMs };
    })
    .sort((left, right) => right.modifiedAt - left.modifiedAt);

  if (candidates.length === 0) {
    throw new Error(`No Chrome ZIP found in ${outputDirectory}. Run npm run zip first.`);
  }

  return candidates[0].path;
}

function parseArgs(args) {
  const parsed = { dryRun: false, help: false, skipSubmitReview: false, zipPath: null };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--dry-run') {
      parsed.dryRun = true;
    } else if (argument === '--help' || argument === '-h') {
      parsed.help = true;
    } else if (argument === '--skip-submit-review') {
      parsed.skipSubmitReview = true;
    } else if (argument === '--zip') {
      parsed.zipPath = args[index + 1];
      if (!parsed.zipPath || parsed.zipPath.startsWith('--')) {
        throw new Error('--zip requires a file path.');
      }
      index += 1;
    } else if (argument.startsWith('--zip=')) {
      parsed.zipPath = argument.slice('--zip='.length);
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  return parsed;
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1].startsWith('#')) {
      continue;
    }

    const value = match[2];
    if (process.env[match[1]] === undefined) {
      process.env[match[1]] = stripMatchingQuotes(value);
    }
  }
}

function requiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required. Configure .env.submit in this project.`);
  }

  return value;
}

function resolveHomePath(path) {
  return path.startsWith('~/') ? resolve(homedir(), path.slice(2)) : resolve(extensionRoot, path);
}

function stripMatchingQuotes(value) {
  return value.length >= 2 && ['"', "'"].includes(value[0]) && value[0] === value.at(-1)
    ? value.slice(1, -1)
    : value;
}

function isTruthy(value) {
  return ['1', 'true', 'yes'].includes(value?.trim().toLowerCase());
}

function base64Url(value) {
  return Buffer.from(value).toString('base64').replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function printHelp() {
  console.log(`Usage: node scripts/publish-chrome.mjs [options]

Options:
  --dry-run               Validate service-account authentication only
  --skip-submit-review    Upload the ZIP without submitting it for review
  --zip <path>            Use a specific Chrome ZIP instead of the newest .output ZIP
  --help                  Show this help
`);
}
