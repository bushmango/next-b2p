import React, { useEffect, useState } from 'react'
import giphyApi from 'giphy-api'
const giphy = giphyApi({ https: true })
import classes from './Giphy.module.scss'
import { l } from '../../lib/lodash'

export const Giphy = (props: { tag: string }) => {
  let [data, setData] = useState<any>(null)
  let [err, setErr] = useState<any>(null)
  let [tag, setTag] = useState<any>('')

  useEffect(() => {
    let tags = l.split(props.tag, ',')
    let tag = l.sample(tags) || ''
    setTag(tag)
    setErr(null)
    console.log('starting giphy')
    giphy
      .random({
        tag: tag,
        rating: 'pg',
        fmt: 'json',
      })
      .then((res: any) => {
        console.log('got giphy', res)
        if (res.meta.status === 429) {
          setErr('rate-limited')
        } else {
          setData(res.data)
        }
      })
      .catch((err) => {
        setErr(err)
      })
  }, [props.tag])

  if (err) {
    return (
      <div>
        <div className={classes.giphy}>
          Giphy error! Please wait for more gifs later
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={classes.giphy}>
        <div style={{ visibility: data ? undefined : 'hidden' }}>
          {tag} - {data && data.title}
        </div>
        <img
          style={{ visibility: data ? undefined : 'hidden' }}
          className={classes.giphyImg}
          src={
            data &&
            data.fixed_height_downsampled &&
            data.fixed_height_downsampled.url &&
            data.fixed_height_downsampled.url.replace('http:', 'https:')
          }
          title={data && data.title}
          alt={data && data.title}
        />
      </div>
    </div>
  )
}
