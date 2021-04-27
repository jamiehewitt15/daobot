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

const processRequests = async (oAuth, requests) => {
    const sheets = google.sheets({version: 'v4', auth: oAuth});
    const batchUpdateRequest = {requests};
    try {
        return await sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheet,
            resource: batchUpdateRequest,
        })
    } catch(err) {
        console.log('[processRequests] The API returned an error: ' + err);
        return undefined
    }
}

const addSheetsGranular = async (oAuth, sheetName) => {
    let requests = []
    requests.push({
        addSheet: {
            properties: {
                title: sheetName,
                index: 0,
            }
        }
    })
    // requests.push({
    //     addSheet: {
    //         properties: {
    //             title: sheetName+'_SG',
    //             index: 1,
    //         }
    //     }
    // })
    return processRequests(oAuth, requests)
}

const sumSnapshotVotesToGSheets = async (proposals, scores) => {
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
                    'Voted Yes': yesVotes,
                    'Voted No': noVotes
                }
            }
        )
    });
    return records
}

const updateValues = async (oAuth, sheetId, range, values) => {
    const sheets = google.sheets({version: 'v4', auth: oAuth});
    try {
        return await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheet,
            range: sheetId + '!' + range,
            valueInputOption: "RAW",
            resource: {
                values: values,
            }
        })
    } catch (err) {
        console.log('[updateValues] The API returned an error: ' + err);
        return undefined
    }
}

const getProposalData = async (oAuth, snapshotId, range) => {
    const sheets = google.sheets({version: 'v4', auth: oAuth});
    try {
        return await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheet,
            range: snapshotId + '!' + range
        })
    } catch(err) {
        console.log('[getProposalData] The API returned an error: ' + err);
        return undefined
    }
}

module.exports = {getProposalData, addSheetsGranular, sumSnapshotVotesToGSheets, updateValues};
