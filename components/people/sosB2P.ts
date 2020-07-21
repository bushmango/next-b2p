import { DateTime } from 'luxon'
import { generateId } from '../../common/lib/generateId'
import { l } from '../../common/lib/lodash'
import { apiRequest } from '../../common/lib/request/apiRequest-sidecar'
import { IApiRequestState } from '../../common/lib/request/apiRequestState'
import { route } from '../../common/lib/route-sidecar'
import { sos } from '../../common/lib/sos/sos-sidecar'

export interface INewBook {
  Author: string
  Name: string
  Price: string
}
export const quickPrices = [
  '$1.00',
  '$2.50',
  '$4.95',
  '$6.95',
  '$9.95',
  '$14.99',
]

export function createNewBook(): INewBook {
  return {
    Author: '',
    Name: '',
    Price: '' + l.sample(quickPrices),
  }
}

export interface IStateB2P {
  searchText: string
  searchShowDeleted: boolean
  selectedPersonId: string
  requestPeopleSearch: IApiRequestState<any>
  peopleSearchData: any
  requestPeopleCount: IApiRequestState<any>
  requestPerson: IApiRequestState<any>
  requestSetPerson: IApiRequestState<any>
  requestAddPerson: IApiRequestState<any>
  editPerson: any
  editNewBook: INewBook

  requestBookSearch: IApiRequestState<{ params: any; data: any }>
  bookSearchText: string
  printDate: string
}

const getSos = sos.createLazySos2<IStateB2P>('sosB2P', 1, () => ({
  searchText: { default: '', useLocalStorage: true },
  searchShowDeleted: { default: false },
  selectedPersonId: { default: '' },
  requestPeopleSearch: { default: {} },
  peopleSearchData: { default: null },
  requestPeopleCount: { default: {} },
  requestPerson: { default: {} },
  requestSetPerson: { default: {} },
  requestAddPerson: { default: {} },
  editPerson: { default: null },
  editNewBook: { default: createNewBook(), useLocalStorage: true },
  requestBookSearch: { default: {} },
  bookSearchText: { default: '', useLocalStorage: true },
  printDate: { default: '' },
}))
export const useSubscribe = sos.createUseSubscribe(getSos)

export function updateSearch(newVal: string) {
  getSos().change((ds) => {
    ds.searchText = newVal
  })
  if (newVal.trim()) {
    searchThrottled()
  }
}

export function toggleSearchShowDeleted() {
  getSos().change((ds) => {
    ds.searchShowDeleted = !ds.searchShowDeleted
  })

  fetchPeopleCount()
  searchThrottled()
}

export async function fetchPeopleSearch() {
  let state = getSos().getState()
  let result = await apiRequest.post<any>(
    '/api/people/search',
    {
      search: state.searchText,
      showDeleted: state.searchShowDeleted,
    },
    (r) => {
      getSos().change((ds) => {
        ds.requestPeopleSearch = r
      })
    },
  )

  if (result.isSuccess) {
    let data: any[] = []
    data = l.map(result.response.records, (c) => {
      return l.assign({}, c.json, {
        search: c.search,
        numPackages: (c.json.Packages && c.json.Packages.length) || 0,
        guid: c.guid,
        deleted: c.deleted,
      })
    })
    console.log('got result', data)
    getSos().change((ds) => {
      ds.peopleSearchData = data
    })
  }

  return { result }
}
const searchThrottled = l.debounce(fetchPeopleSearch, 500)

export async function fetchPeopleCount() {
  let state = getSos().getState()
  await apiRequest.post(
    '/api/people/count',
    { showDeleted: state.searchShowDeleted },
    (r) => {
      getSos().change((ds) => {
        ds.requestPeopleCount = r
      })
    },
  )
}

export const packageComparison = (a: { Date: string }, b: { Date: string }) => {
  let da = parseB2PDate(a.Date)
  let db = parseB2PDate(b.Date)
  if (!da || !db) {
    return 0
  }
  let m = db.diff(da).milliseconds
  return m
}

