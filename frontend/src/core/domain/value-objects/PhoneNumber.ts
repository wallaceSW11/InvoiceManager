export class PhoneNumber {
  private readonly _value: string;

  constructor(value: string) {
    const cleaned = this.clean(value);
    if (!this.isValid(cleaned)) {
      throw new Error('Invalid phone number format');
    }
    this._value = cleaned;
  }

  get value(): string {
    return this._value;
  }

  private clean(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  private isValid(phone: string): boolean {
    return /^(\d{10}|\d{11})$/.test(phone);
  }

  format(): string {
    if (this._value.length === 11) {
      return `(${this._value.slice(0, 2)}) ${this._value.slice(2, 7)}-${this._value.slice(7)}`;
    }
    return `(${this._value.slice(0, 2)}) ${this._value.slice(2, 6)}-${this._value.slice(6)}`;
  }

  toString(): string {
    return this.format();
  }

  equals(other: PhoneNumber): boolean {
    return this._value === other._value;
  }
}
