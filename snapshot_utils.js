const axios = require('axios');

const getProposalVotes = async (proposalId) => {
    const proposalUrl = 'https://hub.snapshot.page/api/officialoceandao.eth/proposal/' + proposalId
    return await axios.get(proposalUrl)
}

module.exports = {getProposalVotes}
