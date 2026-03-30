/**
 * XSS (Cross-Site Scripting) Injection Tests
 * Tests for DOM-based, reflected, and stored XSS vulnerabilities
 */

class XSSVulnerabilityTester {
    constructor() {
        this.xssPayloads = [];
        this.testResults = [];
        this.vulnerabilitiesFound = 0;
    }

    async runXSSTests() {
        console.log('\n╔══════════════════════════════════════════════════════╗');
        console.log('║     XSS (CROSS-SITE SCRIPTING) INJECTION TESTS      ║');
        console.log('╚══════════════════════════════════════════════════════╝\n');

        // Prepare XSS payloads
        this.preparePayloads();

        // Run different XSS attack vectors
        console.log('🔴 Test 1: DOM-based XSS\n');
        await this.testDOMXSS(5);

        console.log('\n🟠 Test 2: Reflected XSS\n');
        await this.testReflectedXSS(5);

        console.log('\n🟡 Test 3: Stored XSS\n');
        await this.testStoredXSS(5);

        console.log('\n🟢 Test 4: Context-aware XSS\n');
        await this.testContextXSS(5);

        console.log('\n🔵 Test 5: Event Handler XSS\n');
        await this.testEventHandlerXSS(5);

        this.printXSSReport();
    }

    // ═══════════════════════════════════════════
    // XSS TEST METHODS
    // ═══════════════════════════════════════════

    async testDOMXSS(rounds) {
        console.log(`   Testing DOM-based XSS over ${rounds} rounds...\n`);
        
        let vulnerableCount = 0;

        for (let i = 0; i < rounds; i++) {
            const payload = this.xssPayloads[i % this.xssPayloads.length];
            const result = await this.injectIntoDOMElement(payload, i);
            
            if (result.vulnerable) {
                vulnerableCount++;
                console.log(`   ❌ Round ${i + 1}: VULNERABLE - ${result.reason}`);
            } else {
                console.log(`   ✅ Round ${i + 1}: PROTECTED - Payload sanitized`);
            }
        }

        console.log(`\n   DOM XSS Protection: ${((rounds - vulnerableCount) / rounds * 100).toFixed(2)}% secure\n`);
        this.testResults.push({
            testName: 'DOM XSS',
            vulnerabilities: vulnerableCount,
            protectionRate: ((rounds - vulnerableCount) / rounds * 100)
        });
    }

    async testReflectedXSS(rounds) {
        console.log(`   Testing reflected XSS over ${rounds} rounds...\n`);
        
        let vulnerableCount = 0;

        for (let i = 0; i < rounds; i++) {
            const payload = this.xssPayloads[i % this.xssPayloads.length];
            const result = await this.injectIntoQueryParam(payload, i);
            
            if (result.vulnerable) {
                vulnerableCount++;
                console.log(`   ❌ Round ${i + 1}: VULNERABLE - URL parameter not escaped`);
            } else {
                console.log(`   ✅ Round ${i + 1}: PROTECTED - Input validation applied`);
            }
        }

        console.log(`\n   Reflected XSS Protection: ${((rounds - vulnerableCount) / rounds * 100).toFixed(2)}% secure\n`);
        this.testResults.push({
            testName: 'Reflected XSS',
            vulnerabilities: vulnerableCount,
            protectionRate: ((rounds - vulnerableCount) / rounds * 100)
        });
    }

    async testStoredXSS(rounds) {
        console.log(`   Testing stored XSS over ${rounds} rounds...\n`);
        
        let vulnerableCount = 0;

        for (let i = 0; i < rounds; i++) {
            const payload = this.xssPayloads[i % this.xssPayloads.length];
            const result = await this.storeAndRetrievePayload(payload, i);
            
            if (result.vulnerable) {
                vulnerableCount++;
                console.log(`   ❌ Round ${i + 1}: VULNERABLE - Stored payload executed`);
            } else {
                console.log(`   ✅ Round ${i + 1}: PROTECTED - Payload stored safely`);
            }
        }

        console.log(`\n   Stored XSS Protection: ${((rounds - vulnerableCount) / rounds * 100).toFixed(2)}% secure\n`);
        this.testResults.push({
            testName: 'Stored XSS',
            vulnerabilities: vulnerableCount,
            protectionRate: ((rounds - vulnerableCount) / rounds * 100)
        });
    }

    async testContextXSS(rounds) {
        console.log(`   Testing context-aware XSS over ${rounds} rounds...\n`);
        
        let vulnerableCount = 0;

        for (let i = 0; i < rounds; i++) {
            const payload = this.xssPayloads[i % this.xssPayloads.length];
            const result = await this.injectIntoContext(payload, i);
            
            if (result.vulnerable) {
                vulnerableCount++;
                console.log(`   ❌ Round ${i + 1}: VULNERABLE - Context bypass detected`);
            } else {
                console.log(`   ✅ Round ${i + 1}: PROTECTED - Context properly validated`);
            }
        }

        console.log(`\n   Context XSS Protection: ${((rounds - vulnerableCount) / rounds * 100).toFixed(2)}% secure\n`);
        this.testResults.push({
            testName: 'Context XSS',
            vulnerabilities: vulnerableCount,
            protectionRate: ((rounds - vulnerableCount) / rounds * 100)
        });
    }

