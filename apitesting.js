ApiPromise
    .create({ provider: wsProvider }).isReady
    .then((api) =>
        console.log(api.genesisHash.toHex())
    );
    

    // the length of an epoch (session) in Babe
    console.log(api.consts.babe.epochDuration.toNumber());

    const ADDR = '5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE';

    // Retrieve the last timestamp
    const now = await api.query.timestamp.now();

    // Retrieve the account balance and nonce via the system module

    const { nonce, data: balance } = await api.query.system.account(ADDR);

    console.log('${now}: balance of ${balance.free} and a nonce of ${nonce}');


    // Retrieve last block timestamp, account nonce & balances
    const [now, {nonce, data:balance}] = await Promise.all([
        api.query.timestamp.now(),
        api.query.system.account(ADDR),
    ]);

    // Retrieve the chain name
    const chain  = await api.rpc.system.chain();

    // Retrieve the latest header
    const lastHeader = await api.rpc.chain.getheader();

    // log the information
    console.log('${chain}: last block: ${lastHeader.number} has hash ${lastHeader.hash}');

    // Subscribe to the new headers
    await api.rpc.chain.subscribeNewHeads((lastHeader) => {
        console.log('${chain}: recent block: ${lastHeader.number}')

    });

    // lets say we want to log the last 10 headers only
    let count = 0;

    const unsubHeads = await.rpc.api.chain.subscribeNewHeads((lastHeader) => {
        console.log('${chain}: last block: ${lastheader.number} has hash ${lastHeader.hash}')

        if (++count == 10) {
            unsubHeads();
        }
    });


    // Retrieve the current timestamp via subscription
    const unsub = await api.query.timestamp.now((moment) => {
        console.log('The last block has a timestamp of ${moment}');
    });

    const unsub = await api.query.system.account(ADDR, ({nonce, data: balance}) => {
        console.log('free balance: ${balance.free} with ${balance.reserved} and a nonce of ${nonce}');
    });

    const unsub = await api.query.system.account.multi([ADDR1, ADDR2], (balances) => {
        const [{data: balance1}, {data: balance2}] = balances;
    });

    // Map keys and entries (Retrieve the active era and all exposures of the era)
    const activeEra = await api.query.staking.activeEra();

    const exposures = await api.query.staking.eraStakers.entries(activeEra.index);

    exposures.array.forEach(([key, exposure]) => {
        console.log('key arguments:', key.args.map((k) => k.toHuman()));
        console.log('  exposure:', exposure.toHuman());
    });

    import {Keyring} from '@polkadot/api';
    // initialize the API as we would normally do
    // Create a keyring instance
    const keyring = new Keyring( { type: 'sr25519' });

    const alice = keyring.addFromUri('//Alice');

    // make a transfer from Alice to bob, waiting for inclusion
    const unsub = await api.tx.balances.transfer(BOB, 12345).signAndSend(alice, (result) => {
        console.log('current status is: ${result.status}');

        if (result.status.isInBlock) {
            console.log('Transaction included at Blockhash $(result.status.asInBlock}');
        }else if (result.status.isFinalized) {
            console.log('Transaction finalized at block hash ${result.status.asFinalized}');
        
        unsub();
        }
    });