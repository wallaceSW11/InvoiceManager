import Big from 'big.js'

Big.DP = 2
Big.RM = Big.roundHalfUp

export class MoneyCalculator {
  static add(...values: number[]): number {
    return values.reduce((sum, val) => {
      return new Big(sum).plus(val).toNumber()
    }, 0)
  }

  static subtract(minuend: number, subtrahend: number): number {
    return new Big(minuend).minus(subtrahend).toNumber()
  }

  static multiply(value: number, multiplier: number): number {
    return new Big(value).times(multiplier).toNumber()
  }

  static divide(dividend: number, divisor: number): number {
    if (divisor === 0) throw new Error('Division by zero')
    return new Big(dividend).div(divisor).toNumber()
  }

  static round(value: number): number {
    return new Big(value).round(2).toNumber()
  }

  static splitEqually(total: number, numberOfParts: number): number[] {
    if (numberOfParts <= 0) throw new Error('Number of parts must be positive')
    
    const totalBig = new Big(total)
    const partValue = totalBig.div(numberOfParts).round(2)
    const parts: number[] = []
    
    for (let i = 0; i < numberOfParts - 1; i++) {
      parts.push(partValue.toNumber())
    }
    
    const sumOfOthers = parts.reduce((sum, val) => new Big(sum).plus(val).toNumber(), 0)
    const lastPart = totalBig.minus(sumOfOthers).toNumber()
    parts.push(lastPart)
    
    return parts
  }

  static equals(value1: number, value2: number): boolean {
    return new Big(value1).eq(value2)
  }

  static isNegligible(value: number): boolean {
    return new Big(value).abs().lt(0.01)
  }

  static format(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
}