export async function fetchPerson(guid: string) {
  await apiRequest.post<any>('/api/people/get', { guid }, (r) => {
    getSos().change((ds) => {
      ds.requestPerson = r
      if (r.isSuccess) {
        ds.editPerson = l.cloneDeep(r.response.record)
        // Fix missing ids
        if (!ds.editPerson.json.Packages) {
          ds.editPerson.json.Packages = []
        }
        l.forEach(ds.editPerson.json.Packages, (c) => {
          if (!c.id) {
            c.id = generateId()
          }
          l.forEach(c.Items, (d) => {
            if (!d.id) {
              d.id = generateId()
            }
          })
        })
        // Sort packages
        ds.editPerson.json.Packages.sort(packageComparison)
      }
    })
  })
}

export async function addPerson() {
  let r = await apiRequest.post('/api/people/add', {}, (r) => {
    getSos().change((ds) => {
      ds.requestPeopleCount = r
    })
  })
  if (r.isSuccess) {
    route.navTo('/people/edit/' + r.response.guid)
  }
}

export async function toggleDeletePerson() {
  getSos().change((ds) => {
    ds.editPerson.deleted = !!!ds.editPerson.deleted
  })
  sendUpdateEditPersonThrottled()
}

export async function updateEditPerson(changes: Partial<any>) {
  getSos().change((ds) => {
    l.assign(ds.editPerson.json, changes)
    ds.editPerson.json.Packages.sort(packageComparison)
  })
  sendUpdateEditPersonThrottled()
}
export async function updateEditPersonPackage(
  packageId: string,
  changes: Partial<any>,
) {
  console.log('changes', changes)

  getSos().change((ds) => {
    let a = l.find(ds.editPerson.json.Packages, (c) => c.id === packageId)
    if (!a) {
      throw new Error(`invalid id! ${packageId}`)
    }
    l.assign(a, changes)
    ds.editPerson.json.Packages.sort(packageComparison)
  })
  sendUpdateEditPersonThrottled()
}
export async function updateEditPersonBook(
  packageId: string,
  itemId: string,
  changes: Partial<any>,
) {
  getSos().change((ds) => {
    let a = l.find(ds.editPerson.json.Packages, (c) => c.id === packageId)
    if (!a) {
      throw new Error(`invalid id! ${packageId}`)
    }
    let b = l.find(a.Items, (c) => c.id === itemId)
    if (!b) {
      throw new Error(`invalid id! ${itemId}`)
    }
    l.assign(b, changes)
    ds.editPerson.json.Packages.sort(packageComparison)
  })
  sendUpdateEditPersonThrottled()
}

export function updateEditNewBook(changes: Partial<INewBook>) {
  getSos().change((ds) => {
    l.assign(ds.editNewBook, changes)
  })
}

export function isScreenedToday(json: any): boolean {
  let today = DateTime.local()
  const isToday = (c: string) => today.hasSame(DateTime.fromISO(c), 'day')
  return l.some(json.Screens, isToday)
}
export function toggleScreenedToday() {
  let today = DateTime.local()
  const isToday = (c: string) => today.hasSame(DateTime.fromISO(c), 'day')
  getSos().change((ds) => {
    if (!ds.editPerson.json.Screens) {
      ds.editPerson.json.Screens = []
    }
    let a = l.some(ds.editPerson.json.Screens, isToday)
    console.log('screens?', a, ds.editPerson.json.Screens)
    if (!a) {
      ds.editPerson.json.Screens.push(DateTime.local().toISODate())
    } else {
      l.remove(ds.editPerson.json.Screens, (c: string) => isToday)
    }
  })
  sendUpdateEditPersonThrottled()
}

