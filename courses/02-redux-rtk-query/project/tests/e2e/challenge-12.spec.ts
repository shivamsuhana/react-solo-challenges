import { test, expect } from '@playwright/test'

test.describe('Challenge 12: Error and Loading UX - E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/12-error-loading-ux')
  })

  test('should load challenge 12 page', async ({ page }) => {
    await expect(page.locator('text=Challenge 12')).toBeVisible()
    await expect(page.locator('text=Error and Loading')).toBeVisible()
  })

  test('should show users list area', async ({ page }) => {
    await expect(page.getByTestId('users-list')).toBeVisible({ timeout: 10000 })
  })
})
