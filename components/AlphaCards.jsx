import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useEthers } from "../context/EthersContext";
import loadingIcon from "../public/BeanEater.svg"
// PENDIENTES
// Elegir entre mostrar cartas y comprar pack
// Mostrar NFT cuando se completa el album
// Mostrar errores

// const baseURI = "https://gateway.pinata.cloud/ipfs/QmZuSMk8d8Xru6J1PKMz5Gt6Qq8qVQ1Ak8p661zdGmGbGx/";
const storageUrl = "https://storage.googleapis.com/hunterspride/NOFJSON/T1/"; // 1.png to 60.png
const myAccount = "0x11b6fbD7cB2349281c3632faF2F2b6a03E4358a2";

const AlphaCards = () => {
  const { account, contract, connectContract } = useEthers();

  const [connected, setConnected] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [receiverAccount, setReceiverAccount] = useState("");
  const [cardToTransfer, setCardToTransfer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pack, setPack] = useState([]);
  const [error, setError] = useState("");
  const [packAmount, setPackAmount] = useState(0);
  const [seasonName, setSeasonName] = useState("temporada_1");

  const connect = () => {
    connectContract();
    setConnected(true);
    const elements = document.getElementsByClassName("when_connected_to_mm");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.toggle("alpha_display_none");
    }
  };

  useEffect(() => {
    const loadingElem = document.getElementById('loading')
    loading ? loadingElem.setAttribute('class', 'alpha_loading_elem') :
    loadingElem.setAttribute('class', 'alpha_loading_elem alpha_display_none')
  }, [loading])

  const comprarPack = (_amount, _name) => {
    const buyPack = async (_amount, _name) => {
      console.log({ _amount }, { _name })
      const pack = await contract.buyPack(_amount, _name);
      setLoading(true);
      await pack.wait();
      setLoading(false);
      return pack;
    };
    buyPack(_amount, _name)
      .then(data => {
        setPack(data)
        showCards(account, seasonName)
      })
      .catch(error => setError(error.reason))
  };

  const getUserCards = async (userAddress, seasonName) => {
    const cards = await contract.getCardsByUserBySeason(
      userAddress,
      seasonName
    );
    return cards;
  };

  const showCards = (userAddress, seasonName) => {
    getUserCards(userAddress, seasonName)
      .then((data) => {
        if(data.length){
          setPack(data)
          setError("")
        } else {
          setError("You need to buy a pack before!");
          setPack([])
        }
      })
      .catch((error) => console.log({ error }));
  };

  const pasteCard = async (card, album) => {
    const paste = await contract.pasteCards(card, album);
    setLoading(true);
    await paste.wait();
    showCards(account, seasonName)
    setLoading(false);
    return paste;
  };

  const checkInputAddress = (address) => {
    const hexa = "0123456789abcdefABCDEF";
    if (
      receiverAccount.length !== 42 ||
      receiverAccount[0] !== "0" ||
      receiverAccount[1] !== "x"
    ) {
      setAddressError(true);
      return false;
    }
    for (let i = 2; i < receiverAccount.length; i++) {
      if (!hexa.includes(receiverAccount[i])) {
        setAddressError(true);
        return false;
      }
    }
  };

  async function transferToken() {
    if (typeof window.ethereum !== "undefined") {
      try {
        if (!checkInputAddress(receiverAccount)) {
          console.log({ contract });
          console.log({ account }, { receiverAccount }, { cardToTransfer });

          const transaction = await contract[
            "safeTransferFrom(address,address,uint256)"
          ](account, receiverAccount, cardToTransfer);
          setAddressError(false);
          setLoading(true);
          await transaction.wait();
          showCards(account, seasonName);
          setLoading(false);
        }
      } catch (err) {
        console.log({ err });
      }
    }
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
      <img src={loadingIcon.src} className="alpha_loading_elem alpha_display_none" id="loading"/>
      {!account ? (
        <div>Loading...</div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="alpha_account">
            Bienvenido,{" "}
            {account &&
              account.substring(0, 6) +
                "..." +
                account.substring(37, account.length - 1)}
            !
          </div>
          <button
            className="alpha_button when_connected_to_mm"
            onClick={() => connect()}
          >
            CONECTAR CON NOF
          </button>

          <button
            className="alpha_button when_connected_to_mm alpha_display_none"
            onClick={() => showCards(account, seasonName)}
          >
            CARTAS
          </button>
          <input
            className="alpha_input when_connected_to_mm alpha_display_none"
            placeholder="Precio en DAI"
            onChange={(e) => {
              let value = e.target.value.toString() + "000000000000000000";
              setPackAmount(value);
            }}
            disabled={pack.length}
          />
          <button
            className="alpha_button when_connected_to_mm alpha_display_none"
            onClick={() =>
              comprarPack(ethers.BigNumber.from(packAmount), seasonName)
            }
            disabled={pack.length}
          >
            COMPRAR PACK
          </button>
          {error && <div className="alpha_error">{error}</div>}
          {pack.length > 0 ? (
            <div className="alpha_container">
              {pack.map((card, i) => {
                const collection = ethers.BigNumber.from(
                  card.collection
                ).toNumber();
                const completion = ethers.BigNumber.from(
                  card.completion
                ).toNumber();
                return card.number % 6 == 0 ? (
                  <div>
                    <div key={i} className="alpha_album_container">
                      <img
                        src={storageUrl + card.number + ".png"}
                        className="alpha_album"
                      />
                    </div>
                    <span>Progreso: {completion}/5</span>
                    <br></br>
                    col: {collection}
                  </div>
                ) : null;
              })}
              <div className="alpha_cards_container">
                {pack.map((card, i) => {
                  const collection = ethers.BigNumber.from(
                    card.collection
                  ).toNumber();
                  const isCollection = collection == ethers.BigNumber.from(pack[0].collection).toNumber();
                  const tokenId = ethers.BigNumber.from(
                    card.tokenId
                  ).toNumber();
                  const album = ethers.BigNumber.from(
                    pack[0].tokenId
                  ).toNumber();
                  return card.number % 6 !== 0 ? (
                    <div key={i}>
                      <div className="alpha_card_container">
                        <div className="alpha_card_hover">
                          <button
                            className="alpha_button"
                            onClick={() =>
                              pasteCard(tokenId, album)
                                .then(() => console.log("card pasted!"))
                                .catch((error) => console.log({ error }))
                            }
                            disabled={!isCollection}
                          >
                            PEGAR
                          </button>
                          <button
                            className="alpha_button"
                            onClick={() => {
                              setCardToTransfer(tokenId);
                              const modal = document.getElementsByClassName("alpha_transfer_modal")[0]
                              modal.setAttribute('class', 'alpha_transfer_modal')
                            }}
                          >
                            TRANSFERIR
                          </button>
                        </div>
                        <img
                          src={storageUrl + card.number + ".png"}
                          className="alpha_card"
                        />
                      </div>
                      col: {collection}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : (
            null
          )}
        </div>
      )}
      <div className="alpha_transfer_modal alpha_display_none">
        <div>
          {cardToTransfer ? `card to transfer: ${cardToTransfer}` : null}
        </div>
        <input
          placeholder="Address"
          onChange={(e) => setReceiverAccount(e.target.value)}
        />
        <button className="alpha_button" onClick={() => transferToken()}>
          TRANSFERIR
        </button>
      </div>
    </div>
  );
};

export default AlphaCards;
