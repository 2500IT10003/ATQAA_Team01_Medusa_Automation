import { test } from '@playwright/test'; 

import { AdminLoginPage } from '../pages/AdminLoginPage'; 

 

test.describe('Admin Authentication Suite', () => { 

  test('Verify admin user logs in and redirects to dashboard', async ({ page }) => { 
    test.setTimeout(180_000);
    const adminLoginPage = new AdminLoginPage(page); 

    await adminLoginPage.gotoAdmin(); 

    await adminLoginPage.login(); 

    await adminLoginPage.assertLoginSuccess(); 

  }); 

}); 