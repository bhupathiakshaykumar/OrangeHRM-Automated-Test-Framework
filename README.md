# OrangeHRM Automated Test Framework (AI Driven Automation Engineer Assessment)

This repository contains an end-to-end test framework using *Playwright (TypeScript)* following the *Page Object Model (POM)* design pattern.

## Features Implemented
- *Login & Invalidation:* Automated login and logout validation.
- *Data-Driven Testing:* Employee creation parameterized via data/employeeData.json.
- *File Upload:* Profile picture upload automated via native file-chooser handlers.
- *Edit & Verification:* Dynamic search, table parsing, and record mutation.
- *API Cross-Validation:* API assertion integration via ReqRes / Playwright request fixtures.
- *Reports & Artifacts:* Automatic HTML test report and MP4 video recordings.

## Prerequisites
- Node.js (v18 or higher)
- npm

## Setup Instructions
```bash
git clone <YOUR_REPO_URL>
cd orangehrm-automation
npm install
npx playwright install chromium