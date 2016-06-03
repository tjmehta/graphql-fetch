var afterEach = global.afterEach
var before = global.before
var beforeEach = global.beforeEach
var describe = global.describe
var it = global.it

var expect = require('code').expect
var sinon = require('sinon')
require('sinon-as-promised')

var graphqlUrl = 'http://host/graphql'
var graphqlFetch = require('../index.js')(graphqlUrl)

describe('graphql-fetch', function () {
  before(function () {
    expect(global.fetch).to.exist()
    expect(global.Headers).to.exist()
    expect(global.Response).to.exist()
    expect(global.Request).to.exist()
  })
  beforeEach(function () {
    this.json = {}
    this.result = {
      json: sinon.stub().returns(this.json)
    }
    sinon.stub(global, 'fetch').resolves(this.result)
    this.query = "query { user { username } }"
    this.vars = { foo: 1 }
    this.headers = new Headers()
    this.headers.append('authorization', 'token abcdef')
    this.headers.append('content-type', 'text/html')
    this.opts = {
      credentials: true,
      headers: this.headers
    }
  })
  afterEach(function () {
    global.fetch.restore()
  })

  it('should make a graphql request', function () {
    var self = this
    return graphqlFetch(this.query).then(function (result) {
      sinon.assert.calledOnce(global.fetch)
      sinon.assert.calledWith(global.fetch, graphqlUrl, sinon.match(assertOpts))
      sinon.assert.calledOnce(self.result.json)
      expect(result).to.equal(self.json)
      function assertOpts (opts) {
        expect(opts.body).to.equal(JSON.stringify({
          query: self.query,
          variables: {}
        }))
        expect(opts.method).to.equal('POST')
        expect(opts.headers).to.be.an.instanceOf(Headers)
        expect(opts.headers.get('content-type')).to.equal('application/json')
        return true
      }
    })
  })
  it('should make a graphql request w/ vars and fetch options', function () {
    var self = this
    return graphqlFetch(this.query, this.vars, this.opts).then(function (result) {
      sinon.assert.calledOnce(global.fetch)
      sinon.assert.calledWith(global.fetch, graphqlUrl, sinon.match(assertOpts))
      sinon.assert.calledOnce(self.result.json)
      expect(result).to.equal(self.json)
      function assertOpts (opts) {
        expect(opts.body).to.equal(JSON.stringify({
          query: self.query,
          variables: self.vars
        }))
        expect(opts.method).to.equal('POST')
        expect(opts.headers).to.equal(self.headers)
        expect(opts.headers.get('content-type')).to.equal('text/html')
        return true
      }
    })
  })
})