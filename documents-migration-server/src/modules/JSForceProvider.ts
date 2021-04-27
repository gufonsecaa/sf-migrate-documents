import jsforce, { Connection } from 'jsforce'

class JSForceProvider {
  async createInstance(config): Promise<Connection> {
    const connection = new jsforce.Connection({
      ...config.oauth2
    })

    const { username, password, securityToken } = config.userInfo

    try {
      await connection.login(username, password+securityToken)

      return connection
    } catch (error) {
      console.log(error)
    }
  }
}

const jsForceConnection = new JSForceProvider()

export { jsForceConnection }
