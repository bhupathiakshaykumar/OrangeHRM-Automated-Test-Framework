import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import employeeData from '../data/employeeData.json';

test.describe('OrangeHRM - Employee Lifecycle E2E & API Validation', () => {
  // Generate a unique ID per run to avoid collision in the demo environment
  const uniqueEmpId = `${employeeData.employeeId}_${Math.floor(Math.random() * 900 + 100)}`;

  test('Complete Employee Lifecycle: Add, Edit, API Verify, Delete, Logout', async ({ page, request }) => {
    const loginPage = new LoginPage(page);
    const pimPage = new PimPage(page);

    // Step 1: Login
    await test.step('1. Login with Valid Credentials', async () => {
      await loginPage.navigate();
      await loginPage.login('Admin', 'admin123');
    });

    // Step 2: Add New Employee (Data-Driven without avatar image)
    await test.step('2. Add New Employee (Data-Driven)', async () => {
      await pimPage.navigateToPIM();
      await pimPage.addEmployee(
        employeeData.firstName,
        employeeData.lastName,
        uniqueEmpId
      );
    });

    // Step 3: Search and Edit Employee
    await test.step('3. Search and Edit Employee Details', async () => {
      await pimPage.searchEmployeeById(uniqueEmpId);
      await pimPage.verifyRecordPresent(uniqueEmpId);
      await pimPage.editEmployeeDetails(uniqueEmpId, employeeData.jobTitle);
    });

    // Step 4: Validate via API (ReqRes simulation as allowed in PDF instructions)
    await test.step('4. Validate Employee via API Simulation (ReqRes)', async () => {
      const apiResponse = await request.post('https://reqres.in/api/users', {
        data: {
          name: `${employeeData.firstName} ${employeeData.lastName}`,
          job: employeeData.jobTitle,
          empId: uniqueEmpId,
        },
      });

      expect(apiResponse.status()).toBe(201);
      const resBody = await apiResponse.json();
      expect(resBody.job).toBe(employeeData.jobTitle);
      expect(resBody.name).toContain(employeeData.firstName);
    });

    // Step 5: Delete Employee & Verify
    await test.step('5. Delete Employee and Confirm Removal', async () => {
      await pimPage.deleteEmployee(uniqueEmpId);
      await pimPage.verifyRecordDeleted(uniqueEmpId);
    });

    // Step 6: Logout and Verify Session Invalidation
    await test.step('6. Logout and Invalidate Session', async () => {
      await loginPage.logout();
    });
  });
});