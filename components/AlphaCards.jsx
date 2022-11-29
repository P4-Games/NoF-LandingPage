import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useEthers } from "../context/EthersContext";

// PENDIENTES
// Comprar pack
//    - Elegir la temporada (dropdown con temporadas creadas?)
// Mostrar cartas del usuario (+ recibidas por transfer?)
// Pegar cartas en el album
// Transferir cartas

// const baseURI = "https://gateway.pinata.cloud/ipfs/QmZuSMk8d8Xru6J1PKMz5Gt6Qq8qVQ1Ak8p661zdGmGbGx/";
const storageUrl = "https://storage.googleapis.com/hunterspride/NOFJSON/T1/" // 1.png to 60.png
const myAccount = "0x11b6fbD7cB2349281c3632faF2F2b6a03E4358a2";

const AlphaCards = () => {

  const { account, contract, connectContract } = useEthers();
  
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pack, setPack] = useState([])
  const [error, setError] = useState("")
  const [packAmount, setPackAmount] = useState(0)
  const [seasonName, setSeasonName] = useState("")

  const loadingTags = () => {
    return (
      <div>Loading...</div>
    )
  }

  const connect = () => {
    connectContract()
    setConnected(true)
  }

  const buyPack = async (_amount, _name) => {
    const pack = await contract.buyPack(_amount, _name)
    setLoading(true)
    await pack
    setLoading(false)
    return pack
  }

  const getUserCards = async (userAddress, seasonName) => {
    const cards = await contract.getCardsByUserBySeason(userAddress, seasonName)
    return cards
  }

  const showCards = (userAddress, seasonName) => {
    getUserCards(userAddress, seasonName)
      .then((data) => {
        data.length > 0 ? setPack(data) : setError("You need to buy a pack before!")
      })
      .catch(error => console.log({ error }))
  }

  const pasteCard = async (card, album) => {
    const paste = await contract.pasteCards(card, album);
    setLoading(true)
    await paste
    setLoading(false)
    return paste
  }

  return (
    <div
      className="alpha"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="alpha_account">{account && account.substring(0,6) + "..." + account.substring(37, account.length-1)}</div>
      <button className="alpha_button" onClick={() => showCards(account, "temporada_1")} disabled={pack.length}>VER MIS CARTAS</button>
      <button className="alpha_button" onClick={() => connect()} disabled={connected}>CONECTAR</button>
      <button className="alpha_button" onClick={() => buyPack(ethers.BigNumber.from("10000000000000000000"), "temporada_1").then(() => console.log("pack bought")).catch(error => console.log({error}))} disabled={pack.length}>BUY PACK</button>
      {!account ? (
        <div>Loading...</div>
      ) : (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}>
          {pack.length > 0 ? (<div className="alpha_container">
          {pack.map((card, i) => {
            const collection = ethers.BigNumber.from(card.collection).toNumber()
            const completion = ethers.BigNumber.from(card.completion).toNumber()
            return card.number % 6 == 0 ? (              
              <div>
                <div key={i} className="alpha_album_container">
                  <img src={storageUrl + card.number + ".png"} className="alpha_album"/>
                </div>
                completion: {completion}

                <br></br>
                col: {collection}
              </div>
            ) : null
          })}
          <div className="alpha_cards_container">
          {pack.map((card, i) => {
            const collection = ethers.BigNumber.from(card.collection).toNumber()
            const tokenId = ethers.BigNumber.from(card.tokenId).toNumber()
            const album = ethers.BigNumber.from(pack[0].tokenId).toNumber()
              return card.number % 6 !== 0 ? (
                <div>
                <div key={i} className="alpha_card_container">
                  <div className="alpha_card_hover">
                    <button className="alpha_button" onClick={() => pasteCard(tokenId, album).then(() => console.log("card pasted!")).catch(error => console.log({error}))}>PEGAR</button>
                    <button className="alpha_button">TRANSFERIR</button>
                  </div>
                  <img src={storageUrl + card.number + ".png"} className="alpha_card"/>
                </div>
                  col: {collection}
                </div>
              ) : (
                  null
              )
            })}
          </div>
            
          </div>) : <div>{error}</div>
          }
        </div>
      )}
    </div>
  );
};

export default AlphaCards;
