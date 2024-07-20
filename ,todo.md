- issue alpha
- recursividad con notificaciones
- linter errors
- setear versión en dev con el commit y en main con el tag

- Problema: rate limit con la url del provider de rpc (teníamos tenderly)
- origen del problema: las notificaciones (navbar)
- workaround: deshabilité las notificaciones y cambié el provider a rpc1 (por las dudas, para que nos banee el dominio).
- Solución definitiva: Pendiente

temp/temp-1

En esta versión del componente:

fetchSeasonData y fetchAlbums se encargan de manejar las solicitudes para los datos de la temporada y los álbumes, respectivamente, y se usan useCallback para evitar recreaciones innecesarias.
Se agrega el uso de useMemo y useCallback para funciones y valores que se reutilizan frecuentemente.
Se aseguran que los useEffect solo se ejecuten cuando es necesario.
Se agrupan las actualizaciones del estado para reducir el número de renderizaciones.

---

---

**status**

---

---

**Mejoras / bugs**

**landing**

_DOING_

_TODO_

- mejora (reportado por magnus, 13-02-2024): Por otro lado, sigue la situación (apenas visual), que cuando se sale de revizar una figura, no retorna a la página en que se estaba, sino siempre a la página 2

- bug: sw: Uncaught (in promise) TypeError: Failed to execute 'addAll' on 'Cache': Request failed.

- revisa lo de pwa en config, que da error en el build (actions), lo tira como warning.

- mejora: agregar notificación al mintear carta

- mejora: (reportada por magnus, 29-12-2023)
  La visualización del borde Gris del marco que se ve en el álbum, sería bueno que también se aplicará en los marcos de las figuras al momento de colocar figuras para intercambio.
  Cuando se escogen para intercambio, se conserva el marco azul

- mejora: [ ] #303: Recordar idioma seleccionado por el usuario

- FEAT: [ ] #304: Indicar en las cartas las ofertas de otros usuarios

- FEAT: [ ] #305: Match de cartas de oferta en selección de intercambio

- FEAT: [] #306: Ranking de wallets con más álbums

- FEAT: [] #307: Ranking de wallets por carta

- FEAT: [] #308: ver álbums completados o quemados (persistencia en bdd)

- FEAT: [] #309: Identificación de cartas Shiny

- change: meter notificación de winner asociada al evento de venta del último pack (indicando si fuiste ganador o no)

_BACKLOG_

- mejora: #310: Evita efecto de refresh en el click de la carta al quemar

- fix: al transferir un album, se pierde los textos de las cantidades

- mejora: Poder enviar error al team de desarrollo (con la api de next js, tomar de AD, para envío de mails)

- FEAT: Poder scanear un qr en el control de transferir (card, pack) (para mobile)

- mejora: El numerito 120 y 121, pisa la imagen (bajar un toque para esas dos cartas)

- mejora: Agregar notificación de cuando alguien te transfiere fondos (ojo qu eno tenés evento, como te enteras? tiene evento el erc20 de eso?)

- mejora web3 modal

  - al estar cargando, si ya esta conectado, muestra los botones de conectar unos segundos y luego el album. Ver de usar el "isConnecting" para evitar ese efecto.
  - al hacer casmbio de wallet, no te refresca los datos en gamma (queda conectada la wallet anterior)
  - i18n
  - algunas redes no soportan el switch_network: Error switching network Error: Request method wallet_switchEthereumChain is not supported
  - si vas desconectando las redes, cuando desconectas la útlima da error
  - no detecta cuando desconectas la cuenta desde metamask
    -- https://docs.walletconnect.com/web3modal/react/components

- mejora. revisar por qué no te lleva a la página de offline cuando das de baja los servicios de internet

- esta volviendo a salir el efecto de redibujo de una pagina abajod el book.

- mejora: al recibir eventos, que actualice el contexto de datos (además de las notificaciones)

- mejora: or qué al darle refresh, sigue mostrando las notificaicones? (ver si es por el sstate, usar localStorage en la pagina directamente)

- mejora: cuando alguien confirma el inventario, si luego el owner de la oferta, abre ésta, ya no se la muestra, pero al cerrar el infoCard, el inventario no está actualizado (le sigue mostrando en su poder la carta de la oferta y no le muestra nueva que recibió)

- mejora: cuando le das refresh (f5), si estás conectado que vaya al libro directamente (tendrías que levantar la wallet de localhost, creo que ya lo hace el otro contexto, esperar hasta tener el otro contexsto)

- mejora: header, menu mobile: agregar para mobile un header con el menu de 3 rallitas, que combine sound, idioma y wallet. Tal vez dehar en el centro el "NoF"

- mejora: mover las ofertas a contexto

- mejora: sacar lo de wallet y contratos fuera de los main, y mostrar un componente de noContectado

- mejora: Evitar que choque el movimiento de pagina, al hacer click en las figuritas que están enlas 4 esquinas

- mejora: Mostrar el el inventario del usuario TODAS las cartas que tiene oferta (?) - hoy muestra solo muestra de las cartas que tiene el user en su inventario. (quedaría deprecado con la nueva pantalla de ofertas)

