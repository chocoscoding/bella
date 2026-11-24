/**
 * One-line logs for the Helicarrier log viewer: `message key=value key=value`.
 * Never pass guest names, emails, phone numbers, card data or tokens.
 */
type Fields = Record<string, string | number | boolean | null | undefined>;

function line(message: string, fields?: Fields) {
  const pairs = Object.entries(fields ?? {})
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}=${typeof v === 'string' && /[\s"]/.test(v) ? JSON.stringify(v) : v}`);
  return [message, ...pairs].join(' ');
}

export const log = {
  info: (message: string, fields?: Fields) => console.log(line(message, fields)),
  warn: (message: string, fields?: Fields) => console.warn(line(`WARN ${message}`, fields)),
  error: (message: string, fields?: Fields) => console.error(line(`ERROR ${message}`, fields)),
};

/** Cents as $12.34 for log lines. */
export const usd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
