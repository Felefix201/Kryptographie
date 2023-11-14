import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClientComponent} from "../client/client.component";
import {AliceRoutingModule} from "./alice-routing.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-alice',
  standalone: true,
    imports: [
      CommonModule,
      ClientComponent,
      AliceRoutingModule,
      MatFormFieldModule,
      MatInputModule
    ],
  templateUrl: './alice.component.html',
  styleUrl: './alice.component.css'
})
export class AliceComponent {
  public name: string = "Alice"
  public cipherText: string = "";
  public plainText: string = "";
  public signature: string = "";
  public privateExponent: string = "";
}
