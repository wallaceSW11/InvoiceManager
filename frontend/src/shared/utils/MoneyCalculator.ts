import Big from 'big.js'

/**
 * Utilitário para cálculos monetários precisos usando Big.js
 * Evita problemas de arredondamento com ponto flutuante
 */

// Configuração do Big.js para trabalhar com 2 casas decimais (centavos)
Big.DP = 2 // Decimal places
Big.RM = Big.roundHalfUp // Arredondamento: metade para cima

export class MoneyCalculator {
  /**
   * Soma valores monetários
   */
  static add(...values: number[]): number {
    return values.reduce((sum, val) => {
      return new Big(sum).plus(val).toNumber()
    }, 0)
  }

  /**
   * Subtrai valores monetários
   */
  static subtract(minuend: number, subtrahend: number): number {
    return new Big(minuend).minus(subtrahend).toNumber()
  }

  /**
   * Multiplica valores monetários
   */
  static multiply(value: number, multiplier: number): number {
    return new Big(value).times(multiplier).toNumber()
  }

  /**
   * Divide valores monetários
   */
  static divide(dividend: number, divisor: number): number {
    if (divisor === 0) throw new Error('Division by zero')
    return new Big(dividend).div(divisor).toNumber()
  }

  /**
   * Arredonda para 2 casas decimais
   */
  static round(value: number): number {
    return new Big(value).round(2).toNumber()
  }

  /**
   * Divide um valor igualmente entre N participantes
   * Garante que a soma dos valores divididos seja exatamente igual ao total
   * O último participante recebe o ajuste para compensar arredondamentos
   * Funciona com valores positivos e negativos (para estornos)
   */
  static splitEqually(total: number, numberOfParts: number): number[] {
    if (numberOfParts <= 0) throw new Error('Number of parts must be positive')
    
    const totalBig = new Big(total)
    const partValue = totalBig.div(numberOfParts).round(2)
    const parts: number[] = []
    
    // Adiciona o valor arredondado para todos menos o último
    for (let i = 0; i < numberOfParts - 1; i++) {
      parts.push(partValue.toNumber())
    }
    
    // Calcula o valor do último para garantir que a soma seja exata
    const sumOfOthers = parts.reduce((sum, val) => new Big(sum).plus(val).toNumber(), 0)
    const lastPart = totalBig.minus(sumOfOthers).toNumber()
    parts.push(lastPart)
    
    return parts
  }

  /**
   * Verifica se dois valores são iguais (considerando precisão monetária)
   */
  static equals(value1: number, value2: number): boolean {
    return new Big(value1).eq(value2)
  }

  /**
   * Verifica se a diferença entre dois valores é menor que um centavo
   */
  static isNegligible(value: number): boolean {
    return new Big(value).abs().lt(0.01)
  }

  /**
   * Formata um valor como moeda brasileira
   */
  static format(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
}
