const { yourconfig } = require('./yourconfig')

module.exports = Object.assign({}, yourconfig, {
  base_url: 'https://s3.eu-central-1.amazonaws.com/balibart-s3',
})
