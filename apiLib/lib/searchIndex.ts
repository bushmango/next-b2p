import { db } from './databaseB2P'
import l from 'lodash'

const searchKeys = [
  'Aka',
  'Zip',
  'City',
  'Unit',
  'Notes',
  'State',
  'Address',
  'FullName',
  'Institution',
  'PreferredName',
  'Id',
]

export function calcSearchIndex(json: any) {
  let searchIndex = ''
  l.forEach(searchKeys, (c) => {
    if (json[c]) {
      searchIndex += json[c] + ' '
    }
  })
  searchIndex = searchIndex.toLowerCase()
  // console.log('new search index is', searchIndex)
  return searchIndex
}

export async function rebuildSearchIndex(skip: number, take: number) {
  let organization = 'madison-lgbt-b2p'
  const table = 'b2p_people_v5'

  console.log('rebuilding...', skip, 'to', skip + take)

  let results = await db
    .from(table)
    .select()
    .offset(skip)
    .limit(take)
    .where({ organization })

  let idx = 0

  let completed = 0

  let promises: Promise<any>[] = []

  for (let idxR = 0; idxR < results.length; idxR++) {
    let r = results[idxR]

    idx++

    let searchIndex = calcSearchIndex(r.json)

    let promise = db
      .from(table)
      .where({ guid: r.guid })
      .update({ search: searchIndex })

    completed++
    // console.log(r.id, searchKey, completed, '/', results.length)

    promises.push(promise as any)
  }

  await Promise.all(promises)
  console.log('rebuilt', skip, 'to', skip + take)
  return results.length
}
