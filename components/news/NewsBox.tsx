import React from 'react'
import { Card } from '../../common/components/card/Card'
// import { buildDateTime } from '@/config'

export const NewsBox = () => {
  return (
    <Card title='News / Changelog'>
      {/* <div>Build: {buildDateTime}</div> */}
      <div>
        Version 6 -- Move to NextJS Cloud
        <ul>
          <li>11/9/2021 - Fix gifphy api update</li>
          <li>8/23/2021 - Update return address</li>
          <li>7/21/2020 - Add basic reporting functionality</li>
          <li>5/9/2020 - Release!</li>
          <li>
            5/8/2020 - Fix misc. bugs, move to more stable server, beautify
          </li>
        </ul>
      </div>
      <div>
        Version 5 -- Cloud + Multi-tenant support
        <ul>
          <li>
            9/11/2019 - Add book search, print older package slips, adjust print
            size again
          </li>
          <li>
            8/12/2019 - Rebuild search index and swap title and author on
            packing slip
          </li>
          <li>8/12/2019 - Add in ID on address, and get to 1/2 page</li>
          <li>8/8/2019 - Better loader</li>
          <li>8/7/2019 - Search on ID, styling pass, diagonal Media Mail</li>
          <li>8/5/2019 - Fix book title and print name on address label</li>
          <li>8/4/2019 - Initial release</li>
          <li>Count screens per year</li>
          <li>Better multi-user support</li>
          <li>Stable SSL</li>
        </ul>
      </div>
      <div>
        Version 2
        <ul>
          <li>11/13/2016 - Patch 4</li>
          <li>Fix deleting of people</li>
          <li>Allow viewing all people</li>
          <li>Update loading gifs</li>
          <li>11/2/2016 - Patch 3</li>
          <li>Delete packages and package items</li>
          <li>Edit package date</li>
          <li>Scanner and Google Books search</li>
          <li>10/31/2016 - Patch 2</li>
          <li>Edit package items</li>
          <li>Do not print returned items</li>
          <li>10/23/2016 - Patch 1</li>
          <li>Bigger notes area</li>
          <li>Align items on people editor</li>
          <li>10/2/2016 - Release new version 2</li>
          <li>New addresses</li>
          <li>Changes now save immediately</li>
          <li>Can delete people</li>
          <li>Can mark packages / books as returned</li>
          <li>Converted to React.js</li>
          <li>Upgraded DB to PostgreSQL</li>
        </ul>
      </div>
      <div>
        Version 1
        <ul>
          <li>
            1/23/2016 - Add quick book pricing. Upgrade to ASP.net5/core RC1-U1.{' '}
          </li>
          <li>1/22/2016 - Clean database and cache for speed improvements.</li>
          <li>10/26/2015 - Update ASP.net to version 5b8.</li>
          <li>
            Manually adding a new book sets focus back to book title, not isbn.
          </li>
          <li>Fix bug for saving people many times.</li>
          <li>Order packages by newest first.</li>
          <li>
            9/22/2015 - Calc and show number of packages per year on People
            page. Switch ID and Institution columns in Person record editor.
          </li>
          <li>
            9/21/2015 - Added a second database for book lookups. Should improve
            book scan rate! Changed book entering interface.
          </li>
        </ul>
      </div>
    </Card>
  )
}
