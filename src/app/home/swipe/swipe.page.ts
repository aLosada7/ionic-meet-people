import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, NgZone } from '@angular/core';
import { GestureController, IonCard, Platform } from '@ionic/angular';

@Component({
  selector: 'app-swipe',
  templateUrl: 'swipe.page.html',
  styleUrls: ['swipe.page.scss']
})
export class SwipePage implements AfterViewInit{

    people = [
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
    ]

    cardArray;
    cardNumber: number;

    @ViewChildren(IonCard, {read: ElementRef}) cards: QueryList<ElementRef>;
    longPressActive = false;

    constructor(private gestureCtrl: GestureController, private zone: NgZone, private plt: Platform) {}

    ngAfterViewInit() {
            this.cardArray = this.cards.toArray();
            this.cardNumber = this.cardArray.length - 1;
            this.useSwipe(this.cardArray);
    }

    useSwipe(cardArray) {
        for (let i = 0; i < cardArray.length; i++) {
            const card = cardArray[i];

            const gesture = this.gestureCtrl.create({
                el: card.nativeElement,
                gestureName: 'swipe',
                onStart: ev => {
                    
                },
                onMove: ev => {
                    console.log('ev: ', ev);
                    card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
                    //this.setCardColor(ev.deltaX, card.nativeElement);
                },
                onEnd: ev => {
                    card.nativeElement.style.transition = '.5s ease-out';

                    if (ev.deltaX > 150) {
                        card.nativeElement.style.transform = `translateX(${this.plt.width() * 2}px) rotate(${ev.deltaX / 10}deg)`;
                        this.cardNumber--;
                    } else if (ev.deltaX < -150) {
                        card.nativeElement.style.transform = `translateX(-${+this.plt.width() * 2}px) rotate(${ev.deltaX / 10}deg)`;
                        this.cardNumber--;
                    } else {
                        card.nativeElement.style.transform = '';
                    }
                }
            });
            gesture.enable(true);
        }
    }

    swipeLeft() {
        const card = this.cardArray[this.cardNumber]
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.transform = `translateX(-${+this.plt.width() * 2}px) rotate(-90deg)`;

        this.cardNumber--;
    }

    swipeRight() {
        const card = this.cardArray[this.cardNumber]
        card.nativeElement.style.transition = '.5s ease-out';
        card.nativeElement.style.transform = `translateX(${this.plt.width() * 2}px) rotate(90deg)`;

        this.cardNumber--;
    }



}
