export class CardLastDigits {
  private readonly _value: string

  constructor(value: string) {
    const cleaned = value.replace(/\D/g, '')
    if (!this.isValid(cleaned)) {
      throw new Error('Card last digits must be exactly 4 numeric digits')
    }
    this._value = cleaned
  }

  get value(): string {
    return this._value
  }

  private isValid(digits: string): boolean {
    return /^\d{4}$/.test(digits)
  }

  format(): string {
    return `**** ${this._value}`
  }

  toString(): string {
    return this._value
  }

  equals(other: CardLastDigits): boolean {
    return this._value === other._value
  }
}