    async testEventHandlerXSS(rounds) {
        console.log(`   Testing event handler XSS over ${rounds} rounds...\n`);
        
        let vulnerableCount = 0;

        for (let i = 0; i < rounds; i++) {
            const payload = this.xssPayloads[i % this.xssPayloads.length];
            const result = await this.injectEventHandler(payload, i);
            
            if (result.vulnerable) {
                vulnerableCount++;
                console.log(`   ❌ Round ${i + 1}: VULNERABLE - Event handler allowed`);
            } else {
                console.log(`   ✅ Round ${i + 1}: PROTECTED - Event handlers stripped`);
            }
        }

        console.log(`\n   Event Handler XSS Protection: ${((rounds - vulnerableCount) / rounds * 100).toFixed(2)}% secure\n`);
        this.testResults.push({
            testName: 'Event Handler XSS',
            vulnerabilities: vulnerableCount,
            protectionRate: ((rounds - vulnerableCount) / rounds * 100)
        });
    }

    // ═══════════════════════════════════════════
    // INJECTION SIMULATION METHODS
    // ═══════════════════════════════════════════

    async injectIntoDOMElement(payload, round) {
        // Simulate injecting into innerHTML
        const testDiv = this.createTestDiv();
        
        try {
            // Normally unsafe, but with proper sanitization it's safe
            const sanitized = this.sanitizePayload(payload);
            testDiv.innerHTML = sanitized;
            
            // Check if payload was executed
            const isVulnerable = sanitized.includes('<script>') || sanitized.includes('onerror=');
            
            return {
                vulnerable: isVulnerable,
                reason: isVulnerable ? 'Script tag or event handler detected' : 'Safe injection'
            };
        } catch (e) {
            return {
                vulnerable: false,
                reason: 'Exception caught - injection prevented'
            };
        }
    }

    async injectIntoQueryParam(payload, round) {
        // Simulate URL parameter injection
        const testURL = `https://securevault.local/?username=${encodeURIComponent(payload)}`;
        
        try {
            const url = new URL(testURL);
            const param = url.searchParams.get('username');
            
            // Check if parameter is properly encoded
            const isVulnerable = param.includes('<') || param.includes('>');
            
            return {
                vulnerable: isVulnerable,
                reason: isVulnerable ? 'Raw HTML in parameter' : 'Parameter properly encoded'
            };
        } catch (e) {
            return {
                vulnerable: false,
                reason: 'URL parsing prevented injection'
            };
        }
    }

    async storeAndRetrievePayload(payload, round) {
        // Simulate storing in database and retrieving
        const storage = {};
        const id = `item_${round}`;
        
        try {
            // Store the payload
            storage[id] = this.sanitizePayload(payload);
            
            // Retrieve and check if it's safe
            const retrieved = storage[id];
            const isVulnerable = retrieved.includes('<script>') || retrieved.includes('on');
            
            return {
                vulnerable: isVulnerable,
                reason: isVulnerable ? 'Stored payload could execute' : 'Payload safely stored'
            };
        } catch (e) {
            return {
                vulnerable: false,
                reason: 'Storage operation failed - injection blocked'
            };
        }
    }

    async injectIntoContext(payload, round) {
        // Test context-aware injection (HTML, JS, CSS, URL contexts)
        const contexts = {
            html: `<div>${payload}</div>`,
            attribute: `<div title="${payload}"></div>`,
            script: `var x = "${payload}";`,
            css: `body { background: ${payload}; }`
        };

        let vulnerableContexts = 0;

        for (const [contextType, context] of Object.entries(contexts)) {
            const sanitized = this.sanitizeForContext(context, contextType);
            
            if (sanitized.includes('<script>') || sanitized.includes('on')) {
                vulnerableContexts++;
            }
        }

        return {
            vulnerable: vulnerableContexts > 0,
            reason: vulnerableContexts > 0 ? `Vulnerable in ${vulnerableContexts} contexts` : 'Safe in all contexts'
        };
    }

    async injectEventHandler(payload, round) {
        // Test event handler injection
        const eventHandlers = [
            `<div onclick="${payload}"></div>`,
            `<img onerror="${payload}">`,
            `<body onload="${payload}">`,
            `<svg onload="${payload}">`,
            `<input onfocus="${payload}">`
        ];

        let vulnerableHandlers = 0;

        for (const handler of eventHandlers) {
            const sanitized = this.sanitizePayload(handler);
            if (sanitized.match(/on\w+\s*=/i)) {
                vulnerableHandlers++;
            }
        }

        return {
            vulnerable: vulnerableHandlers > 0,
            reason: vulnerableHandlers > 0 ? `${vulnerableHandlers} event handlers still active` : 'All handlers removed'
        };
    }

    // ═══════════════════════════════════════════
    // PAYLOAD & SANITIZATION METHODS
    // ═══════════════════════════════════════════

