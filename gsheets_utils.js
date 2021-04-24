const {google} = require('googleapis');

// AUTOMATED
// EVENTS
// Snapshot -> Raw Data -> New Sheet (title: ProposalId)
// Duplicate SummaryGranular (title: ProposalIdSummaryGranular) ->

// MANUAL (@ BEGIN ROUND)
// Duplicate RegistryGranular (title: Round5Registry)
// duplicateRoundRegistry() -- new proposal
// updateRoundRegistry() -- new proposal

// FUNCTIONS
// UpdateSheetCells w/ Functions
// UpdateSheetCells w/ Data
// DuplicateSheetRequest({sourceSheetId:'GranularSummary', insertSheetIndex:0, newSheetName:proposal.snapshotId+'Summary'})
// AddSheetRequest({title:proposal.snapshotId})

const spreadsheet = '1e4xb6m-aKcBhwob_p7ereSFneXFPpDjUbSjz13smmHI'

async function processRequests(oAuth, requests) {
    const sheets = google.sheets({version: 'v4', auth: oAuth});
    const batchUpdateRequest = {requests};
    try {
        const res = await sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheet,
            resource: batchUpdateRequest,
        })

        return res.replies
    } catch(err) {
        console.log('The API returned an error: ' + err);
    }
}

const initGranularProposal = async (oAuth, snapshotId) => {
    let requests = []
    requests.push({
        addSheetRequest: {
            title: snapshotId,
            index: 0,
        }
    })
    requests.push({
        duplicateSheet: {
            sourceSheetId: 'SummaryGranular',
            insertSheetIndex: 1,
            newSheetName: snapshotId+'SummaryGranular',
        }
    })
    return await processRequests(oAuth, requests)
}

const dumpProposalToSheet = async (oAuth, snapshotId, votes) => {

}

const getProposalData = async (oAuth, snapshotId, range) => {
    const sheets = google.sheets({version: 'v4', auth: oAuth});
    try {
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheet,
            range: snapshotId + '!' + range
        })

        return res.data.values
    } catch(err) {
        console.log('The API returned an error: ' + err);
    }
}

module.exports = {getProposalData, initGranularProposal, dumpProposalToSheet};
