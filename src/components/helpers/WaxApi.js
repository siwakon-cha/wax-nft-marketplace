

export const getBoostAction = (activeUser) => {
    const userName = activeUser['accountName'];

    return {
        account: 'nft.hive',
        name: 'boost',
        authorization: [{
            actor: userName,
            permission: activeUser['requestPermission'],
        }],
        data: {
            booster: userName
        },
    }
}

export const swapTransaction = async (activeUser, standard, data) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [getBoostAction(activeUser),{
            account: standard === 'atomicassets' ? standard : 'simpleassets',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: data
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
}

export const stakeAtomicAssets = async (activeUser, assetIds) => {
    const userName = activeUser['accountName'];

    await activeUser.signTransaction({
        actions: [getBoostAction(activeUser),{
            account: 'atomicassets',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                memo: 'stake',
                asset_ids: assetIds,
                to: 's.rplanet',
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
}

export const stakeSimpleAssets = async (activeUser, assetIds) => {
    const userName = activeUser['accountName'];

    return await activeUser.signTransaction({
        actions: [getBoostAction(activeUser),{
            account: 'simpleassets',
            name: 'transfer',
            authorization: [{
                actor: userName,
                permission: activeUser['requestPermission'],
            }],
            data: {
                from: userName,
                to: 's.rplanet',
                assetids: assetIds,
                memo: 'stake'
            },
        }]
    }, {
        expireSeconds: 300, blocksBehind: 0,
    });
}