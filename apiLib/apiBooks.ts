import { apiRegister } from './api-sidecar'
import { postJson } from './lib/apiUtil'

const books = require('google-books-search')

export function install() {
  apiRegister('/books/search', async (req, res) => {
    return postJson(req, res, async (req, user) => {
      const { search } = req.body

      console.log('serach for', search, process.env.APIKEY_GOOGLEBOOKS)

      let options = {
        key: process.env.APIKEY_GOOGLEBOOKS,
        limit: 5,
        type: 'books',
        order: 'relevance',
        lang: 'en',
      }

      let results = await new Promise((resolve, reject) => {
        books.search(
          search,
          options,
          (err: any, results: any, apiResponse: any) => {
            console.log('ret', search, err, results)
            if (err) {
              reject(err)
            } else {
              resolve(results)
            }
          },
        )
      })

      return { isSuccess: true, data: results }
    })
  })
}
