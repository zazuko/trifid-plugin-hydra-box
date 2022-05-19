import { middleware, Api } from 'hydra-box'
import { resolve } from 'path'

function toFile (pathStr) {
  return pathStr.startsWith('file:') ? pathStr : `file://${resolve(pathStr)}`
}

async function trifidFactory (trifid) {
  const { config } = trifid

  if (!config) {
    throw new Error('missing config')
  }

  if (!config.codePath) {
    throw new Error('missing codePath parameter')
  }

  if (!config.documentationFilePath) {
    throw new Error('missing documentationFilePath parameter')
  }

  const api = await Api.fromFile(toFile(config.documentationFilePath), {
    path: '/api',
    codePath: toFile(config.codePath)
  })

  return middleware(api, config)
}

export default trifidFactory
