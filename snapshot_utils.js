const axios = require('axios');

const getProposalVotes = async (proposalId) => {
    const proposalUrl = 'https://hub.snapshot.page/api/officialoceandao.eth/proposal/' + proposalId
    return await axios.get(proposalUrl)
}

// TODO - Batch & Granular Summing
const sumProposalVotes = async (proposals, scores) => {
    let records = []
    proposals.map((p) => {
        const batchIndex = p.get('Snapshot Batch Index')
        const snapshotId = p.get('Snapshot ID')

        const yesIndex = batchIndex === undefined ? 1 : batchIndex
        const noIndex = batchIndex === undefined ? 2 : undefined

        const yesVotes = scores[snapshotId][yesIndex]
        const noVotes = noIndex === undefined ? 0 : scores[snapshotId][noIndex]

        records.push(
            {
                id: p.id,
                fields: {
                    "Voted Yes": yesVotes,
                    "Voted No": noVotes
                }
            }
        )
    });
    return records
}

module.exports = {getProposalVotes, sumProposalVotes}
