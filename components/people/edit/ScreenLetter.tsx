import l from 'lodash'
import { DateTime } from 'luxon'
import React from 'react'
import { Card } from '../../../common/components/card/Card'
import { Icon, solidIcons } from '../../../common/components/icon/Icon'
import { TagButton } from '../../../common/components/tag-button/TagButton'
import { Spacer } from '../../spacer/Spacer'
import { sosB2P } from '../sosB2P-sidecar'

export const ScreenLetter = (props: { json: any }) => {
  let { json } = props

  let { totalUnreturnedPackagesThisYear, totalScreensThisYear } =
    sosB2P.calcNumUnreturnedPackages(json)

  return (
    <Card title='Screen letter' minWidth='430px'>
      <TagButton
        isActive={sosB2P.isScreenedToday(json)}
        active={
          <span>
            <Icon icon={solidIcons.faEnvelopeOpenText} /> Screened today
          </span>
        }
        inactive={
          <span>
            <Icon icon={solidIcons.faEnvelope} /> I screened this package today
          </span>
        }
        onClick={() => {
          sosB2P.toggleScreenedToday()
        }}
      />
      <Spacer />

      <div>
        Screened <strong>{totalScreensThisYear}</strong>{' '}
        {totalScreensThisYear != 1 ? 'times' : 'time'} this year
      </div>
      <Spacer />
      <div>
        <strong>{totalUnreturnedPackagesThisYear}</strong> unreturned{' '}
        {totalUnreturnedPackagesThisYear != 1 ? 'packages' : 'package'} sent to
        this person this year
      </div>
      <Spacer />
      <div>
        Screened on:{' '}
        {l.join(
          l.map(json.Screens, (c) =>
            DateTime.fromISO(c).toLocaleString(DateTime.DATE_FULL),
          ),
          ', ',
        )}
      </div>
    </Card>
  )
}
