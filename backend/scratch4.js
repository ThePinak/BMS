const test = async () => {
    try {
        const baseUrl = 'http://localhost:4000/api/accounts';

        console.log("1. Creating Account A...");
        const resA = await fetch(baseUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Account A", email: `a${Date.now()}@test.com` })
        }).then(r => r.json());
        const idA = resA.data.id;
        console.log("Account A ID:", idA, "- Balance:", resA.data.balance);

        console.log("\n2. Creating Account B...");
        const resB = await fetch(baseUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: "Account B", email: `b${Date.now()}@test.com` })
        }).then(r => r.json());
        const idB = resB.data.id;
        console.log("Account B ID:", idB, "- Balance:", resB.data.balance);

        console.log("\n3. Depositing 500 into A...");
        const depA = await fetch(`${baseUrl}/${idA}/deposit`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 500 })
        }).then(r => r.json());
        console.log("Deposit A Success:", depA.success, "- New Balance:", depA.data?.balance);

        console.log("\n4. Withdrawing 200 from A...");
        const withA = await fetch(`${baseUrl}/${idA}/withdraw`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 200 })
        }).then(r => r.json());
        console.log("Withdraw A Success:", withA.success, "- New Balance:", withA.data?.balance);

        console.log("\n5. Transferring 150 from A to B...");
        const trans = await fetch(`${baseUrl}/transfer`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromAccountId: idA, toAccountId: idB, amount: 150 })
        }).then(r => r.json());
        console.log("Transfer Success:", trans.success);
        console.log("Account A Balance:", trans.data?.fromAccount?.balance);
        console.log("Account B Balance:", trans.data?.toAccount?.balance);

        console.log("\n6. Fetching Transaction History for A...");
        const histA = await fetch(`${baseUrl}/${idA}/transactions`).then(r => r.json());
        console.log("Transactions for A:", histA.data?.length);
        console.table(histA.data?.map(t => ({ type: t.type, amount: t.amount, date: t.createdAt })));

    } catch (e) {
        console.error("Test Error:", e);
    }
}
test();
