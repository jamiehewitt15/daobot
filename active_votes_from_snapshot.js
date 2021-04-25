// connect with airtable
// get all proposals
// fetch votes from snapshot active proposals
// submit votes from snapshot to the correct gsheet
const dotenv = require('dotenv');
const axios = require("axios");
dotenv.config();

const base = require('airtable').base('appVer8ccYGnqSm2H')
var proposals = []

const getActiveProposals = async() => {
    proposals = await base('Proposals').select({
        // Selecting the first 3 records in Proposals:
        view: "Proposals",
        filterByFormula: 'IF({Voting State} = "Active", "true")'
    }).firstPage()

    proposals.forEach( (p)=> {
        var snapshotURL = p.get('Snapshot URL')
        var snapshotSplit = snapshotURL.split('/')
        var snapshotId = snapshotSplit[snapshotSplit.length - 1]
        p.set('Snapshot ID', snapshotId)
    })
}

var proposalVotes = {}
const fetchVotes = async (proposalId) => {
    const proposalUrl = 'https://hub.snapshot.page/api/officialoceandao.eth/proposal/' + proposalId
    await axios.get(proposalUrl)
        .then(res => {
            proposalVotes[proposalId] = res
        });
}

const getVotes = async () => {
    proposals.forEach(async (p) => {
        const snapshotId = p.get('Snapshot ID')
        await fetchVotes(snapshotId)
    })
}

const main = async () => {
    // await getProposals()
    await getActiveProposals()
    await getVotes()
}

main()
