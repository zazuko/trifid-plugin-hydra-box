import assert from 'assert'
import withServer from 'express-as-promise/withServer.js'
import { describe, it } from 'mocha'
import trifidFactory from '../index.js'
import getStream from 'get-stream'
import assertThrows from 'assert-throws-async'

function createTrifidConfig (config, loggerSpy = []) {
  return {
    logger: str => loggerSpy.push(str),
    config
  }
}

describe('trifid-plugin-hydra-box', () => {
  describe('trifid factory', () => {
    it('should be a factory', () => {
      assert.strictEqual(typeof trifidFactory, 'function')
    })

    it('errors if no argument is given', async () => {
      const trifid = createTrifidConfig()
      await assertThrows(async () => {
        await trifidFactory(trifid)
      }, Error, /missing config/)
    })

    it('errors if no documentationFilePath is given', async () => {
      const trifid = createTrifidConfig({
        codePath: '/codePath'
      })
      await assertThrows(async () => {
        await trifidFactory(trifid)
      }, Error, /missing documentationFilePath parameter/)
    })

    it('errors if no codePath is given', async () => {
      const trifid = createTrifidConfig({
        documentationFilePath: '/documentationFilePath',
      })
      await assertThrows(async () => {
        await trifidFactory(trifid)
      }, Error, /missing codePath parameter/)
    })

    it('should create a middleware with factory and default options', async () => {
      const trifid = createTrifidConfig({
        codePath: '/codePath',
        documentationFilePath: '/documentationFilePath',
        loader: () => {}
      })
      const middleware = await trifidFactory(trifid)
      assert.strictEqual(typeof middleware, 'function')
    })
  })

  describe('middleware', () => {
    it('can execute', async () => {
      await withServer(async server => {
        const logs = []
        const trifid = createTrifidConfig({
          codePath: './does_not_exist.ttl',
          documentationFilePath: './does_not_exist.ttl',
          loader: () => {}
        })
        const middleware = await trifidFactory(trifid)
        server.app.use(middleware)

        const res = await server.fetch('/')
        const bodyStr = await getStream(res.body)
        assert.strictEqual(bodyStr.indexOf('html') > 0, true)
      })
    })
  })
})
