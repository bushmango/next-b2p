import { NextApiRequest, NextApiResponse } from 'next'
import { postAnonJson } from './lib/apiUtil'

type GiphyRandomResponse = {
  data?: {
    title?: string
    url?: string
    images?: {
      fixed_height_downsampled?: {
        url?: string
      }
      fixed_height?: {
        url?: string
      }
      original?: {
        url?: string
      }
    }
  }
  meta?: {
    status?: number
    msg?: string
  }
}

function getImageUrl(response: GiphyRandomResponse): string {
  return (
    response.data?.images?.fixed_height_downsampled?.url ||
    response.data?.images?.fixed_height?.url ||
    response.data?.images?.original?.url ||
    ''
  ).replace('http:', 'https:')
}

export async function random(req: NextApiRequest, res: NextApiResponse) {
  return postAnonJson(req, res, async (req) => {
    const apiKey = process.env.GIPHY_KEY
    if (!apiKey) {
      return { error: 'missing-giphy-key' }
    }

    const tag = (req.body.tag || '').toString().slice(0, 50)
    const url = new URL('https://api.giphy.com/v1/gifs/random')
    url.searchParams.set('api_key', apiKey)
    url.searchParams.set('rating', 'pg')
    if (tag) {
      url.searchParams.set('tag', tag)
    }

    const response = await fetch(url)
    const giphyResponse = (await response.json()) as GiphyRandomResponse
    const status = giphyResponse.meta?.status || response.status

    if (status === 429) {
      return { error: 'giphy-rate-limited' }
    }

    if (!response.ok || status !== 200) {
      return {
        error: 'giphy-request-failed',
        status,
        message: giphyResponse.meta?.msg,
      }
    }

    const imageUrl = getImageUrl(giphyResponse)
    if (!imageUrl) {
      return { error: 'giphy-empty-response' }
    }

    return {
      tag,
      title: giphyResponse.data?.title || '',
      imageUrl,
      sourceUrl: giphyResponse.data?.url || '',
    }
  })
}
