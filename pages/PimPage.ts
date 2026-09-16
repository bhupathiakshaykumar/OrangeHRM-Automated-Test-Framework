import { Page, expect } from '@playwright/test';

export class PimPage {
  constructor(private page: Page) {}

  async navigateToPIM() {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await expect(this.page.getByRole('heading', { name: 'PIM' })).toBeVisible();
  }

  // Removed imageRelPath and file upload steps
  async addEmployee(firstName: string, lastName: string, empId: string) {
    await this.page.getByRole('button', { name: 'Add' }).click();

    // Fill personal info
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);

    // Fill Employee ID (clear pre-filled default first)
    const empIdInput = this.page.locator('form input.oxd-input').nth(4);
    await empIdInput.click();
    await this.page.keyboard.press('ControlOrMeta+A');
    await this.page.keyboard.press('Backspace');
    await empIdInput.fill(empId);

    // Save
    await this.page.getByRole('button', { name: 'Save' }).first().click();
    await expect(this.page.getByText('Successfully Saved')).toBeVisible();
  }

  async searchEmployeeById(empId: string) {
    await this.navigateToPIM();
    const searchEmpIdInput = this.page.locator('.oxd-input-group input').nth(1);
    await searchEmpIdInput.fill(empId);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyRecordPresent(empId: string) {
    await expect(this.page.locator('.oxd-table-card').filter({ hasText: empId })).toBeVisible();
  }

  async editEmployeeDetails(empId: string, jobTitle: string) {
    await this.page.locator('.oxd-table-cell-actions .bi-pencil').first().click();
    await expect(this.page.getByRole('heading', { name: 'Personal Details' })).toBeVisible();

    await this.page.getByRole('link', { name: 'Job' }).click();
    await expect(this.page.getByRole('heading', { name: 'Job Details' })).toBeVisible();

    const jobDropdown = this.page.locator('.oxd-select-wrapper').first();
    await jobDropdown.click();
    await this.page.locator('.oxd-select-dropdown').getByText(jobTitle).first().click();

    await this.page.getByRole('button', { name: 'Save' }).first().click();
    await expect(this.page.getByText('Successfully Updated')).toBeVisible();
  }

  async deleteEmployee(empId: string) {
    await this.searchEmployeeById(empId);
    await this.page.locator('.oxd-table-cell-actions .bi-trash').first().click();
    await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
    await expect(this.page.getByText('Successfully Deleted')).toBeVisible();
  }

  async verifyRecordDeleted(empId: string) {
    await this.searchEmployeeById(empId);
    await expect(this.page.getByText('No Records Found')).toBeVisible();
  }
}