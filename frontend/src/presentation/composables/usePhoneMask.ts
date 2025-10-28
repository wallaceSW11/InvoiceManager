export function usePhoneMask() {
  function formatPhone(value: string): string {
    if (!value) return ''
    
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '')
    
    // Aplica a máscara (xx) xxxxx-xxxx
    if (cleaned.length <= 2) {
      return cleaned
    } else if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`
    } else if (cleaned.length <= 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
    }
    
    // Limita a 11 dígitos
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`
  }
  
  function unformatPhone(value: string): string {
    return value.replace(/\D/g, '')
  }
  
  function validatePhone(value: string): boolean {
    const cleaned = unformatPhone(value)
    return cleaned.length === 10 || cleaned.length === 11
  }
  
  return {
    formatPhone,
    unformatPhone,
    validatePhone
  }
}
