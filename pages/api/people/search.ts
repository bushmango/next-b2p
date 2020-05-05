import { NextApiRequest, NextApiResponse } from 'next'
import { apiPeople } from '../../../api/apiPeople-sidecar'
export default (req: NextApiRequest, res: NextApiResponse) => {
  apiPeople.search(req, res)
}