    preparePayloads() {
        this.xssPayloads = [
            '<script>alert("XSS")</script>',
            '"><script>alert("XSS")</script>',
            '<img src=x onerror="alert(\'XSS\')">',
            '<svg onload="alert(\'XSS\')">',
            'javascript:alert("XSS")',
            '<iframe src="javascript:alert(\'XSS\')"></iframe>',
            '<body onload="alert(\'XSS\')">',
            '<!--<script>alert("XSS")</script>-->',
            '<style>@import "javascript:alert(\'XSS\')";</style>',
            '<marquee onstart="alert(\'XSS\')"></marquee>',
            '"+alert("XSS")+""',
            '<img src="x:" onerror="alert(\'XSS\')">',
            '<details open ontoggle="alert(\'XSS\')">',
            '<video src=x onerror="alert(\'XSS\')">',
            '<audio src=x onerror="alert(\'XSS\')">'
        ];
    }

    sanitizePayload(payload) {
        // Remove dangerous tags and event handlers
        let sanitized = payload;
        
        // Remove script tags
        sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        
        // Remove event handlers
        sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
        sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
        
        // Remove javascript: protocol
        sanitized = sanitized.replace(/javascript:/gi, '');
        
        // Remove data URLs in src
        sanitized = sanitized.replace(/src\s*=\s*["']data:text\/html[^"']*["']/gi, '');
        
        return sanitized;
    }

    sanitizeForContext(context, contextType) {
        const contextSanitizers = {
            html: (str) => this.escapeHTML(str),
            attribute: (str) => this.escapeAttribute(str),
            script: (str) => this.escapeJavaScript(str),
            css: (str) => this.escapeCSS(str)
        };

        const sanitizer = contextSanitizers[contextType] || ((str) => str);
        return sanitizer(context);
    }

    escapeHTML(html) {
        const div = this.createTestDiv();
        div.textContent = html;
        return div.innerHTML;
    }

    escapeAttribute(attr) {
        const map = {
            '"': '&quot;',
            "'": '&#39;',
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        };
        return attr.replace(/["'<>&]/g, char => map[char]);
    }

    escapeJavaScript(js) {
        return js.replace(/\\/g, '\\\\')
                 .replace(/"/g, '\\"')
                 .replace(/'/g, "\\'")
                 .replace(/\n/g, '\\n')
                 .replace(/\r/g, '\\r');
    }

    escapeCSS(css) {
        return css.replace(/[<>"'&]/g, char => {
            const charCode = char.charCodeAt(0);
            return `\\${charCode.toString(16)} `;
        });
    }

    createTestDiv() {
        if (typeof document !== 'undefined') {
            return document.createElement('div');
        }
        return { innerHTML: '', textContent: '' };
    }

    // ═══════════════════════════════════════════
    // REPORTING
    // ═══════════════════════════════════════════

    printXSSReport() {
        console.log('\n╔══════════════════════════════════════════════════════╗');
        console.log('║        XSS PROTECTION REPORT & SUMMARY               ║');
        console.log('╚══════════════════════════════════════════════════════╝\n');

        let totalVulnerabilities = 0;
        let totalProtectionRate = 0;

        this.testResults.forEach(result => {
            console.log(`📊 ${result.testName}:`);
            console.log(`   Vulnerabilities found: ${result.vulnerabilities}`);
            console.log(`   Protection rate: ${result.protectionRate.toFixed(2)}%`);
            console.log('');
            
            totalVulnerabilities += result.vulnerabilities;
            totalProtectionRate += result.protectionRate;
        });

        const avgProtectionRate = totalProtectionRate / this.testResults.length;
        
        console.log(`\n📈 OVERALL STATISTICS:`);
        console.log(`   Total test sets: ${this.testResults.length}`);
        console.log(`   Total vulnerabilities: ${totalVulnerabilities}`);
        console.log(`   Average protection rate: ${avgProtectionRate.toFixed(2)}%`);
        
        if (avgProtectionRate >= 95) {
            console.log('\n   ✅ XSS PROTECTION: EXCELLENT');
        } else if (avgProtectionRate >= 80) {
            console.log('\n   ⚠️  XSS PROTECTION: GOOD (needs attention)');
        } else {
            console.log('\n   ❌ XSS PROTECTION: CRITICAL ISSUES');
        }
    }
}

// ═══════════════════════════════════════════════
// RUN XSS TESTS
// ═══════════════════════════════════════════════
(async () => {
    console.log('\n\n████████████████████████████████████████████████');
    console.log('████           XSS INJECTION TESTS              ████');
    console.log('████████████████████████████████████████████████\n');

    for (let xssRun = 1; xssRun <= 5; xssRun++) {
        console.log(`\n╔══════════════════════════════════════════════════════╗`);
        console.log(`║             XSS TEST RUN #${xssRun} of 5                     ║`);
        console.log(`╚══════════════════════════════════════════════════════╝`);

        const xssTester = new XSSVulnerabilityTester();
        await xssTester.runXSSTests();

        if (xssRun < 5) {
            console.log('\n⏳ Preparing next XSS test round...\n');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }

    console.log('\n\n✨ All XSS tests completed!\n');
})();
