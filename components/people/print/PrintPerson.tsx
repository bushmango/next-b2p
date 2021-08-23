import cssPrint from './Print.module.scss'
import l from 'lodash'
import { DateTime } from 'luxon'
import React, { useEffect } from 'react'
import usePortal from 'react-useportal'
import { urls } from '../../../lib/urls-sidecar'
import { isB2PDateToday } from '../sosB2P'
import { sosB2P } from '../sosB2P-sidecar'
const autoPrint = false
export const PrintPerson = () => {
  let state = sosB2P.useSubscribe()
  const { Portal } = usePortal()

  let packageToday: any = null

  if (state.editPerson && state.editPerson.json) {
    packageToday = l.find(state.editPerson.json.Packages, (c) =>
      // isB2PDateToday(c.Date),

      isB2PDateToday(c.Date, state.printDate),
    )
  }
  useEffect(() => {
    setTimeout(() => {
      if (autoPrint) {
        window.print()
      }
    }, 250)
  }, [])

  if (!state.editPerson) {
    return null
  }

  return (
    <div>
      {/* <Button onClick={() => window.print()}>Print</Button>
      <Button
        onClick={() => route.navTo('/people/edit/' + state.editPerson.guid)}
      >
        Close
      </Button> */}
      {/* <ToBePrinted packageToday={packageToday} json={state.editPerson.json} /> */}
      <Portal>
        <div className={cssPrint.printable}>
          <ToBePrinted
            packageToday={packageToday}
            json={state.editPerson.json}
          />
        </div>
      </Portal>
    </div>
  )
}

const Address = (props: { json: any }) => {
  let { json } = props
  return (
    <div>
      {json.FullName} {json.Id}
      <br />
      {json.Institution} {json.Unit}
      <br />
      {json.Address}
      <br />
      {json.City}, {json.State} {'  '} {json.Zip}
    </div>
  )
}

const ToBePrinted = (props: { packageToday: any; json: any }) => {
  let { packageToday, json } = props
  return (
    <div className={cssPrint.printLayout}>
      <div className={cssPrint.printItem} />

      <div className={cssPrint.printItem}>
        {/* Address label */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '10px 0px 30px',
          }}
        >
          <div style={{ margin: '10px' }}>
            {/* <img
              className={classesPrint.logo}
              src={route.getUrl('/b2p/images/logos/room-of-ones-own-bw.png')}
            /> */}
          </div>
          <div style={{ margin: '10px' }}>
            <Address json={json} />
          </div>
          <div style={{ margin: '10px' }}>
            <div className={cssPrint.mediaMail}>MEDIA MAIL</div>
          </div>
        </div>

        {/* Packing slip */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ margin: '10px' }}>
            <img
              className={cssPrint.logo}
              src={urls.getUrl('/b2p/images/logos/room-of-ones-own-bw.png')}
            />
          </div>
          <div style={{ margin: '10px' }}>
            A Room of One's Own Bookstore
            <br />
            2717 Atwood Ave
            <br />
            Madison, WI 53704
          </div>
        </div>
        <div>
          <div className={cssPrint.tablePacking}>
            <table>
              <tbody>
                <tr>
                  <th>Date:</th>
                  <td>{DateTime.local().toLocaleString(DateTime.DATE_FULL)}</td>
                </tr>
                <tr>
                  <th>Name:</th>
                  <td>
                    <strong>{json.FullName}</strong>
                  </td>
                </tr>
                <tr>
                  <th>Address:</th>
                  <td>
                    <Address json={json} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>We have sent the following books which you requested:</div>
          <div className={cssPrint.tableItems}>
            <table>
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Title</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {l.map(
                  packageToday &&
                    l.filter(
                      packageToday.Items,
                      (d) => !d.IsReturned && !d.IsDeleted,
                    ),
                  (c) => (
                    <tr key={c.id}>
                      <td>{c.Author}</td>
                      <td>{c.Name}</td>
                      <td>{c.Price}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', margin: '5px' }}>
            <div style={{ margin: '10px' }}>Since 1975</div>
            <div style={{ margin: '10px' }}>FEIN 456-0000353784-03</div>
            <div style={{ margin: '10px', border: 'solid 1px red' }}>
              PAID IN FULL
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
