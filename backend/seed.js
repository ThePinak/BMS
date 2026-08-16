const seedDatabase = async () => {
    const baseUrl = 'http://localhost:4000/api/accounts';
    console.log("Starting Database Seed Process...");

    // 1. Register Accounts
    console.log("\n--- Creating Accounts ---");
    const accounts = [
        { name: "Alice Smith", email: `alice_${Date.now()}@bank.com`, password: "password123", balance: 1000 },
        { name: "Bob Johnson", email: `bob_${Date.now()}@bank.com`, password: "password123", balance: 500 },
        { name: "Charlie Davis", email: `charlie_${Date.now()}@bank.com`, password: "password123", balance: 2000 }
    ];

    const registeredAccounts = [];
    for (const acc of accounts) {
        const res = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(acc)
        }).then(r => r.json());
        
        if (res.success) {
            console.log(`Created ${acc.name} with ID: ${res.data.id}`);
            registeredAccounts.push({ ...res.data, rawEmail: acc.email, rawPassword: acc.password });
        } else {
            console.error(`Failed to create ${acc.name}: ${res.message}`);
        }
    }

    if (registeredAccounts.length < 3) {
        console.error("Stopping seed due to registration failure.");
        return;
    }

    const [alice, bob, charlie] = registeredAccounts;

    // 2. Login to get Tokens
    console.log("\n--- Authenticating Users ---");
    const getAuthToken = async (email, password) => {
        const res = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(r => r.json());
        return res.data.token;
    };

    const aliceToken = await getAuthToken(alice.rawEmail, alice.rawPassword);
    const bobToken = await getAuthToken(bob.rawEmail, bob.rawPassword);
    const charlieToken = await getAuthToken(charlie.rawEmail, charlie.rawPassword);
    console.log("Authenticated all users");

    // 3. Perform Operations
    console.log("\n--- Performing Financial Operations ---");

    // Alice Deposits 500
    const depRes = await fetch(`${baseUrl}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${aliceToken}` },
        body: JSON.stringify({ amount: 500 })
    }).then(r => r.json());
    console.log(`Alice deposited $500. New Balance: $${depRes.data.balance}`);

    // Charlie Transfers 1000 to Bob
    const transRes = await fetch(`${baseUrl}/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${charlieToken}` },
        body: JSON.stringify({ toAccountId: bob.id, amount: 1000 })
    }).then(r => r.json());
    console.log(`Charlie transferred $1000 to Bob. Success: ${transRes.success}`);

    // Bob Withdraws 200
    const withRes = await fetch(`${baseUrl}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${bobToken}` },
        body: JSON.stringify({ amount: 200 })
    }).then(r => r.json());
    console.log(`Bob withdrew $200. New Balance: $${withRes.data.balance}`);

    console.log("\nDatabase Seeding Complete!");
};

seedDatabase().catch(console.error);
