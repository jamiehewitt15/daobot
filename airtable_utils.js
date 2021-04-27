const fetch = require('node-fetch')
const dotenv = require('dotenv');
dotenv.config();

const AIRTABLE_BASEID =  'appVer8ccYGnqSm2H'
const base = require('airtable').base(AIRTABLE_BASEID)

const splitArr = (arr, chunk) => {
    let arrSplit = []
    for (i=0; i < arr.length; i += chunk) {
        arrSplit.push(arr.slice(i, i + chunk))
    }
    return arrSplit
}

const getActiveProposals = async () => {
    try {
        var proposals = await base('Proposals').select({
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

        return proposals
    } catch(err) {
        console.log(err)
    }
}

const updateProposalRecords = async (records) => {
    const splitReocrds = splitArr(records, 10)
    await Promise.all(splitReocrds.map(batch =>
        fetch(`https://api.airtable.com/v0/${AIRTABLE_BASEID}/Proposals`, {
            method: "patch", // make sure it is a "PATCH request"
            headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`, // API key
                "Content-Type": "application/json",
            },
            body: JSON.stringify({records: batch}),
        })
        .then((res) => {
            console.log('Response from Airtable: ', res.status)
        })
        .catch((err) => {
            console.log(err);
        })
    ))
}

module.exports = {getActiveProposals, updateProposalRecords}
