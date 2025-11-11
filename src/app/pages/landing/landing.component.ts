import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { PopularItemsComponent } from '../../components/popular-items/popular-items.component';
import { PromotionsComponent } from '../../components/promotions/promotions.component';

@Component({
  selector: 'app-landing',
  imports: [
    HeroComponent,
    PopularItemsComponent,
    PromotionsComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

}
