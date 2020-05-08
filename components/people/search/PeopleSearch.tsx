import React, { useEffect } from 'react'
import { Badge } from '../../../common/components/badge/Badge-sidecar'
import { Button } from '../../../common/components/button/Button-sidecar'
import { Icon, solidIcons } from '../../../common/components/icon/Icon-sidecar'
import { Input } from '../../../common/components/input/Input-sidecar'
import { InternalLink } from '../../../common/components/internal-link/InternalLink'
import { Loader } from '../../../common/components/loader/Loader-sidecar'
import { TagButton } from '../../../common/components/tag-button/TagButton-sidecar'
import { l } from '../../../common/lib/lodash'
import { route } from '../../../common/lib/route-sidecar'
import { Spacer } from '../../spacer/Spacer-sidecar'
import { NumPackagesThisYear } from '../NumPackagesThisYear-sidecar'
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

      <div style={{ minHeight: '20px' }}>
        <Loader isLoading={isLoading} />
      </div>
      {peopleSearchData && (
        <table>
          <thead>
            <tr>
              <th />
              <th />
              {/* <th>#</th> */}
              <th title='Packages sent this year'>Packages*</th>
              {l.map(headers, (h, hIdx) => (
                <th key={'h-' + hIdx}>{h.label || h.field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {l.map(peopleSearchData, (c, cIdx) => (
              <tr
                style={{ cursor: 'pointer' }}
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
                  <InternalLink href={'/people/edit/' + c.guid}>
                    Edit
                  </InternalLink>
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
