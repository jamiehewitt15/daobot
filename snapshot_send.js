import { Web3Provider } from '@ethersproject/providers';
const infuraWeb3Provider = require('/src/functions/web3')
const {getBlockNumber} = require('@snapshot-labs/snapshot.js/src/utils/web3')
const {getProvider} = require('@snapshot-labs/snapshot.js/src/utils/provider')
const {client} = require('@/helpers/client')

const space = 'officialoceandao.eth'
const strategies = [
    {
        "name": "erc20-balance-of",
        "params": {
            "address": "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
            "symbol": "OCEAN",
            "decimals": 18
        }
    },
    {
        "name": "ocean-marketplace",
        "params": {
            "address": "0x967da4048cD07aB37855c090aAF366e4ce1b9F48",
            "symbol": "OCEAN",
            "decimals": 18
        }
    }
]
const network = '1';
const provider = infura
const voters = [
    "0xb098A3EDD6224E774b5B19C2F69728FDC69bc7bC"
]

var auth = null

const loginWeb3Provider = async() => {
    auth = getInstance()
    commit('SET', { authLoading: true })
    await auth.login(connector)
    if (auth.provider.value) {
        auth.web3 = new Web3Provider(auth.provider.value)
        await dispatch('loadProvider')
    }
}

const broadcastProposal = async (payload) => {
    const auth = getInstance();
    try {
        const result = await client.broadcast(
            auth.web3,
            rootState.web3.account,
            space,
            'proposal',
            payload
        )
        console.log(result)
        return result
    } catch (e) {
        const errorMessage =
            e && e.error_description
                ? `Oops, ${e.error_description}`
                : i18n.global.t('notify.somethingWentWrong')
        console.log(errorMessage)
        return null
    }
}

const submitProposalsToSnapshot = async(proposals) => {
    // proposals.map((p) => {
    const payload = {
        name: 'Proposal Name!', //p.get('Name'),
        body: 'Proposal Body', //p.get('Body'),
        choices: ["Yes", "No"],
        start: '1595088000',
        end: '1595174400',
        snapshot: '10484400',
        metadata: {}
    }
    await broadcastProposal(payload)
    // })
}

const main = async () => {
    await submitProposalsToSnapshot()
}

main()
