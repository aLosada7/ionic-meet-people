import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class HeroService {
    _people = new BehaviorSubject([
        {
            name: 'Max Lynch',
            img: 'https://pbs.twimg.com/profile_images/953978653624455170/j91_AYfd_400x400.jpg',
            age: 22,
            power: 0
        },
        {
            name: 'Ben Sperry',
            img: 'https://pbs.twimg.com/profile_images/953978653624455170/j91_AYfd_400x400.jpg',
            age: 22,
            matches: 0
        },
        {
            name: 'Mike Harrington',
            img: 'https://pbs.twimg.com/profile_images/953978653624455170/j91_AYfd_400x400.jpg',
            age: 22,
            matches: 0
        }
    ]);

    get people () {
        return this._people.asObservable();
    }
  
    constructor() { }
    
  }