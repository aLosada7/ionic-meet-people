import { environment } from './../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    localId: string,
    expiresIn: string,
    registered?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
    public _user = new BehaviorSubject<User>(null);
    private activeLogoutTimer: any;

    get userIsAuthenticated() {
        return this._user.asObservable().pipe(map(user => {
            if (user) {
                return !!user.token;
            } else {
                return false;
            }
        }));
    }

    get userId() {
        return this._user.asObservable().pipe(map(user => {
            if (user) {
                return user.id;
            } else {
                return null;
            }
        }));
    }

    constructor(
        private http: HttpClient,
        private router: Router,
        private storage: AngularFireStorage) {}

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`, {
            email,
            password,
            returnSecureToken: true
        }).pipe(tap(response => {
            const expirationTime = new Date(new Date().getTime() + (+response.expiresIn * 1000));
            this.storeAuthData(response.localId, response.idToken, response.email, expirationTime.toISOString());
            const user = new User(response.localId, response.email, response.idToken, expirationTime)
            this._user.next(user);
            this.autoLogout(user.tokenDuration);
        }));
    }

    signUp(email: string, password: string, image: File) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`, {
            email,
            password,
            returnSecureToken: true
        }).pipe(tap(async response => {
            const expirationTime = new Date(new Date().getTime() + (+response.expiresIn * 1000));
            this.storeAuthData(response.localId, response.idToken, response.email, expirationTime.toISOString());
            const user = new User(response.localId, response.email, response.idToken, expirationTime);
            await this.uploadImage(image);
            this._user.next(user);
            this.autoLogout(user.tokenDuration);
        }));
    }

    async uploadImage(image: File) {
        const randomId = Math.random()
        .toString(36)
        .substring(2, 8);

        const uploadTasK = this.storage.upload(`files/${new Date().getTime()}_${randomId}`, image);

        uploadTasK.percentageChanges().subscribe(changes => {
            console.log(changes);
        });

        uploadTasK.then(async res => {
            console.log(res);
        })
    }

    autoLogin() {
        return from(Promise.resolve().then(function () {
                return window.localStorage.getItem("userAuth");
            }))
            .pipe(
                map(storedData => {
                    if (!storedData) {
                        return null;
                    }

                    const parsedData = JSON.parse(storedData) as { token: string, userId: string, email:string, tokenExpirationDate: string};
                    const expirationTime = new Date(parsedData.tokenExpirationDate);
                    if (expirationTime <= new Date()) {
                        return null;
                    }
                    const user = new User(parsedData.userId, parsedData.email, parsedData.token, expirationTime);
                    return user;
                }),
                tap(user => {
                    if (user) {
                        this._user.next(user);
                        this.autoLogout(user.tokenDuration);
                    }
                }),
                map(user => {
                    return !!user;
                })
            );
    }

    autoLogout(duration: number) {
        if (this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer);
        }
        this.activeLogoutTimer = setTimeout(() => {
            this.logout();
        }, duration);
    }

    logout() {
        if (this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer);
        }
        window.localStorage.removeItem("userAuth");
        this._user.next(null);
        this.router.navigateByUrl('/auth');
    }

    private storeAuthData(userId: string, token: string, email: string, tokenExpirationDate: string) {
        let storage = window.localStorage;
        const data = JSON.stringify({
            userId,
            token,
            email,
            tokenExpirationDate
        });
        storage.setItem('userAuth', data);
    }

    ngOnDestroy() {
        clearTimeout(this.activeLogoutTimer);
    }
}
