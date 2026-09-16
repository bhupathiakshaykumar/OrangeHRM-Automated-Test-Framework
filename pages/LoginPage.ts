import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/web/index.php/auth/login');
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible({
      message: 'Login page heading was not visible',
    });
  }

  async login(username = 'Admin', password = 'admin123') {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      message: 'Failed to login: Dashboard header not displayed',
    });
  }

  async logout() {
    await this.page.locator('.oxd-userdropdown-tab').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible({
      message: 'Session was not invalidated / Login page not visible after logout',
    });
  }
}