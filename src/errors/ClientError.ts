// custom error class extending the built-in Error class
export class ClientError extends Error {
  constructor(
    public name: string,
    message: string,
  ) {
    super(message);
  }
}
