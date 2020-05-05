import { NextApiRequest, NextApiResponse } from 'next'
import { apiAccount } from './../../../api/apiAccount-sidecar'
export default (req: NextApiRequest, res: NextApiResponse) => {
  apiAccount.login(req, res)
}
