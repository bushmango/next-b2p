import React, { useRef } from 'react'

import css from '../People.module.scss'
import { IStateB2P } from '../sosB2P'
import { Card } from '../../../common/components/card/Card-sidecar'
import { Loader } from '../../../common/components/loader/Loader-sidecar'
import { Input } from '../../../common/components/input/Input-sidecar'
import { sosB2P } from '../sosB2P-sidecar'
import l from 'lodash'

export const BookSearchResults = (props: {
  state: IStateB2P
  onSelectBook: (book: any) => void
}) => {
  let { state } = props
  let refBookSearch = useRef<any>(null)

  return (
    <Card title='Book search' minWidth='430px'>
      <div>
        <Loader isLoading={state.requestBookSearch.isFetching} />

        <Input
          ref={refBookSearch}
          value={state.bookSearchText}
          onChange={(newVal) => sosB2P.updateBookSearchText(newVal)}
        />

        {state.requestBookSearch.response &&
          !state.requestBookSearch.isFetching &&
          state.bookSearchText === state.requestBookSearch.params && (
            <div>
              {l.map(state.requestBookSearch.response?.data, (c, cIdx) => {
                return (
                  <div
                    key={cIdx}
                    className={css.bookSearchResult}
                    onClick={() => {
                      props.onSelectBook(c)
                      refBookSearch.current.focus()
                    }}
                  >
                    <div>
                      <div>
                        {c.title} {c.subtitle && ' - '} {c.subtitle}
                      </div>
                      <div>by {l.join(c.authors, ', ')}</div>
                    </div>
                    <div>
                      <img
                        className={css.bookSearchThumbnail}
                        src={c.thumbnail}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </Card>
  )
}
