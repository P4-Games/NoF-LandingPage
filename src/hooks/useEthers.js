import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'

const useEthers = () => useContext(Web3Context)

export default useEthers
