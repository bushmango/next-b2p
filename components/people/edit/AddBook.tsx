import l from 'lodash'
import React, { useRef } from 'react'
import { Button } from '../../../common/components/button/Button-sidecar'
import { Card } from '../../../common/components/card/Card-sidecar'
import { Icon, solidIcons } from '../../../common/components/icon/Icon-sidecar'
import { Input } from '../../../common/components/input/Input-sidecar'
import { LinkButton } from '../../../common/components/link-button/LinkButton-sidecar'
import { IStateB2P, quickPrices } from '../sosB2P'
import { sosB2P } from '../sosB2P-sidecar'
import css from '../People.module.scss'

export const AddABook = (props: { state: IStateB2P }) => {
  let { state } = props

  let refTitle = useRef<any>(null)
  let refAuthor = useRef<any>(null)
  let refPrice = useRef<any>(null)

  return (
    <Card title='Add a book' minWidth='430px'>
      <table>
        <tbody>
          <tr>
            <td>Title</td>
            <td>
              <Input
                ref={refTitle}
                value={state.editNewBook.Name}
                onEnter={() => {
                  refPrice.current.focus()
                }}
                onChange={(newVal) => {
                  sosB2P.updateEditNewBook({ Name: newVal })
                  sosB2P.updateBookSearchText(newVal)
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Author</td>
            <td>
              <Input
                ref={refAuthor}
                autofocus
                value={state.editNewBook.Author}
                onEnter={() => {
                  refTitle.current.focus()
                }}
                onChange={(newVal) => {
                  sosB2P.updateEditNewBook({ Author: newVal })
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Price</td>
            <td>
              <Input
                ref={refPrice}
                value={state.editNewBook.Price}
                onEnter={() => {
                  sosB2P.addBookToTodaysPackage()
                  refTitle.current.focus()
                }}
                onChange={(newVal) => {
                  sosB2P.updateEditNewBook({ Price: newVal })
                }}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div className={css.quickPriceLayout}>
                {l.map(quickPrices, (c) => (
                  <div key={c} className={css.quickPriceItem}>
                    <LinkButton
                      onClick={() => {
                        sosB2P.updateEditNewBook({ Price: c })
                      }}
                    >
                      {c}
                    </LinkButton>
                  </div>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <Button
        onClick={() => {
          sosB2P.addBookToTodaysPackage()
          refTitle.current.focus()
        }}
      >
        <Icon icon={solidIcons.faPlus} /> Add it to today's package
      </Button>
    </Card>
  )
}
