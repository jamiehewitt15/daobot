const {infuraWeb3Provider} = require('./src/functions/web3')

const pk = process.env.ETH_PRIVATE_KEY || 'your_key_here';

const main = async () => {
    const account = infuraWeb3Provider.eth.accounts.privateKeyToAccount(pk)
    console.log(account)
}

main()
