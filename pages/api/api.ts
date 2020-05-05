import { NextApiRequest, NextApiResponse } from 'next'
import { gateway } from '../../apiLib/api'

export default (req: NextApiRequest, res: NextApiResponse) => {
  return gateway(req, res)
}
