# graphql-fetch [![Build Status](https://travis-ci.org/tjmehta/graphql-fetch.svg?branch=master)](https://travis-ci.org/tjmehta/graphql-fetch) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
Thin GraphQL client powered by fetch.

# Installation
```bash
npm i --save graphql-fetch
```

# Usage
```js
var fetch = require('graphql-fetch')('http://domain.com/graphql')

var query = `
  query q (id: String!) {
    user(id: $id) {
      id,
      email,
      name
    }
  }
`
var queryVars = {
  id: 'abcdef'
}
var opts = {
  // custom fetch options
}

/**
 * @param  {Query} query graphql query
 * @param  {Object} [vars]  graphql query args, optional
 * @param  {Object} [opts]  fetch options, optional
 */
fetch(query, queryVars, opts).then(function (results) {
  if (results.errors) {
    //...
    return
  }
  var user = result.data.user
  //...
})
```

# Notes
* Uses [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) under the hood, which makes `fetch`, `Headers`, `Request`, and `Response` globally available.

# License
MIT