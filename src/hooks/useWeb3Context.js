import { useContext } from 'react'
import { Web3Context } from '../context/Web3Context'
// import { Web3Context } from '../context/Web3ContextNew'

const useWeb3Context = () => useContext(Web3Context)

export default useWeb3Context
