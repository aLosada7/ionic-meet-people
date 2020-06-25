import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, NavController } from '@ionic/angular';

import { AuthService, AuthResponseData } from './auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
    isLoading = false;
    isLogin = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('kind')) {
                this.navCtrl.navigateBack('/landing');
                return;
            }

            this.isLogin = paramMap.get('kind') === 'in';
        });
    }

    authenticate(user: any) {

        const email = user.email;
        const password = user.password;

        this.loadingCtrl
        .create({ keyboardClose: true, message: this.isLogin ? 'Logging in...' : 'Singing Up...' })
        .then(loadingEl => {
            loadingEl.present();
            let authObs: Observable<AuthResponseData>;
            if (this.isLogin) {
                    // Log in
                    authObs = this.authService.login(email, password);
                } else {
                    // Sign up
                    authObs = this.authService.signUp(email, password, user.image);
                }

                authObs.subscribe(resData => {
                    console.log(resData);
                    this.isLoading = false;
                    loadingEl.dismiss();
                    this.router.navigateByUrl('/home');
                }, error => {
                    const code = error.error.error.message;
                    let message = 'Could not sign up. Please try again.'
                    if (code === 'EMAIL_EXISTS') {
                        message = 'This email address already exists.'
                    } else if (code === 'EMAIL_NOT_FOUND') {
                        message = 'This email address could not be found.';
                    } else if (code === 'INVALID_PASSWORD') {
                        message = 'This password is not correct. Please, try again.'
                    }
                    loadingEl.dismiss();
                    this.showAlert(message);
                })
        });
    }

    private showAlert(message: string) {
        this.alertCtrl.create({ header: 'Authentication failed', message, buttons: ['Okay'] }).then(alertEl => alertEl.present())
    }

    onSwitchAuthMode() {
        this.isLogin = !this.isLogin;
    }
}
