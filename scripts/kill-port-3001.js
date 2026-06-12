const { execFile } = require('child_process')

const port = '3001'

function execFileAsync(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout
        error.stderr = stderr
        reject(error)
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

function getListeningPids(netstatOutput) {
  const pids = new Set()
  const lines = netstatOutput.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.startsWith('TCP')) {
      continue
    }

    const parts = trimmed.split(/\s+/)
    const localAddress = parts[1]
    const state = parts[3]
    const pid = parts[4]

    if (!localAddress || state !== 'LISTENING' || !pid) {
      continue
    }

    if (localAddress.endsWith(`:${port}`)) {
      pids.add(pid)
    }
  }

  return [...pids]
}

async function main() {
  if (process.platform !== 'win32') {
    throw new Error('This script is intended for Windows.')
  }

  const { stdout } = await execFileAsync('netstat.exe', ['-ano', '-p', 'tcp'])
  const pids = getListeningPids(stdout)

  if (!pids.length) {
    console.log(`No process is listening on port ${port}.`)
    return
  }

  for (const pid of pids) {
    console.log(`Killing process ${pid} listening on port ${port}...`)
    await execFileAsync('taskkill.exe', ['/PID', pid, '/F'])
  }

  console.log(`Port ${port} is clear.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
