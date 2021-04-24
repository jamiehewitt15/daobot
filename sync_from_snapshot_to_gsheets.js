const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const {initOAuthToken} = require('./gsheets')
const {getProposalData, initGranularProposal} = require('./gsheets_utils')

// async function main() {
const main = async () => {
    // await getProposals()
    const oAuth = await initOAuthToken()

    var proposalSheet = await getProposalData(oAuth, 'QmYdPQ59SBTV5MbyQZ2AGrEWYBe2jaqDhydM9xWhz6LAsX', 'A1:D5')
    console.log(proposalSheet)

    var initProposalResponse = await initGranularProposal(oAuth, 'QmYdPQ59SBTV5MbyQZ2AGrEWYBe2jaqDhydM9xWhz6LAsX')
    console.log(initProposalResponse)
}

main()
