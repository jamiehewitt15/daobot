const {infuraWeb3Provider} = require('./src/functions/web3.js')
import {client} from './src/helpers/client.ts'

const pk = process.env.ETH_PRIVATE_KEY || 'your_key_here';
const space = 'officialoceandao.eth'

const main = async () => {
    const account = infuraWeb3Provider.eth.accounts.privateKeyToAccount(pk)

    const payload = {
        name: 'Programmatic Prosal!',
        body: 'Body is ready.',
        choices: ["Yes", "No"],
        start: '1619766001',
        end: '1619848801',
        snapshot: '10484400',
        metadata: {}
    }

    const result = await client.broadcast(
        infuraWeb3Provider,
        account,
        space,
        'proposal',
        payload
    )
}

main()
