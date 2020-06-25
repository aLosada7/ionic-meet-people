import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CameraSource, Plugins } from '@capacitor/core';
import { Platform, ActionSheetController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

const { Camera } = Plugins

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

    @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

    @Output() authenticate = new EventEmitter();
    
    image;

    constructor(
        private plt: Platform,
        private actionSheetCtrl: ActionSheetController
        ) { }

    ngOnInit() {}

    signUp(form: NgForm) {
        if (!form.valid) {
            return;
        }

        const email = form.value.email;
        const password = form.value.password;

        this.authenticate.emit({ email, password, image: this.image })
    }

    async selectImageSource() {
        const buttons = [
            
        ];

        if (this.plt.is('hybrid')) {
            buttons.push({
                text: 'Take Photo',
                icon: 'camera',
                handler: () => {
                    this.addImage(CameraSource.Camera);
                }
            });
            buttons.push({
                text: 'Chose From Photos',
                icon: 'image',
                handler: () => {
                    this.addImage(CameraSource.Photos);
                }
            });
        } else {
            buttons.push({
                text: 'Choose a File',
                icon: 'attach',
                handler: () => {
                    this.fileInput.nativeElement.click();
                }
            });
        }

        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select Image Souce',
            buttons
        });
        await actionSheet.present();
    }

    uploadFile(event: EventTarget) {
        const eventObj: MSInputMethodContext = event as MSInputMethodContext;
        const target: HTMLInputElement = eventObj.target as HTMLInputElement;
        const file: File = target.files[0];

        console.log('file: ', file);

        this.image = file;
    }

    addImage(source: CameraSource) {

    }

}
