import React from 'react'
import { Card } from '../../../common/components/card/Card-sidecar'
import { Input } from '../../../common/components/input/Input-sidecar'
import { Spacer } from '../../spacer/Spacer'
import { IStateB2P } from '../sosB2P'
import { sosB2P } from '../sosB2P-sidecar'
import { fields } from './peopleFields'
import { l } from '../../../common/lib/lodash'

export const EditPersonDetails = (props: { state: IStateB2P }) => {
  let { state } = props
  return (
    <Card title='Person details' minHeight='331px'>
      <Spacer />
      <Spacer />
      <table>
        <tbody>
          {l.map(fields, (c) => {
            return (
              <tr key={c.field}>
                <th>{c.label || c.field}</th>
                <td style={{ minWidth: '300px' }}>
                  {c.readonly ? (
                    <div>{state.editPerson.json[c.field]}</div>
                  ) : (
                    <Input
                      value={state.editPerson.json[c.field]}
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
