'use strict'
require('isomorphic-fetch') // injects globals: fetch, Headers, Request, Response

var assert = require('assert')
var defaults = require('101/defaults')

/**
 * create a graphql-fetch bound to a specific graphql url
 * @param  {String} graphqlUrl
 * @return {Function} graphqlFetch
 */
module.exports = function factory (graphqlUrl) {
  /**
   * graphql fetch - fetch w/ smart defaults for graphql requests
   * @param  {Query} query graphql query
   * @param  {Object} vars  graphql query args
   * @param  {Object} opts  fetch options
   * @param  {String} operationName  graphql operation name
   * @return {FetchPromise} fetch promise
   */
  return function graphqlFetch (query, vars, opts, operationName) {
    assert(query, 'query is required')
    opts = opts || {}
    var body = {
      query: query
    }
    if (vars) {
      body.variables = vars
    }
    if (operationName) {
      body.operationName = operationName
    }
    opts.body = JSON.stringify(body)
    // default opts
    defaults(opts, {
      method: 'POST',
      headers: new Headers()
    })
    // default headers
    var headers = opts.headers
    if (!headers.get('content-type')) {
      opts.headers.append('content-type', 'application/json')
    }
    return fetch(graphqlUrl, opts).then(function (res) {
      return res.json()
    })
  }
}
