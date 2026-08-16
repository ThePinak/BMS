const testErrors = async () => {
    const baseUrl = 'http://localhost:4000/api/accounts';

    console.log("=== Testing Validation Errors (Expected: 400) ===");
    
    // 1. Invalid email on creation
    let res = await fetch(baseUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Test", email: `invalid-email`, balance: 100 })
    });
    console.log(`Create with invalid email: Status ${res.status}`);

    // 2. Negative balance
    res = await fetch(baseUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Test", email: `test@test.com`, balance: -100 })
    });
    console.log(`Create with negative balance: Status ${res.status}`);

    // 3. Invalid UUID
    res = await fetch(`${baseUrl}/bad-uuid-123`);
    console.log(`Get with bad UUID: Status ${res.status}`);

    console.log("\n=== Testing Business Errors ===");

    // First, let's create a valid account
    const validEmail = `test_${Date.now()}@example.com`;
    const acc = await fetch(baseUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Test", email: validEmail, balance: 100 })
    }).then(r => r.json());
    const id = acc.data.id;

    // 4. Duplicate Email (Expected: 409)
    res = await fetch(baseUrl, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Test2", email: validEmail, balance: 100 })
    });
    console.log(`Create duplicate email: Status ${res.status} (Expected 409)`);

    // 5. Missing Account (Expected: 404)
    res = await fetch(`${baseUrl}/00000000-0000-0000-0000-000000000000`);
    console.log(`Get missing account: Status ${res.status} (Expected 404)`);

    // 6. Insufficient Balance (Expected: 400)
    res = await fetch(`${baseUrl}/${id}/withdraw`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 999999 })
    });
    console.log(`Withdraw exceeding balance: Status ${res.status} (Expected 400)`);

    // 7. Transfer to Same Account (Expected: 400)
    res = await fetch(`${baseUrl}/transfer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccountId: id, toAccountId: id, amount: 10 })
    });
    console.log(`Transfer to same account: Status ${res.status} (Expected 400)`);
}

testErrors().catch(console.error);
