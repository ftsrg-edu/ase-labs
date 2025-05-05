import { useMemo } from 'react'
import Loading from './components/common/Loading'
import { Message } from 'primereact/message'
import { Menubar } from 'primereact/menubar'
import reactSvg from './assets/react.svg'
import { Avatar } from 'primereact/avatar'
import AuctionHome from './components/auction-home/AuctionHome'
import { MenuItem } from 'primereact/menuitem'
import useNavigation from './hooks/useNavigation'
import useNetwork from './hooks/useNetwork'
import useClient from './hooks/useClient'
import SimpleAuctionPage from './components/auction-page/simple-auction/SimpleAuctionPage'
import BlindAuctionPage from './components/auction-page/blind-auction/BlindAuctionPage'

enum AppState {
    INITIALIZING, // Loading
    WALLET_NOT_AVAILABLE, // There is no wallet installed
    USER_NOT_AVAILABLE, // The app is not allowed to access the wallet
    WRONG_NETWORK, // The factory is not deployed to the selected network
    INITIALIZED // Wallet is ready, network is OK
}

function App() {
    const [page, auction, navigate] = useNavigation()

    const [network, networkIsLoading] = useNetwork()
    const [client, clientIsLoading] = useClient()

    // The state of the app
    const state = useMemo(() => {
        if ((!network && networkIsLoading) || (!client && clientIsLoading)) {
            return AppState.INITIALIZING
        } else if (!window.ethereum) {
            return AppState.WALLET_NOT_AVAILABLE
        } else if (network === null) {
            return AppState.WRONG_NETWORK
        } else if (client === null) {
            return AppState.USER_NOT_AVAILABLE
        } else {
            return AppState.INITIALIZED
        }
    }, [network, client, networkIsLoading, clientIsLoading])

    return (
        <div className="w-full p-3 mx-auto flex flex-column justify-content-start gap-4" style={{ maxWidth: '960px' }}>
            <Menubar
                start={
                    <div className="flex align-items-center gap-2 mr-2">
                        <img src={reactSvg} />
                    </div>
                }
                model={[
                    {
                        label: 'Home',
                        icon: 'pi pi-home',
                        url: '/',
                        command: (e) => {
                            e.originalEvent.preventDefault()
                            navigate('home', null)
                        }
                    } as MenuItem
                ].concat(
                    page !== 'home'
                        ? [
                              {
                                  label: 'Auction',
                                  icon: 'pi pi-hammer',
                                  url: window.location.pathname,
                                  command: (e) => {
                                      e.originalEvent.preventDefault()
                                  }
                              }
                          ]
                        : []
                )}
                end={
                    <div className="flex align-items-center gap-2 ml-2">
                        <span>{client?.account?.address}</span>
                        <Avatar shape="circle" icon="pi pi-user" />
                    </div>
                }
                className="bg-white"
            />
            {state === AppState.INITIALIZING && <Loading />}
            {state === AppState.WALLET_NOT_AVAILABLE && (
                <Message severity="error" text="There is no wallet available!" className="w-full" />
            )}
            {state === AppState.USER_NOT_AVAILABLE && (
                <Message
                    severity="error"
                    text="The selected wallet does not exist or this app does not have permission to access it!"
                    className="w-full"
                />
            )}
            {state === AppState.WRONG_NETWORK && (
                <Message severity="warn" text="The contracts are not deployed on this network!" className="w-full" />
            )}
            {state === AppState.INITIALIZED && client && network && (
                <>
                    {page === 'home' && <AuctionHome navigate={navigate} />}
                    {page === 'simple' && auction && <SimpleAuctionPage auctionAddress={auction} />}
                    {page === 'blind' && auction && <BlindAuctionPage auctionAddress={auction} />}
                </>
            )}
        </div>
    )
}

export default App
