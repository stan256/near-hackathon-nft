import {Component, OnInit} from '@angular/core'
import {NearService} from "./near.service"
import {StorageService} from "./storage.service"
import {ActivatedRoute} from "@angular/router"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  mintingFinished = false
  isLoading = false

  lastTransactionId: string | null = null
  fileToUpload: FileList | null = null
  nftTitle: string = ""
  nftDescription: string = ""

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const transactionHashes = params['transactionHashes']
      if (transactionHashes) {
        this.mintingFinished = true
        this.lastTransactionId = transactionHashes
      }
    })
  }

  constructor(private near: NearService,
              private storage: StorageService,
              private route: ActivatedRoute) {
  }

  async mint() {
    if (this.fileToUpload) {
      this.isLoading = true
      this.storage.awaitSaveFile(this.fileToUpload)
        .then(r => {
          console.log(`Minted: ${r!.cid}`)
          let imgLink = `https://${r!.cid}.ipfs.dweb.link/${this.fileToUpload?.item(0)!.name}`
          this.near.mint(r!.cid, imgLink, this.nftTitle, this.nftDescription)
        })
        .catch(console.error)
        .finally(() => this.isLoading = false)
    }
  }

  authenticated() {
    return this.near.authenticated()
  }

  handleFileInput(event: Event) {
    const element: HTMLInputElement = event.currentTarget as HTMLInputElement
    this.fileToUpload = element.files!
  }

  signIn() {
    this.near.signIn()
      .then(r => console.log(`User is signed in: ${r}`))
      .catch(console.error)
  }

  signOut() {
    this.near.signOut()
  }
}
