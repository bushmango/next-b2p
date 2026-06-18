const fs = require('fs')
const path = require('path')
const concurrently = require('concurrently')
const setTitle = require('console-title')

const title = 'b2p'
const interval = 1000

console.log('Starting up b2p...')

fs.rmSync(path.join(process.cwd(), '.next'), {
  force: true,
  recursive: true,
})

const items = [
  {
    name: 'next',
    command: 'yarn dev',
  },
  {
    name: 'css',
    command: 'yarn 2',
  },
  {
    name: 'sidecar',
    command: 'yarn sidecar',
  },
]

setTitle(title)

const cc = concurrently(items, {
  killOthers: ['failure'],
  prefix: '[{name}]',
})

const intervalId = setInterval(() => {
  setTitle(title)
}, interval)

cc.then(
  () => {
    console.log('success')
    clearInterval(intervalId)
  },
  () => {
    console.log('failure')
    clearInterval(intervalId)
  }
)
