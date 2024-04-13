import {Component, EventEmitter, Input, Output} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {MatExpansionPanelActionRow} from "@angular/material/expansion";
import {NgForOf} from "@angular/common";
import {IClientData} from "../client";

@Component({
    selector: "client-action-row",
    standalone: true,
    imports: [
        MatButton,
        MatChipListbox,
        MatChipOption,
        MatExpansionPanelActionRow,
        NgForOf
    ],
    templateUrl: "./client-action-row.component.html",
    styleUrl: "./client-action-row.component.scss"
})
export class ClientActionRowComponent {

    @Input()
    public targetClients: IClientData[] = [];

    @Input()
    public client: IClientData | undefined;

    @Output()
    public deleteSelf: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public clearFieldsFromClient: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public encryptClient: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public decryptClient: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    public sendClient: EventEmitter<void> = new EventEmitter<void>();

    public changeTargetClientTo(client: IClientData): void {
        if (this.client) {
            this.client.sendingTo = client;
        }
    }

    public delete(): void {
        this.deleteSelf.emit();
    }

    public clearFields(): void {
        this.clearFieldsFromClient.emit();
    }

    public encrypt(): void {
        this.encryptClient.emit();
    }

    public decrypt(): void {
        this.decryptClient.emit();
    }

    public send(): void {
        this.sendClient.emit();
    }

    /**
     * Ist der Client nicht gesetzt, hat kein Ziel oder das Ziel keinen Schlüssel, so ist der Button deaktiviert.
     * Hat der Client kein eigenes Schlüsselpaar, so ist der Button deaktiviert. (Signatur nicht möglich)
     */
    public shouldDisableEncryptButton(): boolean {
        if (!this.client || !this.client.keyPair || !this.client.sendingTo) {
            return true;
        }
        return this.client.plaintext.length < 1 || !this.client.sendingTo.keyPair;
    }

    /**
     * Ist der Client nicht gesetzt, hat keinen Schlüssel oder keine Information über seinen Partner und dessen
     * Schlüsselpaar, so ist der Button deaktiviert.
     */
    public shouldDisableDecryptButton(): boolean {
        if (!this.client || !this.client.keyPair || !this.client.receivedFrom) {
            return true;
        }

        return this.client.ciphertext === undefined || !this.client.receivedFrom.keyPair;
    }

    /**
     * Ist der Client nicht gesetzt, hat keinen Zielclient oder keinen Ciphertext, so ist der Button deaktiviert.
     */
    public shouldDisableSendButton(): boolean {
        return !this.client || !this.client.sendingTo || this.client.ciphertext === undefined;
    }
}
