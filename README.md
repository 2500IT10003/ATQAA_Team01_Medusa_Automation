# ATQAA Team 01 - Medusa Automation

This repository contains the automated QA and performance testing assets for the Medusa project. It brings together API validation, UI regression testing, and load testing in a single, reusable automation framework.

## Overview

The project is organized into three main automation areas:

- Postman: API contract and functional testing collections
- Playwright: browser-based end-to-end and UI verification tests
- k6: performance and load testing scripts
- GitHub Actions: CI pipeline to run automated checks

This repository is designed to support continuous verification of the application throughout development and release cycles.

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── testing-pipeline.yml
├── k6/
│   ├── data/
│   └── scripts/
├── playwright/
│   ├── pages/
│   └── tests/
├── postman/
│   ├── collections/
│   └── environments/
├── .gitignore
├── README.md
└── package.json (if added later for Playwright tooling)
```

## What is Included

### API Testing with Postman

The Postman folder holds API collections and environment files used to validate request/response behavior, authentication flows, and endpoint reliability.

Typical use cases:
- Smoke testing application APIs
- Validating request payloads and response schemas
- Testing authentication and session flows
- Sharing API checks with QA and developers

### UI Automation with Playwright

The Playwright folder is intended for end-to-end UI test automation, including page objects and test specifications.

Typical use cases:
- User journey validation
- Regression testing for UI workflows
- Interface consistency and behavior checks

### Performance Testing with k6

The k6 directory contains scripts and supporting data files for throughput, concurrency, and endurance testing.

Typical use cases:
- Load testing critical APIs
- Measuring response time under stress
- Detecting performance degradation and bottlenecks

### CI/CD Pipeline

The GitHub Actions workflow under `.github/workflows/` is intended to automate the execution of the QA checks whenever code is pushed or a pull request is created.

## Prerequisites

Before running the automation suite, ensure the following tools are installed:

- Git
- Node.js (recommended LTS)
- npm
- Playwright
- k6
- Postman (optional, for manual collection execution)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/2500IT10003/ATQAA_Team01_Medusa_Automation.git
cd ATQAA_Team01_Medusa_Automation
```

### 2. Install Playwright dependencies

```bash
npm install
npx playwright install
```

If the project uses a `package.json` file later in development, keep dependencies in sync using the appropriate install commands.

### 3. Configure your environment

Create a test environment file or export variables for the target application, such as:

```bash
export BASE_URL="http://localhost:3000"
export API_BASE_URL="http://localhost:9000"
```

Update the values to match your Medusa instance and test environment.

### 4. Run Postman tests

Import the collection and environment under `postman/` into Postman, then run the requests using the correct environment variables.

### 5. Run Playwright tests

```bash
npx playwright test
```

You can also run a specific file or browser:

```bash
npx playwright test playwright/tests
npx playwright test --project=chromium
```

### 6. Run k6 load tests

```bash
k6 run k6/scripts/<script-name>.js
```

If your scripts require environment variables or external data files, update the script headers accordingly.

## Suggested Automation Workflow

A typical workflow for this project may look like this:

1. Run API regression tests in Postman
2. Run Playwright UI smoke tests
3. Execute k6 performance tests for critical flows
4. Review CI results from GitHub Actions
5. Investigate failures and iterate on fixes

## CI Pipeline

The repository contains a GitHub Actions workflow in `.github/workflows/testing-pipeline.yml`. This pipeline is intended to automate regression testing and provide a consistent quality gate for changes pushed to the repository.

## Contributing

Contributions are welcome. When making changes:

- Keep test cases organized by type
- Maintain reusable page objects in Playwright
- Use clear naming conventions for k6 scripts
- Keep Postman collections and environments versioned
- Update CI configuration when adding new checks

## Notes

This repository is currently structured as a QA automation workspace and may evolve as the application and test suite expand. The automation strategy should stay aligned with the Medusa application’s release and validation requirements.

## License

No explicit license file is currently included in this repository. If you plan to publish or share this project externally, add a license file and update this section accordingly.

## Contact

For questions or collaboration, contact the ATQAA Team 01 project maintainers through the repository owners or project channel used by your team.
