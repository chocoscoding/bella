/** An error whose message is safe to show the guest. */
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
  }
}

/** A failed call to a Clover API. Never shown to guests as-is. */
export class CloverError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
  }
}