- mejora: cuando entras a jugar con varios, el openPack demora

- mejora: Los estilos de los modales (transfer card, transfer pack, etc.; ejemplo, como el transfer de alpha y al menos, ajustar los colores a los modales como el el trasnfer de alpha)

- mejora: Igualar estilos modales / llevar al estilo del sitio (ver ejemplo en modales de alpha)

- mejora: en caso de tener que re-desplegar contrato, proba en local si podes hacer export/import de datos (vía script), habrá algo en la web?

* mejora: arreglar el tema de cuando se desconecta y cambia de red
  https://socket.dev/npm/package/@web3-onboard/react
  https://stackoverflow.com/questions/71569214/error-error-must-initialize-before-using-hooks
  https://onboard.blocknative.com/docs/modules/react#usesetlocale
* FEAT: Armar pantalla para ver todas las notificacions (o scrollear) y re-activar el "ver todo"

- mejora: ver por qué se actualiza el book cuando tocas las acciones en notificaciones (tema de uso de contexto?)
- error: en la api matcher, para bsc, da un revert, problemas del endpoint del RPC? http://localhost:3000/api/match?w1=0xcdf7658B1cACf7b6b31F285126039b048d2D2823&w2=0x35dad65F60c1A32c9895BE97f6bcE57D32792E83

**SC**

_TODO_

    * [ ] #104: Incorporar método de sorteo al comprar el último pack
      (Este album otorga un numero "Ticket" de loteria que se sorteara al finzalizar la venta del ultimo sobre entre todos los tickets disponibles. El pool que se gana aquel suertudo es un % que se va acumulando por cada compra.)
      - Revisar el getLotteryWinner, falta un require para verificar que el ticket random este en la col y comprar si ese ticker randome estsa ok, dado que no incluye al user, que si se contempla al generar el ticket!
      - Crear una funcion en contrato de packs de Lottery o "sortear ticket"
      - la funcion se tiene que llamar en buPack y buyPacks si se alcanzo el máximo de sobres
      - Esa funcion obtiene el ticket del contrato de tickets y valida que tenga algo
      - obtiene el pricezebalnace del contrato del contrato de carta y el % a pagar en la lotgeria
      - verifica que haya saldo suficiente para la transferencia (como hace hoy _tranferPrizesAmounts)
      - realiza la transferencia
      - resta el monto del contrato de cartas
      - emite evento de ticketSorteado o loteriaRealizada
      - generar los tests: quema de cartas 60, generación de tickets, que desaparezca el album de 60, sorteo

_BACKLOG_

- feat: identificar las cartas shiny

- mejora: hacer upgradeable los contratos

  - ver si se peude eliminar el constructor de cards por lo de ERC20
  - volver a ver video de patrick
  - agrega lo de upgrade

- mejora: ver de actualizar todo a ethers 6 y hardhat-ethers v3

- proxy: Revisar este blog, que tiene un monton de cosas por hacer antes de pasar a proyx:
  https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable

---

nof dev: https://develop-nof-landing-7bteynlhua-uc.a.run.app/
react icons preview fc: https://react-icons.github.io/react-icons/icons/fc/
gitmoji.dev / commit, icons

feat: Una nueva característica para el usuario.
fix: Arregla un bug que afecta al usuario.
perf: Cambios que mejoran el rendimiento del sitio.
build: Cambios en el sistema de build, tareas de despliegue o instalación.
ci: Cambios en la integración continua.
docs: Cambios en la documentación.
refactor: Refactorización del código como cambios de nombre de variables o funciones.
style: Cambios de formato, tabulaciones, espacios o puntos y coma, etc; no afectan al usuario.
test: Añade tests o refactoriza uno existente.
chore: Other changes that don't modify src or test files
revert: Reverts a previous commit

---

---

**commit_msgs**

sc update mumbai addresses:
git commit -m "[chore] :wrench: update mumbai addresses"

**mumbai-wallets**

cuenta dev1 mumbai: 0x35dad65F60c1A32c9895BE97f6bcE57D32792E83
cuenta 2 mumbai: 0x117b706DEF40310eF5926aB57868dAcf46605b8d

**hardhat-wallets**

Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

Account #3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (10000 ETH)
Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6

Account #4: 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 (10000 ETH)
Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a

Account #5: 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc (10000 ETH)
Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba

Account #6: 0x976EA74026E726554dB657fA54763abd0C3a0aa9 (10000 ETH)
Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e

Account #7: 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955 (10000 ETH)
Private Key: 0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356

Account #8: 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f (10000 ETH)
Private Key: 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97

Account #9: 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720 (10000 ETH)
Private Key: 0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

Account #10: 0xBcd4042DE499D14e55001CcbB24a551F3b954096 (10000 ETH)
Private Key: 0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897

Account #11: 0x71bE63f3384f5fb98995898A86B02Fb2426c5788 (10000 ETH)
Private Key: 0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82

Account #12: 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a (10000 ETH)
Private Key: 0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1

Account #13: 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec (10000 ETH)
Private Key: 0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd

Account #14: 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097 (10000 ETH)
Private Key: 0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa

