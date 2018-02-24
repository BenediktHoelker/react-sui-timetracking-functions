// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const functions = require('firebase-functions');
const _ = require('lodash');
const request = require('request-promise');

exports.indexRecordsToElastic = functions.database.ref('/records/srpBkv4JX2WhxRZBXJGiRpjjIQx2/{recordId}')
    .onWrite(event => {
        let recordData = event.data.val();
        let recordId = event.params.recordId;

        console.log('Indexing record ', recordId, recordData);

        let elasticsearchFields = ['activity', 'date', 'description', 'project', 'subProject', 'task',
            'timeEnd', 'timeStart', 'timeSpent'];
        let elasticSearchConfig = functions.config().elasticsearch;
        let elasticSearchUrl = elasticSearchConfig.url + 'records/record/' + recordId;
        let elasticSearchMethod = recordData ? 'POST' : 'DELETE';

        let elasticsearchRequest = {
            method: elasticSearchMethod,
            uri: elasticSearchUrl,
            auth: {
                username: elasticSearchConfig.username,
                password: elasticSearchConfig.password,
            },
            body: _.pick(recordData, elasticsearchFields),
            json: true
        };

        return request(elasticsearchRequest).then(response => {
            console.log('Elasticsearch response', response);
        })

    });
