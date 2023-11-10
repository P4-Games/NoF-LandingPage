import { useContext } from 'react'
import { EthersContext } from '../context/EthersContext'

const useEthers = () => useContext(EthersContext)

export default useEthers
