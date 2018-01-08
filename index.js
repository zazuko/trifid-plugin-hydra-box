const hydraBox = require('hydra-view')

function factory (router, configs) {
  return this.middleware.mountAll(router, configs, (config) => {
    if (config.documentation.indexOf('://') === -1) {
      config.documentation = 'file://' + config.documentation
    }

    return hydraBox.fromUrl(config.documentationUrl, config.documentation, config.options)
  })
}

module.exports = factory
