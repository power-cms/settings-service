export class Settings {
  constructor(private title: string, private logo?: string) {}

  public getTitle(): string {
    return this.title;
  }

  public getLogo(): string | undefined {
    return this.logo;
  }
}
