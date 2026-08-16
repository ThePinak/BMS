const testAuth = async () => {
    const baseUrl = 'http://localhost:4000/api/accounts';

    console.log("=== 1. Registering Users ===");
    const userAEmail = `alice${Date.now()}@test.com`;
    const userA = await fetch(`${baseUrl}/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Alice", email: userAEmail, password: "password123", balance: 500 })
    }).then(r => r.json());
    console.log("Registered Alice:", userA.success, userA.message);

    const userBEmail = `bob${Date.now()}@test.com`;
    const userB = await fetch(`${baseUrl}/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Bob", email: userBEmail, password: "password123", balance: 100 })
    }).then(r => r.json());
    console.log("Registered Bob:", userB.success, userB.message);
    const bobId = userB.data?.id;

    console.log("\n=== 2. Testing Login ===");
    const badLogin = await fetch(`${baseUrl}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userAEmail, password: "wrongpassword" })
    }).then(r => r.json());
    console.log("Bad Login (Expect false):", badLogin.success, badLogin.message);

    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userAEmail, password: "password123" })
    }).then(r => r.json());
    console.log("Good Login:", loginRes.success);
    
    const token = loginRes.data.token;

    console.log("\n=== 3. Testing Protected Routes (Option A) ===");
    
    // No token withdraw (Expect fail)
    const failWith = await fetch(`${baseUrl}/withdraw`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 50 })
    }).then(r => r.json());
    console.log("No token withdraw (Expect false):", failWith.success, failWith.message);

    // Valid deposit
    const goodDep = await fetch(`${baseUrl}/deposit`, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 100 })
    }).then(r => r.json());
    console.log("Alice Deposit 100 (Expect true):", goodDep.success, "New Balance:", goodDep.data?.balance);

    // Valid transfer from Alice to Bob
    const trans = await fetch(`${baseUrl}/transfer`, {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ toAccountId: bobId, amount: 150 })
    }).then(r => r.json());
    console.log("Alice Transfer 150 to Bob (Expect true):", trans.success);

    // Check history
    const hist = await fetch(`${baseUrl}/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(r => r.json());
    console.log("Alice History Length:", hist.data?.length);

}
testAuth().catch(console.error);
