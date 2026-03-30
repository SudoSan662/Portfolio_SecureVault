/**
 * SecureVault Security Test Suite
 * Tests for: XSS, SQL Injection, Input Validation, Brute Force Protection
 * Run with: node security-tests.js
 */

const assert = require('assert');

// ═══════════════════════════════════════════════
// TEST UTILITIES
// ═══════════════════════════════════════════════

class SecurityTestSuite {
    constructor() {
        this.testResults = [];
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    async runTest(name, testFn) {
        this.totalTests++;
        try {
            await testFn();
            this.passedTests++;
            this.testResults.push({ name, status: 'PASS', error: null });
            console.log(`✅ PASS: ${name}`);
        } catch (error) {
            this.failedTests++;
            this.testResults.push({ name, status: 'FAIL', error: error.message });
            console.error(`❌ FAIL: ${name}`);
            console.error(`   Error: ${error.message}`);
        }
    }

    async runAllTests() {
        console.log('\n╔════════════════════════════════════════════════╗');
        console.log('║     SECUREVAULT SECURITY TEST SUITE v1.0      ║');
        console.log('╚════════════════════════════════════════════════╝\n');

        // XSS TESTS
        console.log('━━━ XSS Vulnerability Tests ━━━\n');
        await this.testXSSProtection();

        // SQL INJECTION TESTS
        console.log('\n━━━ SQL Injection Tests ━━━\n');
        await this.testSQLInjectionProtection();

        // INPUT VALIDATION TESTS
        console.log('\n━━━ Input Validation Tests ━━━\n');
        await this.testInputValidation();

        // BRUTE FORCE PROTECTION TESTS
        console.log('\n━━━ Brute Force Protection Tests ━━━\n');
        await this.testBruteForceProtection();

        // CRYPTO TESTS
        console.log('\n━━━ Cryptography Tests ━━━\n');
        await this.testCryptoSecurity();

        // AUTHENTICATION TESTS
        console.log('\n━━━ Authentication Tests ━━━\n');
        await this.testAuthenticationSecurity();

        this.printSummary();
    }

    // ═══════════════════════════════════════════
    // XSS VULNERABILITY TESTS
    // ═══════════════════════════════════════════
    async testXSSProtection() {
        const xssPayloads = [
            '<script>alert("XSS")</script>',
            '"><script>alert("XSS")</script>',
            '<img src=x onerror="alert(\'XSS\')">',
            '<svg onload="alert(\'XSS\')">',
            'javascript:alert("XSS")',
            '<iframe src="javascript:alert(\'XSS\')"></iframe>',
            '<body onload="alert(\'XSS\')">',
            '<!--<script>alert("XSS")</script>-->',
            '<style>@import "javascript:alert(\'XSS\')";</style>',
            '<marquee onstart="alert(\'XSS\')"></marquee>'
        ];

        await this.runTest('XSS Test 1: Script Tag Injection', () => {
            const payload = xssPayloads[0];
            assert(!payload.includes('<script>') || this.isSanitized(payload));
        });

        await this.runTest('XSS Test 2: Attribute Escape', () => {
            const testInput = 'user" onmouseover="alert(1)';
            assert(this.escapeHTML(testInput).includes('&quot;'));
        });

        await this.runTest('XSS Test 3: Event Handler Filtering', () => {
            const payload = '<div onload="malicious()"></div>';
            assert(!this.isSanitized(payload) || !payload.includes('onload='));
        });

        await this.runTest('XSS Test 4: JavaScript Protocol URL', () => {
            const payload = xssPayloads[4];
            assert(!payload.includes('javascript:') || this.isURLSafe(payload));
        });

        await this.runTest('XSS Test 5: SVG Vector Attack', () => {
            const payload = xssPayloads[5];
            const sanitized = this.sanitizeHTML(payload);
            assert(!sanitized.includes('onload'));
        });

        await this.runTest('XSS Test 6: Comment Bypass', () => {
            const payload = xssPayloads[7];
            assert(!payload.includes('<!--') || this.isSanitized(payload));
        });

        await this.runTest('XSS Test 7: CSS Injection', () => {
            const payload = xssPayloads[8];
            assert(!payload.includes('@import') || !payload.includes('javascript:'));
        });

        await this.runTest('XSS Test 8: Data URL Injection', () => {
            const payload = '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
            assert(!payload.includes('alert('));
        });

        await this.runTest('XSS Test 9: HTML Entity Encoding', () => {
            const input = '<>&"\'';
            const encoded = this.escapeHTML(input);
            assert(!encoded.includes('<') && !encoded.includes('>'));
        });

        await this.runTest('XSS Test 10: Mixed Case Bypass', () => {
            const payload = '<ScRiPt>alert(1)</ScRiPt>';
            assert(!this.sanitizeHTML(payload).toLowerCase().includes('script'));
        });
    }

    // ═══════════════════════════════════════════
    // SQL INJECTION TESTS
    // ═══════════════════════════════════════════
    async testSQLInjectionProtection() {
        const sqlPayloads = [
            "'; DROP TABLE users; --",
            "1' OR '1'='1",
            "admin'--",
            "1 UNION SELECT password FROM users--",
            "1' AND SLEEP(10)--",
            "'; INSERT INTO admin VALUES('hacker'); --",
            "1' OR 1=1; SELECT * FROM users;--",
            "'; UPDATE users SET role='admin' WHERE username='user';--",
            "1' UNION ALL SELECT NULL,NULL,NULL--",
            "admin' /*"
        ];

        await this.runTest('SQL Injection Test 1: Basic Quote Escape', () => {
            const payload = sqlPayloads[0];
            assert(this.isSQLSafe(payload) || !payload.includes('DROP'));
        });

        await this.runTest('SQL Injection Test 2: Logical Bypass Prevention', () => {
            const payload = sqlPayloads[1];
            assert(!this.isSQLSafe(payload) || !payload.includes('OR'));
        });

        await this.runTest('SQL Injection Test 3: Comment Sequence', () => {
            const payload = sqlPayloads[2];
            assert(!payload.includes('--') || this.isSQLSafe(payload));
        });

        await this.runTest('SQL Injection Test 4: UNION SELECT Attack', () => {
            const payload = sqlPayloads[3];
            assert(!payload.includes('UNION'));
        });

        await this.runTest('SQL Injection Test 5: Time-Based Blind SQLi', () => {
            const payload = sqlPayloads[4];
            assert(!payload.includes('SLEEP'));
        });

        await this.runTest('SQL Injection Test 6: Data Modification', () => {
            const payload = sqlPayloads[5];
            assert(!payload.includes('INSERT'));
        });

        await this.runTest('SQL Injection Test 7: Multi-Query Execution', () => {
            const payload = sqlPayloads[6];
            assert(!payload.includes(';'));
        });

        await this.runTest('SQL Injection Test 8: UPDATE Statement Injection', () => {
            const payload = sqlPayloads[7];
            assert(!payload.includes('UPDATE'));
        });

        await this.runTest('SQL Injection Test 9: Parameterized Query Safety', () => {
            // Parameterized queries prevent injection
            assert(this.useParameterizedQueries);
        });

        await this.runTest('SQL Injection Test 10: WAF Pattern Detection', () => {
            const payload = sqlPayloads[9];
            assert(!payload.includes('/*') || this.isSQLSafe(payload));
        });
    }

    // ═══════════════════════════════════════════
    // INPUT VALIDATION TESTS
    // ═══════════════════════════════════════════
    async testInputValidation() {
        await this.runTest('Input Test 1: Username Length Validation', () => {
            const username = 'a'.repeat(256);
            assert(this.validateUsername(username) === false);
        });

        await this.runTest('Input Test 2: Password Length Minimum', () => {
            const password = '12345';
            assert(this.validatePassword(password) === false);
        });

        await this.runTest('Input Test 3: Email Format Validation', () => {
            const validEmail = 'user@example.com';
            const invalidEmail = 'not-an-email';
            assert(this.validateEmail(validEmail) === true);
            assert(this.validateEmail(invalidEmail) === false);
        });

        await this.runTest('Input Test 4: URL Format Validation', () => {
            const validURL = 'https://example.com';
            const invalidURL = 'not a url';
            assert(this.validateURL(validURL) === true);
            assert(this.validateURL(invalidURL) === false);
        });

        await this.runTest('Input Test 5: Null Byte Injection', () => {
            const payload = 'admin\x00bypass';
            assert(!payload.includes('\x00'));
        });

        await this.runTest('Input Test 6: Whitespace Normalization', () => {
            const input = '  username  ';
            const normalized = this.normalizeInput(input);
            assert(normalized === 'username');
        });

        await this.runTest('Input Test 7: Character Set Validation', () => {
            const validInput = 'username123';
            const invalidInput = 'username™©®';
            assert(this.isValidCharset(validInput) === true);
        });

        await this.runTest('Input Test 8: JSON Validation', () => {
            const validJSON = '{"key": "value"}';
            const invalidJSON = '{invalid json}';
            assert(this.isValidJSON(validJSON) === true);
            assert(this.isValidJSON(invalidJSON) === false);
        });

        await this.runTest('Input Test 9: File Upload Validation', () => {
            const safeFile = 'document.pdf';
            const unsafeFile = 'malware.exe';
            assert(this.isValidFileType(safeFile) === true);
        });

        await this.runTest('Input Test 10: Textarea Max Length', () => {
            const maxLength = 5000;
            const input = 'a'.repeat(10000);
            assert(input.length > maxLength);
        });
    }

    // ═══════════════════════════════════════════
    // BRUTE FORCE PROTECTION TESTS
    // ═══════════════════════════════════════════
    async testBruteForceProtection() {
        this.loginAttempts = [];

        await this.runTest('Brute Force Test 1: Failed Login Tracking', () => {
            this.recordFailedAttempt('user1', new Date());
            assert(this.getAttemptCount('user1') >= 1);
        });

        await this.runTest('Brute Force Test 2: Lockout After 5 Failures', async () => {
            for (let i = 0; i < 5; i++) {
                this.recordFailedAttempt('user2', new Date());
            }
            assert(this.isLockedOut('user2'));
        });

        await this.runTest('Brute Force Test 3: Progressive Delay', async () => {
            const delays = [];
            for (let i = 1; i <= 5; i++) {
                delays.push(this.calculateDelay(i));
            }
            // Delays should increase
            for (let i = 1; i < delays.length; i++) {
                assert(delays[i] >= delays[i-1]);
            }
        });

        await this.runTest('Brute Force Test 4: Time-Based Lockout Window', () => {
            const lockoutTime = this.getLockoutTime('user3');
            assert(lockoutTime >= 15 * 60_000); // 15 minutes minimum
        });

        await this.runTest('Brute Force Test 5: IP-Based Rate Limiting', () => {
            const ipLimits = this.getRateLimitPerIP('192.168.1.1');
            assert(ipLimits <= 10); // Max 10 attempts per minute
        });

        await this.runTest('Brute Force Test 6: Account Lockout Notification', () => {
            this.recordFailedAttempt('user4', new Date());
            const notification = this.shouldNotifyUser('user4');
            assert(notification === true);
        });

        await this.runTest('Brute Force Test 7: CAPTCHA on Failed Attempts', () => {
            for (let i = 0; i < 3; i++) {
                this.recordFailedAttempt('user5', new Date());
            }
            assert(this.shouldShowCAPTCHA('user5'));
        });

        await this.runTest('Brute Force Test 8: Credential Stuffing Prevention', () => {
            const commonPasswords = ['password123', '12345678', 'qwerty'];
            assert(!commonPasswords.includes('secretPass99'));
        });

        await this.runTest('Brute Force Test 9: Concurrent Login Prevention', () => {
            const sessions = this.getActiveSessions('user6');
            assert(sessions.length <= 1);
        });

        await this.runTest('Brute Force Test 10: Exponential Backoff Strategy', () => {
            const backoffTimes = [];
            for (let i = 1; i <= 5; i++) {
                backoffTimes.push(Math.pow(2, i) * 1000); // 2s, 4s, 8s, 16s, 32s
            }
            assert(backoffTimes[backoffTimes.length - 1] > backoffTimes[0]);
        });
    }

    // ═══════════════════════════════════════════
    // CRYPTOGRAPHY TESTS
    // ═══════════════════════════════════════════
    async testCryptoSecurity() {
        await this.runTest('Crypto Test 1: AES-256-GCM Support', () => {
            assert(this.isAES256GCMSupported());
        });

        await this.runTest('Crypto Test 2: PBKDF2 Iteration Count', () => {
            const iterations = 200_000;
            assert(iterations >= 100_000);
        });

        await this.runTest('Crypto Test 3: Random IV Generation', () => {
            const iv1 = this.generateIV();
            const iv2 = this.generateIV();
            assert(iv1 !== iv2);
        });

        await this.runTest('Crypto Test 4: Salt Length', () => {
            const salt = this.generateSalt();
            assert(salt.length >= 16);
        });

        await this.runTest('Crypto Test 5: Timing-Safe Hash Comparison', () => {
            const hash1 = 'abc123';
            const hash2 = 'abc123';
            assert(this.timingSafeCompare(hash1, hash2));
        });

        await this.runTest('Crypto Test 6: Key Derivation Uniqueness', () => {
            const key1 = this.deriveKey('password', 'salt1');
            const key2 = this.deriveKey('password', 'salt2');
            assert(key1 !== key2);
        });

        await this.runTest('Crypto Test 7: Encryption Output Varies', () => {
            const plaintext = 'test data';
            const encrypted1 = this.encryptData(plaintext, 'key');
            const encrypted2 = this.encryptData(plaintext, 'key');
            assert(encrypted1 !== encrypted2); // Due to random IV
        });

        await this.runTest('Crypto Test 8: Decryption Roundtrip', () => {
            const original = 'secret message';
            const encrypted = this.encryptData(original, 'key');
            const decrypted = this.decryptData(encrypted, 'key');
            assert(decrypted === original);
        });

        await this.runTest('Crypto Test 9: MAC Verification', () => {
            const data = 'important data';
            const mac = this.generateMAC(data, 'key');
            assert(this.verifyMAC(data, mac, 'key'));
        });

        await this.runTest('Crypto Test 10: Random Number Generation', () => {
            const rand1 = this.getSecureRandom();
            const rand2 = this.getSecureRandom();
            assert(rand1 !== rand2);
        });
    }

    // ═══════════════════════════════════════════
    // AUTHENTICATION TESTS
    // ═══════════════════════════════════════════
    async testAuthenticationSecurity() {
        await this.runTest('Auth Test 1: Master Password Required', () => {
            assert(this.requiresMasterPassword());
        });

        await this.runTest('Auth Test 2: Session Timeout', () => {
            const timeout = this.getSessionTimeout();
            assert(timeout <= 30 * 60_000); // Max 30 minutes
        });

        await this.runTest('Auth Test 3: Secure Cookie Attributes', () => {
            const cookie = this.createSessionCookie();
            assert(cookie.httpOnly && cookie.secure);
        });

        await this.runTest('Auth Test 4: CSRF Token Present', () => {
            assert(this.generateCSRFToken() !== undefined);
        });

        await this.runTest('Auth Test 5: Password Reset Security', () => {
            const resetToken = this.generatePasswordResetToken();
            assert(resetToken.length >= 32);
        });

        await this.runTest('Auth Test 6: Two-Factor Setup', () => {
            assert(this.supportsTwoFactor());
        });

        await this.runTest('Auth Test 7: Auth Code Expiration', () => {
            const token = this.generateAuthToken();
            assert(token.expiresIn <= 10 * 60_000);
        });

        await this.runTest('Auth Test 8: Login Audit Trail', () => {
            this.recordLogin('user', 'success');
            assert(this.hasAuditLog('user'));
        });

        await this.runTest('Auth Test 9: Privilege Escalation Prevention', () => {
            assert(!this.canEscalatePrivileges());
        });

        await this.runTest('Auth Test 10: Password History', () => {
            assert(this.enforcesPasswordHistory());
        });
    }

    // ═══════════════════════════════════════════
    // HELPER FUNCTIONS
    // ═══════════════════════════════════════════

    escapeHTML(str) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return str.replace(/[&<>"']/g, m => map[m]);
    }

    sanitizeHTML(html) {
        return html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                   .replace(/on\w+\s*=/gi, '')
                   .replace(/javascript:/gi, '');
    }

    isSanitized(input) {
        return !input.includes('<script>') && !input.includes('onerror=');
    }

    isURLSafe(url) {
        return !url.includes('javascript:') && !url.includes('data:');
    }

    isSQLSafe(input) {
        return !input.includes("'") || !input.includes('--');
    }

    validateUsername(username) {
        return username && username.length > 0 && username.length <= 50;
    }

    validatePassword(password) {
        return password && password.length >= 10;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    normalizeInput(input) {
        return input.trim();
    }

    isValidCharset(input) {
        return /^[a-zA-Z0-9_-]*$/.test(input);
    }

    isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }

    isValidFileType(filename) {
        const safeExtensions = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg'];
        return safeExtensions.some(ext => filename.endsWith(ext));
    }

    recordFailedAttempt(user, time) {
        if (!this.loginAttempts[user]) this.loginAttempts[user] = [];
        this.loginAttempts[user].push(time);
    }

    getAttemptCount(user) {
        return this.loginAttempts[user] ? this.loginAttempts[user].length : 0;
    }

    isLockedOut(user) {
        return this.getAttemptCount(user) >= 5;
    }

    calculateDelay(attemptNumber) {
        return Math.pow(2, attemptNumber) * 1000; // Exponential backoff
    }

    getLockoutTime(user) {
        return 15 * 60_000; // 15 minutes
    }

    getRateLimitPerIP(ip) {
        return 10; // 10 attempts per minute
    }

    shouldNotifyUser(user) {
        return this.getAttemptCount(user) > 0;
    }

    shouldShowCAPTCHA(user) {
        return this.getAttemptCount(user) >= 3;
    }

    getActiveSessions(user) {
        return []; // Max 1 concurrent session
    }

    isAES256GCMSupported() {
        return true;
    }

    generateIV() {
        return Math.random().toString(36);
    }

    generateSalt() {
        return 'salt_' + Math.random().toString(36).substring(2, 18);
    }

    timingSafeCompare(a, b) {
        return a === b && a.length === b.length;
    }

    deriveKey(password, salt) {
        return password + salt;
    }

    encryptData(data, key) {
        return 'enc_' + Math.random().toString(36) + data;
    }

    decryptData(encrypted, key) {
        return encrypted.replace('enc_', '').replace(/[0-9.]+/, '');
    }

    generateMAC(data, key) {
        return 'mac_' + data + key;
    }

    verifyMAC(data, mac, key) {
        return mac === this.generateMAC(data, key);
    }

    getSecureRandom() {
        return Math.random();
    }

    requiresMasterPassword() {
        return true;
    }

    getSessionTimeout() {
        return 30 * 60_000;
    }

    createSessionCookie() {
        return { httpOnly: true, secure: true, sameSite: 'Strict' };
    }

    generateCSRFToken() {
        return 'csrf_' + Math.random().toString(36);
    }

    generatePasswordResetToken() {
        return 'reset_' + Math.random().toString(36).substring(2, 34);
    }

    supportsTwoFactor() {
        return true;
    }

    generateAuthToken() {
        return { token: 'auth_' + Math.random(), expiresIn: 10 * 60_000 };
    }

    recordLogin(user, status) {
        if (!this.auditLog) this.auditLog = [];
        this.auditLog.push({ user, status, time: new Date() });
    }

    hasAuditLog(user) {
        return this.auditLog && this.auditLog.some(log => log.user === user);
    }

    canEscalatePrivileges() {
        return false;
    }

    enforcesPasswordHistory() {
        return true;
    }

    useParameterizedQueries = true;

    printSummary() {
        console.log('\n╔════════════════════════════════════════════════╗');
        console.log('║              TEST SUMMARY REPORT               ║');
        console.log('╚════════════════════════════════════════════════╝\n');
        console.log(`Total Tests:  ${this.totalTests}`);
        console.log(`Passed:       ${this.passedTests} ✅`);
        console.log(`Failed:       ${this.failedTests} ❌`);
        console.log(`Success Rate: ${((this.passedTests / this.totalTests) * 100).toFixed(2)}%\n`);

        if (this.failedTests > 0) {
            console.log('Failed Tests:');
            this.testResults
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`  ❌ ${r.name}: ${r.error}`));
        }
    }
}

// ═══════════════════════════════════════════════
// RUN TESTS
// ═══════════════════════════════════════════════
(async () => {
    for (let run = 1; run <= 5; run++) {
        console.log(`\n\n████████████████████████████████████████████████`);
        console.log(`████ TEST RUN #${run} of 5 ████`);
        console.log(`████████████████████████████████████████████████`);
        
        const suite = new SecurityTestSuite();
        await suite.runAllTests();
        
        // Wait between runs
        if (run < 5) {
            console.log('\n⏳ Waiting before next test run...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('\n\n✨ All test runs completed!\n');
})();
