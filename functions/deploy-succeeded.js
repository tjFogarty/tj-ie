const SparkPost = require('sparkpost');
const Handlebars = require('handlebars');
const fetch = require('node-fetch');
const fs = require('fs');

const client = new SparkPost(process.env.SPARKPOST_KEY);
const pageSpeedEndpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
const query = `${pageSpeedEndpoint}?url=${encodeURIComponent('https://tj.ie')}`;
const emailTemplate = fs.readFileSync('../pagespeed/email-template.hbs').toString();

exports.handler = function (event, context, callback) {
  fetch(query)
    .then(response => response.json())
    .then(json => {
      const lighthouse = json.lighthouseResult;
      const template = Handlebars.compile(emailTemplate);
      const auditResults = [{
          label: 'First Contentful Paint',
          value: lighthouse.audits['first-contentful-paint'].displayValue,
        },
        {
          label: 'Speed Index',
          value: lighthouse.audits['speed-index'].displayValue,
        },
        {
          label: 'Interactive',
          value: lighthouse.audits['interactive'].displayValue,
        },
        {
          label: 'First Meaningful Paint',
          value: lighthouse.audits['first-meaningful-paint'].displayValue,
        },
        {
          label: 'First CPU Idle',
          value: lighthouse.audits['first-cpu-idle'].displayValue,
        },
        {
          label: 'Estimated Input Latency',
          value: lighthouse.audits['estimated-input-latency'].displayValue,
        }
      ];

      client.transmissions.send({
        content: {
          from: 'contact@tj.ie',
          subject: 'PageSpeed Report for TJ.ie',
          html: template({ data: auditResults }),
        },
        recipients: [{
          address: 'fogarty.tj@gmail.com'
        }],
      }).then((data) => {
        console.log(data)
        callback(null, { statusCode: 200 });
      }).catch(err => {
        console.log(err);
      })
    })
}

