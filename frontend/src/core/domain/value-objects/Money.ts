export class Money {
  private readonly _value: number

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Money value cannot be negative')
    }
    this._value = Math.round(value * 100) / 100
  }

  get value(): number {
    return this._value
  }

  add(other: Money): Money {
    return new Money(this._value + other._value)
  }

  subtract(other: Money): Money {
    return new Money(this._value - other._value)
  }

  multiply(factor: number): Money {
    return new Money(this._value * factor)
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero')
    }
    return new Money(this._value / divisor)
  }

  equals(other: Money): boolean {
    return this._value === other._value
  }

  isGreaterThan(other: Money): boolean {
    return this._value > other._value
  }

  isLessThan(other: Money): boolean {
    return this._value < other._value
  }

  toString(): string {
    return this.format()
  }

  format(locale: string = 'pt-BR', currency: string = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(this._value)
  }

  static fromString(value: string): Money {
    const cleaned = value.replace(/[^\d,.-]/g, '').replace(',', '.')
    const numericValue = parseFloat(cleaned)
    if (isNaN(numericValue)) {
      throw new Error('Invalid money string')
    }
    return new Money(numericValue)
  }

  static zero(): Money {
    return new Money(0)
  }
}
