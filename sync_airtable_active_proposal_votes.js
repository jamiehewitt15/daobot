const {getActiveProposals, updateProposalRecords, sumSnapshotVotesToAirtable} = require('./airtable_utils');
const {getProposalVotes} = require('./snapshot_utils');
const dotenv = require('dotenv');
dotenv.config();

var activeProposals = {}
var proposalVotes = {}
var proposalScores = {}
var proposalVoteSummary = {}

// DRY
const getActiveProposalVotes = async () => {
    activeProposals = await getActiveProposals()

    await Promise.all(activeProposals.map(async (proposal) => {
        try {
            const proposalId = proposal.get('Snapshot ID')
            await getProposalVotes(proposalId)
                .then((result) => {
                    proposalVotes[proposalId] = result.data
                })

            let scores = {}
            Object.entries(proposalVotes[proposalId]).reduce((total, cur) => {
                const choice = cur[1].msg.payload.choice
                scores[choice] = scores[choice] === undefined ? 0 : scores[choice] + 1
            }, {})

            proposalScores[proposalId] = scores
        } catch (err) {
            console.log(err)
        }
    }))
}

const main = async () => {
    await getActiveProposalVotes()
    proposalVoteSummary = await sumSnapshotVotesToAirtable(activeProposals, proposalScores)
    await updateProposalRecords(proposalVoteSummary)
    console.log('Updated Airtable')
}

main()
