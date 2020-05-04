import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('pinging')
  await delayPing(req, res)
}

async function delayPing(req: NextApiRequest, res: NextApiResponse) {
  return new Promise((resolve) => {
    res.status(200)
    res.send('pong-delay')
    console.log('pung')
    resolve()
  })
}
