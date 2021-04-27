const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const {getActiveProposals} = require('./airtable_utils');
const {initOAuthToken} = require('./gsheets')
const {getProposalData, addSheetsGranular, updateValues} = require('./gsheets_utils')
const {getProposalVotes, sumProposalVotes} = require('./snapshot_utils');

var activeProposals = {}
var proposalVotes = {}
var proposalScores = {}
var proposalVoteSummary = {}

const updateGSheets = async (snapshotId) => {
    const oAuth = await initOAuthToken()

    var proposal = await getProposalData(oAuth, snapshotId, 'A1:B3')
    var proposalSummary = await getProposalData(oAuth, snapshotId+'_SG', 'A1:B3')

    if (proposal === undefined) {
        var newSheets = await addSheetsGranular(oAuth, 'afssadfas')
        console.log(newSheets)

        proposal = newSheets.data.replies[0].addSheet.properties
        proposalSummary = newSheets.data.replies[1].addSheet.properties
    }

    // JS object to dataframe
    var flatObj = Object.entries(proposalVotes[snapshotId]).map((p) => {
        try {
            const signature = p[1]
            return [
                signature.address,
                signature.msg.payload.choice,
                //balance
                signature.msg.timestamp,
                signature.msg.version,
                signature.authorIpfsHash,
                signature.relayerIpfsHash
            ]
        } catch(err) {
            console.log(err)
        }
    })
    flatObj.splice(0,0, ['address','choice','timestamp','version','authorIpfsHash','relayIpfsHash'])
    await updateValues(oAuth, snapshotId, 'A1:F'+flatObj.length, flatObj)

    // JS object to dataframe
    // flattenedObj = Object.entries(proposalVoteSummary[snapshotId]).map((p) => {
    //     try {
    //         const signature = p[1]
    //         return {
    //             address: signature.address,
    //             choice: signature.msg.payload.choice,
    //             //balance
    //             timestamp: signature.msg.timestamp,
    //             version: signature.msg.version,
    //             authorIpfsHash: signature.authorIpfsHash,
    //             relayerIpfsHash: signature.relayerIpfsHash
    //         }
    //     } catch(err) {
    //         console.log(err)
    //     }
    // })
    // df = getDataFrame(proposalVoteSummary)
    // await updateValues(oAuth, snapshotId+'SummaryGranular', 'A1:B10', df)
}

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
    // Retrieve all active proposals from Airtable
    await getActiveProposalVotes()
    proposalVoteSummary = await sumProposalVotes(activeProposals, proposalScores)

    // If we're reading from multiple proposals, we're going to write each of them out
    Object.entries(proposalVotes).map(async (p) => {
        await updateGSheets(p[0])
    })
    console.log('Updated GSheets')
}

main()
