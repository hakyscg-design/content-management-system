export function ensureNfc(value: string): string {
  return value.normalize("NFC");
}

export function assertNonEmpty(value: string, label: string): string {
  if (value.trim().length === 0) {
    throw new Error(`${label} must not be empty.`);
  }

  return value;
}

export function redactSecrets(value: string): string {
  return value.replace(/(token|password|secret|api[_-]?key)=([^&\s]+)/gi, "$1=[REDACTED]");
}
