import l from 'lodash'
import React from 'react'
import { Card } from '../../../common/components/card/Card-sidecar'
import { Input } from '../../../common/components/input/Input-sidecar'
import { TagButton } from '../../../common/components/tag-button/TagButton-sidecar'
import css from '../People.module.scss'
import { IStateB2P } from '../sosB2P'
import { sosB2P } from '../sosB2P-sidecar'
import cssTable from './EditPersonDetails.module.scss'
export const EditPackages = (props: { state: IStateB2P }) => {
  let { state } = props

  return (
    <div>
      <Card title='Packages sent to this person' maxWidth='912px'>
        <table>
          <thead>
            <tr>
              <th />
              <th />
              <th />
              <th className={cssTable.headerVertical}>Date</th>
              <th />
              <th />
              <th className={cssTable.headerVertical}>Title</th>
              <th className={cssTable.headerVertical}>Price</th>
              <th className={cssTable.headerVertical}>Author</th>
            </tr>
          </thead>
          <tbody>
            {l.map(state.editPerson.json.Packages, (c, cIdx: number) => (
              <React.Fragment key={c.id}>
                {cIdx !== 0 && (
                  <tr key={'separator-' + cIdx}>
                    <td colSpan={9}>
                      <div className={css.packageSeparator} />
                    </td>
                  </tr>
                )}
                {c.Items.length === 0 && (
                  <tr key={'no-entries'}>
                    <td />
                    <td />
                    <td />
                    <td>{c.Date}</td>
                    <td />
                    <td />
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                )}
                {l.map(c.Items, (d, dIdx: number) => {
                  return (
                    <React.Fragment key={d.id}>
                      <tr>
                        <td>
                          {dIdx === 0 && (
                            <React.Fragment>
                              <TagButton
                                isActive={true}
                                active='Print'
                                inactive={'Print'}
                                onClick={() => {
                                  sosB2P.print(c.Date)
                                }}
                              />
                            </React.Fragment>
                          )}
                        </td>
                        <td>
                          {dIdx === 0 && (
                            <React.Fragment>
                              <TagButton
                                isActive={c.IsDeleted}
                                active='Package is deleted'
                                inactive={'Delete'}
                                onClick={() => {
                                  sosB2P.updateEditPersonPackage(c.id, {
                                    IsDeleted: !c.IsDeleted,
                                  })
                                }}
                              />
                            </React.Fragment>
                          )}
                        </td>
                        <td>
                          {dIdx === 0 && (
                            <TagButton
                              isActive={c.IsReturned}
                              active='Package is returned'
                              inactive={'Return'}
                              onClick={() => {
                                sosB2P.updateEditPersonPackage(c.id, {
                                  IsReturned: !c.IsReturned,
                                })
                              }}
                            />
                          )}
                        </td>
                        <td>
                          {dIdx === 0 && (
                            <Input
                              value={c.Date}
                              onChange={(newVal) => {
                                sosB2P.updateEditPersonPackage(c.id, {
                                  Date: newVal,
                                })
                              }}
                            />
                          )}
                        </td>
                        <React.Fragment>
                          <td>
                            <TagButton
                              isActive={d.IsDeleted}
                              active='Book/item is deleted'
                              inactive={'Delete'}
                              onClick={() => {
                                sosB2P.updateEditPersonBook(c.id, d.id, {
                                  IsDeleted: !d.IsDeleted,
                                })
                              }}
                            />
                          </td>
                          <td>
                            <TagButton
                              isActive={d.IsReturned}
                              active='Book/item is returned'
                              inactive={'Return'}
                              onClick={() => {
                                sosB2P.updateEditPersonBook(c.id, d.id, {
                                  IsReturned: !d.IsReturned,
                                })
                              }}
                            />
                          </td>
                          <td>
                            <Input
                              value={d.Name}
                              onChange={(newVal) => {
                                sosB2P.updateEditPersonBook(c.id, d.id, {
                                  Name: newVal,
                                })
                              }}
                            />
                          </td>
                          <td>
                            <Input
                              value={d.Price}
                              onChange={(newVal) => {
                                sosB2P.updateEditPersonBook(c.id, d.id, {
                                  Price: newVal,
                                })
                              }}
                            />
                          </td>
                          <td>
                            <Input
                              value={d.Author}
                              onChange={(newVal) => {
                                sosB2P.updateEditPersonBook(c.id, d.id, {
                                  Author: newVal,
                                })
                              }}
                            />
                          </td>
                        </React.Fragment>
                      </tr>
                    </React.Fragment>
                  )
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
