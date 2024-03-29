import React, { useEffect } from 'react'
import { Button } from '../../../common/components/button/Button'
import { Icon, solidIcons } from '../../../common/components/icon/Icon'
import { Loader } from '../../../common/components/loader/Loader'
import { TagButton } from '../../../common/components/tag-button/TagButton'
import { route } from '../../../common/lib/route-sidecar'
import css from '../People.module.scss'
import { PrintPerson } from '../print/PrintPerson'
import { sosB2P } from '../sosB2P-sidecar'
import { AddABook } from './AddABook'
import { BookSearchResults } from './BookSearchResults'
import { EditPackages } from './EditPackages'
import { EditPersonDetails } from './EditPersonDetails'
import { ScreenLetter } from './ScreenLetter'

export const EditPerson = (props: { guid: string }) => {
  let state = sosB2P.useSubscribe()

  useEffect(() => {
    if (props.guid) {
      sosB2P.fetchPerson(props.guid)
    }
  }, [props.guid])

  let isLoading = state.requestPerson.isFetching

  return (
    <div>
      <div className={css.toolbarLayout}>
        <div className={css.toolbarItem}>
          {/* <RazLink to='/people/search'>Back</RazLink> */}
          <Button onClick={() => route.navTo('/people/search')}>
            <Icon icon={solidIcons.faChevronCircleLeft} /> Back
          </Button>
        </div>
        <div className={css.toolbarItem}>
          {/* <IconButton onClick={() => navTo(`/people/edit/${props.guid}/print`)}>
            Print
          </IconButton> */}
          <Button
            onClick={() => {
              sosB2P.print()
            }}
          >
            <Icon icon={solidIcons.faPrint} /> Print Packing Slip
          </Button>
        </div>
        <div className={css.toolbarItem}>
          {/* <LinkButton>Delete</LinkButton> */}
          <TagButton
            onClick={() => {
              sosB2P.toggleDeletePerson()
            }}
            isActive={state.editPerson && state.editPerson.deleted}
            active='Deleted, do not use'
            inactive='Delete'
          />
        </div>
      </div>

      {/* Edit person {props.guid} */}
      <Loader isLoading={isLoading} />
      {/* <Loading isLoading={isLoading} /> */}
      {!isLoading && state.editPerson && (
        <div>
          <div style={{ display: 'flex' }}>
            <div>
              <div className={css.layout}>
                <div>
                  <EditPersonDetails state={state} />
                </div>
                <div>
                  <div>
                    <ScreenLetter json={state.editPerson.json} />
                  </div>
                  <div>
                    <AddABook state={state} />
                  </div>
                </div>
              </div>
              <div>
                <EditPackages state={state} />
              </div>
            </div>
            <div>
              <BookSearchResults
                state={state}
                onSelectBook={(c) => {
                  sosB2P.selectBook(c)
                  sosB2P.addBookToTodaysPackage()
                  // refTitle.current.focus()
                }}
              />
            </div>
          </div>
        </div>
      )}
      <PrintPerson />
      {/* <Debug data={props.guid} />
      <Debug data={state.requestSetPerson} />
      <Debug data={state.editPerson} /> */}
    </div>
  )
}
