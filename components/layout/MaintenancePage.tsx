import React from 'react'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'

const renderMotd = (message: string) => {
  return message.split(/\r?\n/).map((line, index) => (
    <React.Fragment key={index}>
      {index > 0 && (
        <>
          <br />
          <br />
        </>
      )}
      {line.trim()}
    </React.Fragment>
  ))
}

export const MaintenancePage = () => {
  return (
    <div>
      <h1>Under Maintenance</h1>
      <p>{renderMotd(b2pDebugDefs.maintenanceMotd)}</p>
      <p>
        For questions, contact{' '}
        <a href={`mailto:${b2pDebugDefs.maintenanceEmail}`}>
          {b2pDebugDefs.maintenanceEmail}
        </a>{' '}
        or {b2pDebugDefs.maintenancePhone}.
      </p>
    </div>
  )
}
