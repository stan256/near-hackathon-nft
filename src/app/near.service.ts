import {Injectable} from '@angular/core'
import {ConnectConfig, Contract, Near, WalletConnection} from "near-api-js"
import * as nearAPI from "near-api-js"

@Injectable({
  providedIn: 'root'
})
export class NearService {
  near: Near | undefined = undefined
  wallet: WalletConnection | undefined = undefined
  nftContract: any

  constructor() {
    nearAPI.connect(config).then(near => {
      this.near = near
      this.wallet = new WalletConnection(near, null)
      this.nftContract = new Contract(
        this.wallet.account(),
        CONTRACT,
        {
          changeMethods: ['nft_mint'],
          viewMethods: []
        }
      )
    })
  }

  mint(tokenId: string, ipfsLink: string, nftTitle: string, nftDescription: string) {
    let req = {
      token_id: tokenId,
      receiver_id: this.wallet?.account().accountId,
      token_metadata: {
        title: nftTitle,
        description: nftDescription,
        media: ipfsLink
      }
    }
    this.nftContract!.nft_mint(req, "300000000000000", "100000000000000000000000").then((a: any) => {
      console.log("Minted successfully")
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
