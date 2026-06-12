import React, { useEffect, useState } from 'react'
import { Badge } from '../../common/components/badge/Badge'
import { Button } from '../../common/components/button/Button'
import { Icon, solidIcons } from '../../common/components/icon/Icon'
import { Input } from '../../common/components/input/Input'
import { Loader } from '../../common/components/loader/Loader'
import { TagButton } from '../../common/components/tag-button/TagButton'
import { l } from '../../common/lib/lodash'
import { ClientOnlyLoggedIn } from '../account/ClientOnlyLoggedIn'
import { Layout } from '../layout/Layout'
import css from './StateRestrictionsPage.module.scss'
import {
  FacilityRestriction,
  StateRestrictionRecord,
} from './sosStateRestrictions'
import { sosStateRestrictions } from './sosStateRestrictions-sidecar'

const textWidth = '170px'

export const StateRestrictionsPage = () => {
  return (
    <Layout title='State Restrictions'>
      <ClientOnlyLoggedIn>
        <StateRestrictionsContent />
      </ClientOnlyLoggedIn>
    </Layout>
  )
}

const StateRestrictionsContent = () => {
  let state = sosStateRestrictions.useSubscribe()
  let [canEditStatesAndFacilities, setCanEditStatesAndFacilities] =
    useState(false)
  let [canEditRestrictions, setCanEditRestrictions] = useState(false)

  useEffect(() => {
    sosStateRestrictions.fetchSearch()
  }, [])

  let isLoading =
    state.requestSearch.isFetching ||
    state.requestSet.isFetching ||
    state.requestAdd.isFetching ||
    false

  return (
    <div>
      <h1>State Restrictions</h1>
      <div className={css.toolbar}>
        <div className={css.search}>
          <Icon icon={solidIcons.faSearch} className={css.icon} />
          <Input
            value={state.searchText}
            onChange={(newVal) => sosStateRestrictions.updateSearch(newVal)}
            iconLeft
            placeholder='State, facility, restriction, address'
            width='280px'
          />
        </div>
        <TagButton
          onClick={() => sosStateRestrictions.toggleShowDeleted()}
          isActive={state.searchShowDeleted}
          active='Showing deleted'
          inactive='Show deleted'
        />
        <label className={css.checkboxLabel}>
          <input
            type='checkbox'
            checked={canEditStatesAndFacilities}
            onChange={(ev) =>
              setCanEditStatesAndFacilities(ev.currentTarget.checked)
            }
          />{' '}
          Edit States and Facilities
        </label>
        <label className={css.checkboxLabel}>
          <input
            type='checkbox'
            checked={canEditRestrictions}
            onChange={(ev) => setCanEditRestrictions(ev.currentTarget.checked)}
          />{' '}
          Edit Restrictions
        </label>
        {canEditStatesAndFacilities && (
          <Button onClick={() => sosStateRestrictions.addState()}>
            <Icon icon={solidIcons.faPlus} /> Add state
          </Button>
        )}
        <SaveStatus />
      </div>

      <Loader isLoading={isLoading} />

      <table className={css.table}>
        <thead>
          <tr>
            <th>State</th>
            <th>Facility</th>
            <th>Restrictions</th>
            <th>Paper Mail Location</th>
            <th>Packages</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {l.map(state.records, (record) =>
            renderState(
              record,
              state.searchShowDeleted,
              canEditStatesAndFacilities,
              canEditRestrictions,
            ),
          )}
        </tbody>
        {state.hasMoreThanLimit && (
          <tfoot>
            <tr>
              <td colSpan={7} className={css.footerWarning}>
                Showing the first {state.displayLimit} matches. Refine your
                search to see more specific results.
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

const SaveStatus = () => {
  let state = sosStateRestrictions.useSubscribe()

  if (state.requestSet.isFetching) {
    return <span>Saving...</span>
  }
  if (state.requestSet.error) {
    return <span>Error saving</span>
  }
  if (state.requestSet.isSuccess) {
    return <span>Saved</span>
  }
  return null
}

function renderState(
  record: StateRestrictionRecord,
  showDeleted: boolean,
  canEditStatesAndFacilities: boolean,
  canEditRestrictions: boolean,
) {
  let json = record.json
  let facilities = showDeleted
    ? json.Facilities || []
    : l.filter(json.Facilities || [], (facility) => !facility.deleted)

  return (
    <React.Fragment key={record.id}>
      <tr className={`${css.stateRow} ${record.deleted ? css.deleted : ''}`}>
        <td>
          <div className={css.stateInputs}>
            {record.deleted && <Badge isActive>Deleted</Badge>}
            <Input
              value={json.StateCode}
              onChange={(newVal) =>
                sosStateRestrictions.updateStateRestriction(record.id, {
                  StateCode: newVal.toUpperCase(),
                })
              }
              width='70px'
              readOnly={!canEditStatesAndFacilities}
            />
            <Input
              value={json.FullName}
              onChange={(newVal) =>
                sosStateRestrictions.updateStateRestriction(record.id, {
                  FullName: newVal,
                })
              }
              width='140px'
              readOnly={!canEditStatesAndFacilities}
            />
          </div>
        </td>
        <td>State</td>
        <td>
          <Input
            multiline
            value={json.Restrictions}
            onChange={(newVal) =>
              sosStateRestrictions.updateStateRestriction(record.id, {
                Restrictions: newVal,
              })
            }
            width={textWidth}
            readOnly={!canEditRestrictions}
          />
        </td>
        <td>
          <Input
            multiline
            value={json.PaperMailLocation}
            onChange={(newVal) =>
              sosStateRestrictions.updateStateRestriction(record.id, {
                PaperMailLocation: newVal,
              })
            }
            width={textWidth}
            readOnly={!canEditRestrictions}
          />
        </td>
        <td>
          <Input
            multiline
            value={json.Packages}
            onChange={(newVal) =>
              sosStateRestrictions.updateStateRestriction(record.id, {
                Packages: newVal,
              })
            }
            width={textWidth}
            readOnly={!canEditRestrictions}
          />
        </td>
        <td>
          <Input
            multiline
            value={json.Notes}
            onChange={(newVal) =>
              sosStateRestrictions.updateStateRestriction(record.id, {
                Notes: newVal,
              })
            }
            width={textWidth}
            readOnly={!canEditRestrictions}
          />
        </td>
        <td>
          {canEditStatesAndFacilities && (
            <div className={css.actions}>
              <Button
                onClick={() => sosStateRestrictions.addFacility(record.id)}
              >
                <Icon icon={solidIcons.faPlus} /> Add facility
              </Button>
              <TagButton
                onClick={() =>
                  sosStateRestrictions.toggleDeleteState(record.id)
                }
                isActive={record.deleted}
                active='Restore state'
                inactive='Delete state'
              />
            </div>
          )}
        </td>
      </tr>
      {l.map(facilities, (facility) =>
        renderFacility(
          record,
          facility,
          canEditStatesAndFacilities,
          canEditRestrictions,
        ),
      )}
    </React.Fragment>
  )
}

function renderFacility(
  record: StateRestrictionRecord,
  facility: FacilityRestriction,
  canEditStatesAndFacilities: boolean,
  canEditRestrictions: boolean,
) {
  return (
    <tr
      key={`${record.id}-${facility.id}`}
      className={facility.deleted ? css.deleted : ''}
    >
      <td>{record.json.StateCode}</td>
      <td className={css.facilityName}>
        {facility.deleted && <Badge isActive>Deleted</Badge>}
        <Input
          value={facility.FacilityName}
          onChange={(newVal) =>
            sosStateRestrictions.updateFacility(record.id, facility.id, {
              FacilityName: newVal,
            })
          }
          width='150px'
          readOnly={!canEditStatesAndFacilities}
        />
      </td>
      <td>
        <Input
          multiline
          value={facility.Restrictions}
          onChange={(newVal) =>
            sosStateRestrictions.updateFacility(record.id, facility.id, {
              Restrictions: newVal,
            })
          }
          width={textWidth}
          readOnly={!canEditRestrictions}
        />
      </td>
      <td>
        <Input
          multiline
          value={facility.PaperMailLocation}
          onChange={(newVal) =>
            sosStateRestrictions.updateFacility(record.id, facility.id, {
              PaperMailLocation: newVal,
            })
          }
          width={textWidth}
          readOnly={!canEditRestrictions}
        />
      </td>
      <td>
        <Input
          multiline
          value={facility.Packages}
          onChange={(newVal) =>
            sosStateRestrictions.updateFacility(record.id, facility.id, {
              Packages: newVal,
            })
          }
          width={textWidth}
          readOnly={!canEditRestrictions}
        />
      </td>
      <td>
        <Input
          multiline
          value={facility.Notes}
          onChange={(newVal) =>
            sosStateRestrictions.updateFacility(record.id, facility.id, {
              Notes: newVal,
            })
          }
          width={textWidth}
          readOnly={!canEditRestrictions}
        />
      </td>
      <td>
        {canEditStatesAndFacilities && (
          <TagButton
            onClick={() =>
              sosStateRestrictions.toggleDeleteFacility(record.id, facility.id)
            }
            isActive={facility.deleted}
            active='Restore facility'
            inactive='Delete facility'
          />
        )}
      </td>
    </tr>
  )
}