Account #15: 0xcd3B766CCDd6AE721141F452C550Ca635964ce71 (10000 ETH)
Private Key: 0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61

Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0

Account #17: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E (10000 ETH)
Private Key: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0

Account #19: 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199 (10000 ETH)
Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e

**beta testers wallets**

Aleop 0xa0B12ebA61C11E1fE08057562A1373FbE352CFB1
Ndawin 0xfA30E6c039277562E5231eB5684aA44351310A88
Juanse 0xaEEdb1c33B2E4d6a4a1509fCd795dd97B550358E
MAGNUS 0x1A9df03FC2E04aeB661e885D918a73620B664A67
Powder 0x4722bC41FEc3885EA72dA4961DA823E6365BBc4c
Mage Hernán 0xedD31e732EA38E95f0637634FE1EBb3Ca5055979
P4 troy 0xCd432d93ADb30fAD8BcFdB1913BECE3F1D8C6f73
Ingeniero 0xCCca402f251b8f9c002B4fb19BC1E31F7579079F
Xhaira 0xA345bc4a3C3145D4965400AD08089fA9926054b0
Nachito 0x5FAF012e3A20932472531004B7661B203673aDdF
Valen 0x314D71a85a9cef2b49B872A0d88F5a4e0e466DdF, 0xC935343cA00F660D97E85E253fE3Ac561eA67ACA
SDKFelgrand: 0x12428d5688b0ec18CE352F4DD5a778909b5BA7B7
derchef07: 0xb06918785F88c54D23B7116F4a12386499592557
HaseoMisakiR: 0x6E8895d04077bf563e5aaE333eA004ef4B4A13A1
festi: 0xa1Ba1e315EB3bB5958170CC49cec29EeC391EAE7

---

---

# contract deploys (mumbai)

## 20231206

NEXT_PUBLIC_DAI_ADDRESS='0xdf302B697a0F6f3CEAB0624a4db2445a4B830043'
NEXT_PUBLIC_ALPHA_ADDRESS='0xC7F14830D02A6C50df31B33DF1CaBb1A87A59bAc'
NEXT_PUBLIC_GAMMA_PACKS_ADDRESS='0x420a83ABB2286255d529BB8AdB43071B2e8f148d'
NEXT_PUBLIC_GAMMA_CARDS_ADDRESS='0xCD1c83a7d2EbAF06052c1d8A14397834303e8368'
NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS='0x78842c8D8F1a695bb151bCa187af6cBD28250e3D'

## 20231205

NEXT_PUBLIC_DAI_ADDRESS='0xF0F01CEd79B4Acf577E5864A690b268Ef4a11575'
NEXT_PUBLIC_ALPHA_ADDRESS='0xD25734a632005EeD4D26f7D4269D1c6D347d82C7'
NEXT_PUBLIC_GAMMA_PACKS_ADDRESS='0x1788D58b65A39e54308807A6aF46a186E626f41f'
NEXT_PUBLIC_GAMMA_CARDS_ADDRESS='0x87eF0d14aBA7C495d6844689d912777Aea6BcA5c'
NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS='0x2ABCCF3EbE6F4E74050182BdaED76F11654F5e2E'

## 20231126

NEXT_PUBLIC_DAI_ADDRESS='0x291FaB5F25B87d1672452aE28dcEB1b8Cd2F82f7'
NEXT_PUBLIC_ALPHA_ADDRESS='0x643A6255Fe5aBdb26f43296284F535219E6dD13C'
NEXT_PUBLIC_GAMMA_PACKS_ADDRESS='0xFC24dFdb838b4544b91436F93da70d2B2476b634'
NEXT_PUBLIC_GAMMA_CARDS_ADDRESS='0xb2da44Bd77e922142F3Ef20504826e83D4e9fc0C'
NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS='0xc2E8cEE4dC93F24b9Bc70A100083C0A6075694cE'

## 20231124

NOF_DAI_CONTRACT_CURRENT_ADDRESS='0x291FaB5F25B87d1672452aE28dcEB1b8Cd2F82f7'
NOF_ALPHA_CONTRACT_CURRENT_ADDRESS='0x643A6255Fe5aBdb26f43296284F535219E6dD13C'
NOF_GAMMA_PACKS_CONTRACT_CURRENT_ADDRESS='0xFC24dFdb838b4544b91436F93da70d2B2476b634'
NOF_GAMMA_CARDS_CONTRACT_CURRENT_ADDRESS='0xb2da44Bd77e922142F3Ef20504826e83D4e9fc0C'
NOF_GAMMA_OFFERS_CONTRACT_CURRENT_ADDRESS='0x18537721EDfdEa2060640314BD996672E0DB921D'

---

mongodump --uri "mongodb+srv://cloud:kSfwcgHL3y3A@nof.f14znpg.mongodb.net/nofys" -o .
mongodump --uri "mongodb+srv://cloud:kSfwcgHL3y3A@nof.f14znpg.mongodb.net/nombre_de_tu_base_de_datos" -o .
mongodump --uri "mongodb+srv://cloud:kSfwcgHL3y3A@nof.f14znpg.mongodb.net/sample_mflix" -o .

---
