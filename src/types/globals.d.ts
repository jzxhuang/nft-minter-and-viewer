interface Window {
  contract?: any
  ethereum: Ethereumish
}

interface EthereumEvent {
  connect: unknown
  disconnect: unknown
  accountsChanged: Array<string>
  chainChanged: string
  message: unknown
}

type EthereumEventKeys = keyof EthereumEvent
type EthereumEventHandler<K extends EthereumEventKeys> = (event: EthereumEvent[K]) => void

/** From https://stackoverflow.com/questions/65504958/web3-js-extending-the-window-interface-type-definitions */
interface Ethereumish {
  autoRefreshOnNetworkChange: boolean
  chainId: string
  isMetaMask?: boolean
  isStatus?: boolean
  networkVersion: string
  selectedAddress: any

  on<K extends EthereumEventKeys>(event: K, eventHandler: EthereumEventHandler<K>): void
  removeListener<K extends EthereumEventKeys>(event: K, eventHandler: EthereumEventHandler<K>): void
  enable(): Promise<any>
  request: (request: { method: string; params?: Array<any> }) => Promise<any>
  /**
   * @deprecated
   */
  send?: (request: { method: string; params?: Array<any> }, callback: (error: any, response: any) => void) => void
  sendAsync: (request: unknown) => Promise<unknown>
}
