import React from 'react'
import { Layout } from '../Layout'
import { getUrl } from '../../lib/urls'

export const LGBTBooksToPrisonersLogo = () => {
  return (
    <div>
      <div style={{ maxHeight: 75, display: 'flex', alignItems: 'center' }}>
        <div>
          <a href='https://lgbtbookstoprisoners.org/' target='_blank'>
            <img
              src={getUrl('/b2p/images/logos/LGBTBtP-logo-color.png')}
              alt='LGBT Books to Prisoners Logo'
              style={{ maxHeight: 50, display: 'inline-block' }}
            />
          </a>
        </div>
        <div>
          <a href='https://lgbtbookstoprisoners.org/' target='_blank'>
            LGBT Books to Prisoners
          </a>{' '}
          Database
        </div>
      </div>
    </div>
  )
}

export const AboutPage = () => {
  return (
    <Layout title='About'>
      <div className='Home'>
        <div className='Home-header'>
          <h2>About B2P</h2>
        </div>
        <div>
          <LGBTBooksToPrisonersLogo />
        </div>
      </div>
    </Layout>
  )
}
