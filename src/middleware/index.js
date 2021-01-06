import { WALLET_CONNECTED, WALLET_DISCONNECTED, WALLET_ACCOUNT_CHANGED, SMART_ACCOUNTS_LOADED } from '../constants'
import DSA from 'dsa-sdk'
import Web3 from 'web3'

const middleware = ({ dispatch }) => {
  return _next => {
    return async _action => {
      const { type, payload } = _action

      if (type === WALLET_CONNECTED) {
        const { account, provider } = payload
        const web3 = new Web3(provider)
        const dsa = new DSA(web3)
        const smartAccounts = await dsa.getAccounts(account)
        dispatch({
          type: SMART_ACCOUNTS_LOADED,
          payload: {
            smartAccounts
          }
        })
      }

      if (type === WALLET_DISCONNECTED) {
        // TODO
      }
      return _next(_action)
    }
  }
}

export { middleware }
