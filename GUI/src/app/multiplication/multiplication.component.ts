import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BackendRequestService} from "../services/backend-api/backend-request.service";
import {KeyPair} from "../models/key-pair";
import {ConfigurationData} from "../models/configuration-data";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LoadingDialogComponent} from "../loading-dialog/loading-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MultiplicationRequest} from "../models/multiplication-request";

@Component({
    selector: "app-multiplication",
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatExpansionModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule],
    templateUrl: "./multiplication.component.html",
    styleUrl: "./multiplication.component.scss"
})
export class MultiplicationComponent {
    public modulusWidth: number = 2048;
    public millerRabinIterations: number = 100;
    public randomSeed: number = 34;

    public keyPair: KeyPair = KeyPair.createEmptyKeyPair();

    public parameterA: String = "";
    public parameterB: String = "";

    public parameterAEncrypted: String = "";
    public parameterBEncrypted: String = "";
    public resultEncrypted: String = "";
    public resultDecrypted: String = "";

    constructor(private backendRequestService: BackendRequestService,
                public dialog: MatDialog,
                private snackBar: MatSnackBar) {
    }

    /**
     * Fragt die Schlüsselerzeugung an und gibt das Ergebnis zurück.
     */
    public generateKeys(): void {
        let requestContent = new ConfigurationData(
            this.modulusWidth,
            this.millerRabinIterations,
            this.randomSeed,
            55296, // Dummy-Wert, weil das hierfür nicht relevant ist. Im gesamten Kontext wird
            // die Blockgröße nicht verwendet.
        );
        let loadingDialog = this.openLoadDialog();

        const startTime = Date.now();

        this.backendRequestService.createKeyPair(requestContent).then(
            (receivedKeyPair) => {
                const duration = Date.now() - startTime;
                this.keyPair = receivedKeyPair;
                loadingDialog.close();
                this.snackBar.open("Schlüsselpaar generiert. Dauer: " + duration + "ms", "Ok", {
                    duration: 5000,
                });
            }
        );
    }

    /**
     * Leert das Schlüsselpaar.
     */
    public clearKeyPair(): void {
        this.keyPair = KeyPair.createEmptyKeyPair();
    }

    /**
     * Löscht die Antwort.
     */
    public clearResponse(): void {
        this.parameterAEncrypted = "";
        this.parameterBEncrypted = "";
        this.resultEncrypted = "";
        this.resultDecrypted = "";
    }

    /**
     * Führt die Berechnung aus und gibt das Ergebnis zurück.
     */
    public calculate(): void {
        let loadingDialog = this.openLoadDialog();

        const startTime = Date.now();

        const body = new MultiplicationRequest(this.parameterA, this.parameterB, this.keyPair);

        this.backendRequestService.rsaMultiplication(body).then(
            (result) => {
                const duration = Date.now() - startTime;
                this.parameterAEncrypted = result.encrypted_factor_one;
                this.parameterBEncrypted = result.encrypted_factor_two;
                this.resultEncrypted = result.encrypted_result;
                this.resultDecrypted = result.decrypted_result;
                loadingDialog.close();
                this.snackBar.open("Berechnung durchgeführt. Dauer: " + duration + "ms", "Ok", {
                    duration: 5000,
                });
            }
        );
    }

    /**
     * Öffnet den Laden-Dialog.
     */
    public openLoadDialog(): MatDialogRef<LoadingDialogComponent> {
        return this.dialog.open(LoadingDialogComponent, {
            disableClose: true // Verhindert das Schließen durch den Benutzer
        });
    }


}
