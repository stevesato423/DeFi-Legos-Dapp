import {
  OPTION_SELECTED,
  OPTION_DELETED,
  OPTIONS_REORDERED,
  SET_OPTION_INPUTS,
  SET_OPTION_ORDER,
  BUILD_FAILED,
  BUILD_SUCEEDED,
  RESET_BUILD_ERROR
} from '../../constants'
import store from '../../store'
import { v4 as uuidv4 } from 'uuid'
import DSA from 'dsa-sdk'
import Web3 from 'web3'

const selectOption = _option => {
  return {
    type: OPTION_SELECTED,
    payload: {
      option: {
        ..._option,
        id: uuidv4() // NOTE: ovewrite id in order to have it unique
      }
    }
  }
}

const deleteOption = _option => {
  /*const options = store.getState().buildStrategy.options
  const optionToDelete = options.indexOf(({ id }) => _id === id)
  

  const newOptions = */

  return {
    type: OPTION_DELETED,
    payload: {
      options: store.getState().buildStrategy.options.filter(({ id }) => _option.id !== id)
    }
  }
}

const resetBuildError = () => {
  return {
    type: RESET_BUILD_ERROR
  }
}

const setOptionInputs = (_inputs, _optionToUpdate) => {
  const options = store.getState().buildStrategy.options
  return {
    type: SET_OPTION_INPUTS,
    payload: {
      options: options.map(_option => (_optionToUpdate.id === _option.id ? { ..._option, inputs: _inputs } : _option))
    }
  }
}

const setOptionOrder = (_order, _optionToUpdate) => {
  const options = store.getState().buildStrategy.options
  return {
    type: SET_OPTION_ORDER,
    payload: {
      options: options.map(_option => (_optionToUpdate.id === _option.id ? { ..._option, order: _order } : _option))
    }
  }
}

const reorderOptions = (_startIndex, _endIndex) => {
  const result = store.getState().buildStrategy.options
  const [removed] = result.splice(_startIndex, 1)
  const options = result.splice(_endIndex, 0, removed)

  return {
    type: OPTIONS_REORDERED,
    payload: {
      options
    }
  }
}

const buildAndExecute = () => {
  return async _dispatch => {
    try {
      const options = store.getState().buildStrategy.options
      const provider = store.getState().wallet.provider
      const smartAccount = store.getState().wallet.smartAccounts
      const web3 = new Web3(provider)
      const dsa = new DSA(web3)
      dsa.setInstance(smartAccount[0].id)

      const withFlashloan = Boolean(
        options.find(({ method, name }) => name === 'instapool_v2' && method === 'flashBorrowAndCast')
      )

      const spells = dsa.Spell()

      options
        .sort((_a, _b) => _a.order - _b.order)
        .forEach(({ method, name, inputs, args, additionalArgs, argsType }) => {
          if (!inputs) throw new Error('Invalid Input')

          const fixedInputs = Array(args.length + additionalArgs.length).fill('0')
          for (let i = 0; i < inputs.length; i++) fixedInputs[i] = inputs[i] ? inputs[i] : '0'

          const realArgs = argsType.map((_type, _index) => {
            switch (_type) {
              case 'address': {
                const address = dsa.tokens.info[fixedInputs[_index].toLowerCase()].address
                if (!address) {
                  throw new Error('Invalid token')
                }
                return address
              }
              default:
                return fixedInputs[_index]
            }
          })

          spells.add({
            connector: name,
            method,
            args: realArgs
          })
        })

      if (withFlashloan) {
        const flashloanSpell = dsa.Spell()
        flashloanSpell.add(spells.data[0])

        if (spells.data[0].connector !== 'instapool_v2' && spells.data[0].method !== 'flashBorrowAndCast')
          throw new Error('Flashloan position is wrong')

        const spellsToEncodeElements = spells.data.slice(1, spells.length)
        const spellsToEncode = dsa.Spell()
        spellsToEncodeElements.forEach(_spell => spellsToEncode.add(_spell))

        const calldata = dsa.instapool_v2.encodeFlashCastData(spellsToEncode)
        flashloanSpell.data[0].args[flashloanSpell.data[0].args.length - 1] = calldata

        await dsa.cast(flashloanSpell)

        /*_dispatch({
          type: BUILD_SUCEEDED,
          payload: {
            promiEvent: dsa.cast(flashloanSpell)
          }
        })*/
      } else {
        return {
          type: 'TODO',
          payload: {
            TODO: 'TODO'
          }
        }
      }
    } catch (_err) {
      console.log(_err)
      _dispatch({
        type: BUILD_FAILED,
        payload: {
          error: _err.message ? _err.message : _err
        }
      })
    }
  }
}

export { selectOption, deleteOption, reorderOptions, setOptionInputs, buildAndExecute, resetBuildError, setOptionOrder }
