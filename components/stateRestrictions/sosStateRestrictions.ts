import { generateId } from '../../common/lib/generateId'
import { l } from '../../common/lib/lodash'
import { apiRequest } from '../../common/lib/request/apiRequest-sidecar'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'
import { sos } from '../../common/lib/sos/sos-sidecar'

export type FacilityRestriction = {
  id: string
  FacilityName: string
  Restrictions: string
  PaperMailLocation: string
  Packages: string
  Notes: string
  deleted: boolean
}

export type StateRestrictionJson = {
  StateCode: string
  FullName: string
  Restrictions: string
  PaperMailLocation: string
  Packages: string
  Notes: string
  Facilities: FacilityRestriction[]
}

export type StateRestrictionRecord = {
  id: number
  state_code: string
  json: StateRestrictionJson
  deleted: boolean
}

export interface IStateStateRestrictions {
  searchText: string
  searchShowDeleted: boolean
  records: StateRestrictionRecord[]
  requestSearch: IApiRequestState<any>
  requestSet: IApiRequestState<any>
  requestAdd: IApiRequestState<any>
  requestSetupSeed: IApiRequestState<any>
  hasMoreThanLimit: boolean
  displayLimit: number
}

const getSos = sos.createLazySos2<IStateStateRestrictions>(
  'sosStateRestrictions',
  1,
  () => ({
    searchText: { default: '', useLocalStorage: true },
    searchShowDeleted: { default: false },
    records: { default: [] },
    requestSearch: { default: {} },
    requestSet: { default: {} },
    requestAdd: { default: {} },
    requestSetupSeed: { default: {} },
    hasMoreThanLimit: { default: false },
    displayLimit: { default: 50 },
  }),
)

export const useSubscribe = sos.createUseSubscribe(getSos)

export function updateSearch(newVal: string) {
  getSos().change((ds) => {
    ds.searchText = newVal
  })
  fetchSearchThrottled()
}

export function toggleShowDeleted() {
  getSos().change((ds) => {
    ds.searchShowDeleted = !ds.searchShowDeleted
  })
  fetchSearchThrottled()
}

export async function fetchSearch() {
  let state = getSos().getState()
  let result = await apiRequest.post<any>(
    '/api/stateRestrictions/search',
    {
      search: state.searchText,
      showDeleted: state.searchShowDeleted,
      limit: 50,
    },
    (r) => {
      getSos().change((ds) => {
        ds.requestSearch = r
      })
    },
  )

  if (result.isSuccess) {
    getSos().change((ds) => {
      ds.records = result.response.records || []
      ds.hasMoreThanLimit = !!result.response.hasMoreThanLimit
      ds.displayLimit = result.response.displayLimit || 50
    })
  }
}

const fetchSearchThrottled = l.debounce(fetchSearch, 500)

function findRecord(ds: IStateStateRestrictions, id: number) {
  let record = l.find(ds.records, (c) => c.id === id)
  if (!record) {
    throw new Error(`Missing state restriction ${id}`)
  }
  if (!record.json.Facilities) {
    record.json.Facilities = []
  }
  return record
}

export function updateStateRestriction(
  id: number,
  changes: Partial<StateRestrictionJson>,
) {
  getSos().change((ds) => {
    let record = findRecord(ds, id)
    l.assign(record.json, changes)
    record.state_code = record.json.StateCode
  })
  sendUpdateThrottled(id)
}

export function toggleDeleteState(id: number) {
  getSos().change((ds) => {
    let record = findRecord(ds, id)
    record.deleted = !record.deleted
  })
  sendUpdateThrottled(id)
}

export function addFacility(id: number) {
  getSos().change((ds) => {
    let record = findRecord(ds, id)
    record.json.Facilities.push({
      id: generateId(),
      FacilityName: 'New facility',
      Restrictions: '',
      PaperMailLocation: '',
      Packages: '',
      Notes: '',
      deleted: false,
    })
  })
  sendUpdateThrottled(id)
}

export function updateFacility(
  stateId: number,
  facilityId: string,
  changes: Partial<FacilityRestriction>,
) {
  getSos().change((ds) => {
    let record = findRecord(ds, stateId)
    let facility = l.find(
      record.json.Facilities,
      (c) => c.id === facilityId,
    )
    if (!facility) {
      throw new Error(`Missing facility ${facilityId}`)
    }
    l.assign(facility, changes)
  })
  sendUpdateThrottled(stateId)
}

export function toggleDeleteFacility(stateId: number, facilityId: string) {
  getSos().change((ds) => {
    let record = findRecord(ds, stateId)
    let facility = l.find(
      record.json.Facilities,
      (c) => c.id === facilityId,
    )
    if (!facility) {
      throw new Error(`Missing facility ${facilityId}`)
    }
    facility.deleted = !facility.deleted
  })
  sendUpdateThrottled(stateId)
}

const sendUpdateThrottled = l.debounce(sendUpdate, 500)

export async function sendUpdate(id: number) {
  let state = getSos().getState()
  let record = l.find(state.records, (c) => c.id === id)
  if (!record) {
    return
  }

  await apiRequest.post<any>(
    '/api/stateRestrictions/set',
    { id: record.id, json: record.json, deleted: record.deleted },
    (r) => {
      getSos().change((ds) => {
        ds.requestSet = r
      })
    },
  )
}

export async function addState() {
  let result = await apiRequest.post<any>(
    '/api/stateRestrictions/add',
    {},
    (r) => {
      getSos().change((ds) => {
        ds.requestAdd = r
      })
    },
  )
  if (result.isSuccess) {
    fetchSearch()
  }
}

export async function setupAndSeed() {
  let result = await apiRequest.post<any>(
    '/api/stateRestrictions/setupAndSeed',
    {},
    (r) => {
      getSos().change((ds) => {
        ds.requestSetupSeed = r
      })
    },
  )
  if (result.isSuccess) {
    fetchSearch()
  }
}
