import React from 'react'
import { DateTime } from 'luxon'
import { Card } from '../../../common/components/card/Card'
import { Input } from '../../../common/components/input/Input'
import { l } from '../../../common/lib/lodash'
import { IStateB2P } from '../sosB2P'
import { sosB2P } from '../sosB2P-sidecar'
import css from './EditPersonDetails.module.scss'
import { fields } from './peopleFields'

const SaveIndicator = (props: { state: IStateB2P }) => {
  const { requestSetPerson } = props.state

  if (requestSetPerson.isFetching) {
    return <span className={css.saveIndicator}>Saving...</span>
  }
  if (requestSetPerson.error) {
    return (
      <span className={`${css.saveIndicator} ${css.saveError}`}>
        Error saving
      </span>
    )
  }
  if (requestSetPerson.isSuccess && requestSetPerson.endTime) {
    const savedAt = DateTime.fromISO(requestSetPerson.endTime)
    const savedAtLabel = savedAt.isValid
      ? savedAt.toFormat('h:mm:ss a')
      : requestSetPerson.endTime

    return <span className={css.saveIndicator}>Saved {savedAtLabel}</span>
  }

  return null
}

export const EditPersonDetails = (props: { state: IStateB2P }) => {
  let { state } = props
  return (
    <Card
      title={
        <div className={css.titleLayout}>
          <span>Person details</span>
          <SaveIndicator state={state} />
        </div>
      }
      minHeight='331px'
      minWidth='460px'
    >
      {/* <Spacer /> */}
      {/* <Spacer /> */}
      <table>
        <tbody>
          {l.map(fields, (c) => {
            const headerClassName = c.multiline
              ? `${css.header} ${css.headerTop}`
              : css.header

            return (
              <tr key={c.field}>
                <th className={headerClassName}>{c.label || c.field}</th>
                <td style={{ minWidth: '300px' }}>
                  {c.readonly ? (
                    <div>{state.editPerson.json[c.field]}</div>
                  ) : (
                    <Input
                      value={state.editPerson.json[c.field] || ''}
                      multiline={c.multiline}
                      onChange={(newVal) => {
                        sosB2P.updateEditPerson({ [c.field]: newVal })
                      }}
                    />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Card>
  )
}
