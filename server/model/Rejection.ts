type Localizable = string | { key: string, params?: { [key: string]: string | number }};

export default class Rejection {
  constructor(
    public threadId: string = '',
    public message: string | Localizable | null = null,
    public remote = false,
  ) {}

  localizedMessage<T>(locFn: (key: string, params?: { [key: string]: string | number }) => T): T | null {
    if (this.message) {
      if (typeof this.message === 'string') {
        return locFn(this.message);
      } else {
        const { key, params } = this.message;
        return locFn(key, params);
      }
    }
    return null;
  }
}
