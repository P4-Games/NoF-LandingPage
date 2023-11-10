import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'

const useWeb3 = () => useContext(Web3Context)

export default useWeb3
