import {Injectable} from '@angular/core'
import {ConnectConfig, Near, WalletConnection} from "near-api-js"
import * as nearAPI from "near-api-js"

@Injectable({
  providedIn: 'root'
})
export class NearService {
  near: Near | undefined = undefined
  wallet: WalletConnection | undefined = undefined

  constructor() {
    nearAPI.connect(config).then(near => {
      this.near = near
      this.wallet = new WalletConnection(near, null)
      console.log("Near connected")
    })
  }

  signIn() {
    return this.wallet!.requestSignIn(CONTRACT, "Junkwin NFT collection")
  }

  signOut() {
    this.wallet!.signOut()
  }

  authenticated(): boolean {
    if (this.wallet) {
      return this.wallet!.isSignedIn()
    } else {
      return false
    }
  }
}

const CONTRACT: string = "dev-1650650317061-85967055700539"

let config: ConnectConfig = {
  networkId: "testnet",
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org"
}
