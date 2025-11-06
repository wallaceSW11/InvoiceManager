import type { Router, RouteLocationRaw } from 'vue-router'

export async function navigateTo(router: Router, to: RouteLocationRaw): Promise<void> {
  try {
    await router.push(to)
  } catch (err: any) {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
      throw err
    }
  }
}

export async function replaceTo(router: Router, to: RouteLocationRaw): Promise<void> {
  try {
    await router.replace(to)
  } catch (err: any) {
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
      throw err
    }
  }
}
