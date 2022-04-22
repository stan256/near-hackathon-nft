import {Component} from '@angular/core'
import {NearService} from "./near.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fileToUpload: File | null = null;

  constructor(private near: NearService) { }

  mint() {
  }

  authenticated() {
    return this.near.authenticated()
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
