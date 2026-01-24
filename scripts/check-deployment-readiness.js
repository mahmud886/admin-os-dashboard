#!/usr/bin/env node

/**
 * Deployment Readiness Checker
 *
 * This script checks your project for common issues that might cause
 * Vercel deployment failures or DEPLOYMENT_NOT_FOUND errors.
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkmark() {
  return `${colors.green}✓${colors.reset}`;
}

function xmark() {
  return `${colors.red}✗${colors.reset}`;
}

function warning() {
  return `${colors.yellow}⚠${colors.reset}`;
}

const checks = [];
const warnings = [];
const errors = [];

// Check 1: package.json exists
function checkPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    checks.push({ status: 'pass', message: 'package.json exists' });
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } else {
    errors.push('package.json not found');
    return null;
  }
}

// Check 2: Required scripts in package.json
function checkScripts(packageJson) {
  if (!packageJson) return;

  const requiredScripts = ['build', 'dev'];
  const missing = requiredScripts.filter((script) => !packageJson.scripts?.[script]);

  if (missing.length === 0) {
    checks.push({ status: 'pass', message: 'Required scripts (build, dev) exist' });
  } else {
    errors.push(`Missing scripts: ${missing.join(', ')}`);
  }
}

// Check 3: next.config.js exists
function checkNextConfig() {
  const configPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(configPath)) {
    checks.push({ status: 'pass', message: 'next.config.js exists' });
  } else {
    warnings.push('next.config.js not found (optional but recommended)');
  }
}

// Check 4: Environment variables documentation
function checkEnvDocs() {
  const readmePath = path.join(process.cwd(), 'README.md');
  if (fs.existsSync(readmePath)) {
    const readme = fs.readFileSync(readmePath, 'utf8');
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY'];

    const hasEnvDocs = requiredVars.some((varName) => readme.includes(varName));

    if (hasEnvDocs) {
      checks.push({ status: 'pass', message: 'Environment variables documented in README' });
    } else {
      warnings.push('Environment variables not documented in README');
    }
  }
}

// Check 5: .gitignore includes .vercel
function checkGitignore() {
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, 'utf8');
    if (gitignore.includes('.vercel')) {
      checks.push({ status: 'pass', message: '.vercel in .gitignore' });
    } else {
      warnings.push('.vercel not in .gitignore (should be ignored)');
    }
  }
}

// Check 6: Check for common build issues
function checkBuildIssues(packageJson) {
  if (!packageJson) return;

  // Check for Next.js
  const hasNext = packageJson.dependencies?.next || packageJson.devDependencies?.next;
  if (hasNext) {
    checks.push({ status: 'pass', message: 'Next.js dependency found' });
  } else {
    errors.push('Next.js not found in dependencies');
  }

  // Check Node.js version (if specified)
  if (packageJson.engines?.node) {
    checks.push({ status: 'pass', message: `Node.js version specified: ${packageJson.engines.node}` });
  } else {
    warnings.push('Node.js version not specified in package.json (engines.node)');
  }
}

// Check 7: Check for TypeScript issues
function checkTypeScript() {
  const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
  const hasTypeScript = fs.existsSync(tsConfigPath);

  if (hasTypeScript) {
    checks.push({ status: 'pass', message: 'TypeScript configuration found' });
  }
  // Not an error if not using TypeScript
}

// Check 8: Check middleware.ts exists (for Next.js)
function checkMiddleware() {
  const middlewarePath = path.join(process.cwd(), 'middleware.ts');
  const middlewareJsPath = path.join(process.cwd(), 'middleware.js');

  if (fs.existsSync(middlewarePath) || fs.existsSync(middlewareJsPath)) {
    checks.push({ status: 'pass', message: 'Middleware file found' });
  }
  // Not an error if no middleware
}

// Check 9: Check for .env.example or similar
function checkEnvExample() {
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envLocalPath = path.join(process.cwd(), '.env.local');

  if (fs.existsSync(envExamplePath)) {
    checks.push({ status: 'pass', message: '.env.example found' });
  } else {
    warnings.push('.env.example not found (helpful for documentation)');
  }

  if (fs.existsSync(envLocalPath)) {
    warnings.push('.env.local exists (make sure to set env vars in Vercel dashboard, not just locally)');
  }
}

// Main execution
function main() {
  log('\n🔍 Deployment Readiness Check\n', 'blue');
  log('Checking your project for common deployment issues...\n');

  const packageJson = checkPackageJson();
  checkScripts(packageJson);
  checkNextConfig();
  checkEnvDocs();
  checkGitignore();
  checkBuildIssues(packageJson);
  checkTypeScript();
  checkMiddleware();
  checkEnvExample();

  // Print results
  log('\n✅ Passed Checks:', 'green');
  checks.forEach((check) => {
    log(`  ${checkmark()} ${check.message}`);
  });

  if (warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    warnings.forEach((warnMsg) => {
      log(`  ${warning()} ${warnMsg}`);
    });
  }

  if (errors.length > 0) {
    log('\n❌ Errors:', 'red');
    errors.forEach((error) => {
      log(`  ${xmark()} ${error}`);
    });
  }

  // Summary
  log('\n' + '='.repeat(50), 'blue');
  log(
    `Summary: ${checks.length} passed, ${warnings.length} warnings, ${errors.length} errors`,
    errors.length > 0 ? 'red' : warnings.length > 0 ? 'yellow' : 'green'
  );

  if (errors.length > 0) {
    log('\n❌ Please fix the errors above before deploying.', 'red');
    process.exit(1);
  } else if (warnings.length > 0) {
    log('\n⚠️  Review the warnings above. They may cause deployment issues.', 'yellow');
  } else {
    log('\n✅ Your project looks ready for deployment!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Set environment variables in Vercel dashboard');
    log('2. Connect your Git repository to Vercel');
    log('3. Push to your main branch to trigger deployment');
    log('4. Monitor the deployment in Vercel dashboard\n');
  }
}

main();
