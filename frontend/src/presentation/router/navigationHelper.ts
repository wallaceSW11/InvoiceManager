import type { Router, RouteLocationRaw } from 'vue-router'

/**
 * Navega para uma rota tratando erros de navegação duplicada
 * @param router - Instância do Vue Router
 * @param to - Destino da navegação (path string ou objeto de rota)
 * @returns Promise que resolve quando a navegação completa
 */
export async function navigateTo(router: Router, to: RouteLocationRaw): Promise<void> {
  try {
    await router.push(to)
  } catch (err: any) {
    // Ignora erros de navegação duplicada (quando já está na rota)
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
      throw err // Re-lança outros erros para que possam ser tratados pelo caller
    }
  }
}

/**
 * Substitui a rota atual tratando erros de navegação duplicada
 * @param router - Instância do Vue Router
 * @param to - Destino da navegação (path string ou objeto de rota)
 * @returns Promise que resolve quando a navegação completa
 */
export async function replaceTo(router: Router, to: RouteLocationRaw): Promise<void> {
  try {
    await router.replace(to)
  } catch (err: any) {
    // Ignora erros de navegação duplicada (quando já está na rota)
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
      throw err // Re-lança outros erros para que possam ser tratados pelo caller
    }
  }
}
