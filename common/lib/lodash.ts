import * as lodash from 'lodash'
import fp from 'lodash/fp'

let l = lodash.assign({}, lodash, {
  lowerCase: () => {
    /*tslint:disable-next-line:no-console*/
    console.error(
      'this is probably not what you want, you probably want toLower',
    )
  },
  forReals_lowerCase: lodash.lowerCase,
  clone: () => {
    /*tslint:disable-next-line:no-console*/
    console.error(
      'this is probably not what you want, you probably want cloneDeep or r.clone',
    )
  },
  forReals_clone: lodash.clone,
})

export { l, fp }