export function addBookToTodaysPackage() {
  let state = getSos().getState()
  if (!state.editNewBook.Author && !state.editNewBook.Name) {
    return // Don't add empties
  }
  getSos().change((ds) => {
    // Search for today's package
    let a = l.find(ds.editPerson.json.Packages, (c) => isB2PDateToday(c.Date))
    if (!a) {
      // Create a new package
      a = {
        Date: formatToday(),
        Items: [],
        id: generateId(),
      }
      if (!ds.editPerson.json.Packages) {
        ds.editPerson.json.Packages = []
      }
      ds.editPerson.json.Packages.push(a)
    }
    a.Items.push(l.assign({ id: generateId() }, ds.editNewBook))

    // Clear book
    l.assign(ds.editNewBook, createNewBook())
  })
  sendUpdateEditPersonThrottled()
}

const sendUpdateEditPersonThrottled = l.debounce(sendUpdateEditPerson, 500)
export async function sendUpdateEditPerson() {
  let state = getSos().getState()
  await apiRequest.post<any>(
    '/api/people/set',
    { json: state.editPerson.json, deleted: state.editPerson.deleted },
    (r) => {
      getSos().change((ds) => {
        ds.requestSetPerson = r
      })
    },
  )
}

//const B2PDateFormat = 'M/D/YYYY'
export const B2PDateFormat = 'L/d/yyyy'
export const parseB2PDate = (date: string) => {
  try {
    let split = date.split('/', 3)

    let year = parseInt(split[2])
    if (year < 90) {
      year += 2000 // i.e. 14 -> 2014
    } else if (year < 100) {
      year += 1900 // i.e. 97 -> 1997
    }

    let parsedDate = DateTime.local(
      year,
      parseInt(split[0]),
      parseInt(split[1]),
    )
    return parsedDate
  } catch (err) {
    return null
  }
}

export const isB2PDateToday = (date: string, todayDate: string = '') => {
  let parsedTodayDate = DateTime.local()
  if (todayDate) {
    parsedTodayDate = parseB2PDate(todayDate) || DateTime.local()
  }

  let parsedDate = parseB2PDate(date)
  if (!parsedDate) {
    return false
  }
  return parsedTodayDate.hasSame(parsedDate, 'day')
}

export const formatToday = () => {
  return DateTime.local().toFormat(B2PDateFormat)
}

let thisYear = DateTime.local()
export const calcNumUnreturnedPackages = (json: any) => {
  let totalUnreturnedPackages = 0
  let totalUnreturnedPackagesThisYear = 0
  let totalScreensThisYear = 0

  l.forEach(json.Screens, (c) => {
    if (DateTime.local().hasSame(DateTime.fromISO(c), 'year')) {
      totalScreensThisYear++
    }
  })
  l.forEach(json.Packages, (c) => {
    let parsedDate = parseB2PDate(c.Date)
    if (parsedDate) {
      let isCurrentYear = thisYear.hasSame(parsedDate, 'year')
      if (c.IsReturned !== true && c.IsDeleted !== true) {
        totalUnreturnedPackages++
        if (isCurrentYear) {
          totalUnreturnedPackagesThisYear++
        }
      }
    }
  })
  return {
    totalUnreturnedPackages,
    totalUnreturnedPackagesThisYear,
    totalScreensThisYear,
  }
}

export async function updateBookSearchText(newText: string) {
  getSos().change((ds) => {
    ds.bookSearchText = newText
  })
  fetchBookSearchThrottled()
}

export const fetchBookSearchThrottled = l.debounce(fetchBookSearch, 500)

async function fetchBookSearch() {
  let state = getSos().getState()

  if (state.bookSearchText) {
    return await apiRequest.post<any>(
      '/api/books/search',
      { search: state.bookSearchText },
      (rs) => {
        getSos().change((ds) => {
          ds.requestBookSearch = rs
          ds.requestBookSearch.params = state.bookSearchText
        })
      },
    )
  }
}

export async function selectBook(c: any) {
  getSos().change((ds) => {
    ds.editNewBook.Author = l.join(c.authors, ', ')
    ds.editNewBook.Name = c.title
    // ds.editNewBook.Price = '' + _.sample(quickPrices)
    ds.bookSearchText = ''
  })
}

export async function print(date: string = '') {
  getSos().change((ds) => {
    ds.printDate = date
  })
  setTimeout(() => window.print(), 100)
}
