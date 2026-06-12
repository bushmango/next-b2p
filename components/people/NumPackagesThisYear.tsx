import { Icon, solidIcons } from '../../common/components/icon/Icon'
import { l } from '../../common/lib/lodash'
import { sosB2P } from './sosB2P-sidecar'

const CountIcons = (props: {
  count: number
  icon: typeof solidIcons.faBook
}) => {
  return (
    <div style={{ paddingTop: '2px' }}>
      {l.map(l.times(props.count), (c) => (
        <Icon key={c} icon={props.icon} />
      ))}
    </div>
  )
}

export const NumPackagesThisYear = (props: { json: any }) => {
  let { totalUnreturnedPackagesThisYear, totalScreensThisYear } =
    sosB2P.calcNumUnreturnedPackages(props.json)
  return (
    <div style={{ paddingTop: '2px' }}>
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

export const NumPackagesSentThisYear = (props: { json: any }) => {
  const { totalUnreturnedPackagesThisYear } =
    sosB2P.calcNumUnreturnedPackages(props.json)

  return (
    <CountIcons
      count={totalUnreturnedPackagesThisYear}
      icon={solidIcons.faBook}
    />
  )
}

export const NumLettersScreenedThisYear = (props: { json: any }) => {
  const { totalScreensThisYear } = sosB2P.calcNumUnreturnedPackages(props.json)

  return (
    <CountIcons
      count={totalScreensThisYear}
      icon={solidIcons.faEnvelopeOpenText}
    />
  )
}
