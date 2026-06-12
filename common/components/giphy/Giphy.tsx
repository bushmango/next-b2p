import React, { useEffect, useMemo, useState } from 'react'
import classes from './Giphy.module.scss'
import { l } from '../../lib/lodash'
import { apiRequest } from '../../lib/request/apiRequest-sidecar'

type GiphyData = {
  title: string
  imageUrl: string
  sourceUrl?: string
}

type GiphyState = {
  tag: string
  data?: GiphyData
  error?: any
}

export const Giphy = (props: { tag: string }) => {
  let [state, setState] = useState<GiphyState | null>(null)
  let tag = useMemo(() => {
    let tags = l.split(props.tag, ',')
    return l.sample(tags) || ''
  }, [props.tag])

  useEffect(() => {
    let isCancelled = false

    apiRequest
      .post<GiphyData>('/api/giphy/random', { tag }, (requestState) => {
        if (isCancelled) {
          return
        }

        if (requestState.error) {
          setState({ tag, error: requestState.error })
        }

        if (requestState.isSuccess && requestState.response) {
          setState({ tag, data: requestState.response })
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setState({ tag, error })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [tag])

  let activeState = state && state.tag === tag ? state : null
  let data = activeState?.data

  if (activeState?.error) {
    return (
      <div>
        <div className={classes.giphy}>
          <div>GIF unavailable</div>
        </div>
      </div>
    )
  }

  let image = data ? (
    <img
      className={classes.giphyImg}
      src={data.imageUrl}
      title={data.title}
      alt={data.title}
    />
  ) : (
    <div className={classes.giphyImg} />
  )

  return (
    <div>
      <div className={classes.giphy}>
        <div style={{ visibility: data ? undefined : 'hidden' }}>
          {tag} - {data && data.title}
        </div>
        {data?.sourceUrl ? (
          <a href={data.sourceUrl} target='_blank' rel='noopener noreferrer'>
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    </div>
  )
}
