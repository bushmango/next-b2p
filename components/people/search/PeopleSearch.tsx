import React, { useEffect } from 'react'
import { Badge } from '../../../common/components/badge/Badge'
import { Button } from '../../../common/components/button/Button'
import { Icon, solidIcons } from '../../../common/components/icon/Icon'
import { Input } from '../../../common/components/input/Input'
import { Loader } from '../../../common/components/loader/Loader'
import { TagButton } from '../../../common/components/tag-button/TagButton'
import { l } from '../../../common/lib/lodash'
import { route } from '../../../common/lib/route-sidecar'
import { Spacer } from '../../spacer/Spacer'
import cssTable from '../edit/EditPersonDetails.module.scss'
import { NumPackagesThisYear } from '../NumPackagesThisYear'
import css from '../People.module.scss'
import { sosB2P } from '../sosB2P-sidecar'

interface IHeader {
  label: string
  field: string
  width?: number
}
let headers: IHeader[] = [
  { label: 'Mailing Name', field: 'FullName', width: 150 },
  { label: 'Preferred Name', field: 'Aka', width: 150 },
  { label: 'Notes', field: 'Notes' },
  { label: 'ID Number', field: 'Id' },
  { label: 'Institution', field: 'Institution', width: 150 },
  { label: 'Address', field: 'Address', width: 150 },
  { label: 'Unit', field: 'Unit' },
  { label: 'City', field: 'City' },
  { label: 'State', field: 'State' },
  { label: 'Zip', field: 'Zip' },
]

export const PeopleSearch = () => {
  let state = sosB2P.useSubscribe()

  const onChange = (newVal: string) => {
    sosB2P.updateSearch(newVal)
  }
  useEffect(() => {
    sosB2P.fetchPeopleCount()
  }, [])
  useEffect(() => {
    sosB2P.updateSearch(state.searchText)
  }, [state.searchText])

  // Process data
  let { peopleSearchData } = state
  let isLoading =
    state.requestPeopleSearch.isFetching ||
    state.requestPeopleCount.isFetching ||
    false
  return (
    <div>
      <div className={css.toolbarLayout}>
        <div className={css.toolbarItem}></div>
        <div className={css.toolbarItem}>
          <div className={css.toolbarSearch}>
            <Icon icon={solidIcons.faSearch} className={css.icon} />
            <Input
              value={state.searchText}
              onChange={onChange}
              iconLeft={true}
            />
          </div>
        </div>
        <div className={css.toolbarItem}>
          <TagButton
            onClick={() => {
              sosB2P.toggleSearchShowDeleted()
            }}
            isActive={state.searchShowDeleted}
            active='Showing deleted'
            inactive='Show deleted'
          />
        </div>
        <div className={css.toolbarItem}>
          {state.requestPeopleCount.isSuccess &&
            state.requestPeopleCount.response.count}{' '}
          people
        </div>
        <div className={css.toolbarItem}>
          <Button onClick={() => sosB2P.addPerson()}>
            <Icon icon={solidIcons.faPlus} /> Add person
          </Button>
        </div>
      </div>

      <Loader isLoading={isLoading} />

      {peopleSearchData && (
        <table className={css.tableSearch} cellSpacing={0} cellPadding={0}>
          <thead>
            <tr>
              <th />
              <th />
              {/* <th>#</th> */}
              <th
                className={cssTable.headerVertical}
                title='Packages sent this year'
              >
                Packages*
              </th>
              {l.map(headers, (h, hIdx) => (
                <th className={cssTable.headerVertical} key={'h-' + hIdx}>
                  {h.label || h.field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {l.map(peopleSearchData, (c, cIdx) => (
              <tr
                style={{ cursor: 'pointer', verticalAlign: 'middle' }}
                key={'r-' + cIdx}
                onClick={() => {
                  route.navTo('/people/edit/' + c.guid)
                }}
              >
                <td>
                  {c.deleted && (
                    <Badge isActive={true}>Deleted, do not use</Badge>
                  )}{' '}
                </td>
                <td>
                  {/* <InternalLink href={'/people/edit/' + c.guid}>
                    Edit
                  </InternalLink> */}
                  <TagButton
                    onClick={() => route.navTo('/people/edit/' + c.guid)}
                    isActive={false}
                    active={'Edit'}
                    inactive={'Edit'}
                  />
                </td>
                {/* <td>{cIdx + 1}</td> */}
                <td>
                  <NumPackagesThisYear json={c} />
                </td>
                {l.map(headers, (h, hIdx) => (
                  <td key={'c-' + hIdx}>{c[h.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Spacer />

        <div>
          *<Icon icon={solidIcons.faBook} /> Packages sent this year
        </div>
        <div>
          *<Icon icon={solidIcons.faEnvelopeOpenText} /> Letters screened this
          year
        </div>
      </div>
      {/* <pre>{JSON.stringify(peopleSearchData, null, 2)}</pre> */}
    </div>
  )
}
