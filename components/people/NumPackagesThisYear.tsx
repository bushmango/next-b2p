import { Icon, solidIcons } from '../../common/components/icon/Icon-sidecar'
import { l } from '../../common/lib/lodash'
import { sosB2P } from './sosB2P-sidecar'

export const NumPackagesThisYear = (props: { json: any }) => {
  let {
    totalUnreturnedPackagesThisYear,
    totalScreensThisYear,
  } = sosB2P.calcNumUnreturnedPackages(props.json)
  return (
    <div>
      <span>
        {l.map(l.times(totalUnreturnedPackagesThisYear), (c) => (
          <Icon key={c} icon={solidIcons.faBook} />
        ))}
      </span>
      <span>
        {l.map(l.times(totalScreensThisYear), (c) => (
          <Icon key={c} icon={solidIcons.faEnvelopeOpenText} />
        ))}
      </span>
    </div>
  )
}
