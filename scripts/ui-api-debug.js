(async function() {
  const base = 'http://localhost:3000';
  const logBody = async (res) => {
    const text = await res.text().catch(() => '');
    try { return JSON.parse(text); } catch { return text || null; }
  };

  try {
    console.log('GET /api/transactions');
    let r = await fetch(base + '/api/transactions');
    console.log('status', r.status);
    console.log(await logBody(r));

    console.log('\nGET /api/categories');
    r = await fetch(base + '/api/categories');
    console.log('status', r.status);
    console.log(await logBody(r));

    console.log('\nPOST /api/transactions (create sample)');
    const payload = {
      amount: 100.5,
      type: 'INCOME',
      description: 'Test transaction from ui-api-debug',
      categoryName: 'AutoCreatedCategory',
      accountName: 'Default',
      userEmail: `debug_${Date.now()}@local.invalid`,
      performedBy: 'debugger'
    };
    r = await fetch(base + '/api/transactions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    console.log('status', r.status);
    const created = await logBody(r);
    console.log('body', created);

    let createdId = created && created.id ? created.id : null;

    if (createdId) {
      console.log('\nPUT /api/transactions (update description)');
      r = await fetch(base + '/api/transactions', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: createdId, description: 'Updated by ui-api-debug' }) });
      console.log('status', r.status);
      console.log(await logBody(r));

      console.log('\nDELETE /api/transactions (remove test record)');
      r = await fetch(base + '/api/transactions', { method: 'DELETE', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: createdId }) });
      console.log('status', r.status);
      console.log(await logBody(r));
    } else {
      console.log('\nNo created id to update/delete.');
    }

    console.log('\nDone.');
    process.exit(0);
  } catch (err) {
    console.error('Error during UI API debug:', err);
    process.exit(1);
  }
})();
