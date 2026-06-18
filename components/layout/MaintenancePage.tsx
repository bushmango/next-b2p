import React from 'react'
import { b2pDebugDefs } from '../../lib/b2pDebugDefs'

export const MaintenancePage = () => {
  return (
    <div>
      <h1>Under Maintenance</h1>
      <p>{b2pDebugDefs.maintenanceMotd}</p>
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
