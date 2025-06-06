import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatAnchor} from "@angular/material/button";
import {Comida} from "../comida/comida.model";
import {ComidaService} from "../comida/service/comida.service";
import {ComidaComponent} from "../comida/component/comida.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faFacebook, faInstagram, faLinkedin, faXTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatAnchor,
    ComidaComponent,
    FaIconComponent
  ],
  templateUrl: './home.component.html',
  standalone: true
})
export class HomeComponent implements OnInit {
  protected comidas: Comida[] = [];

  constructor(private comidaService: ComidaService) {
  }

  ngOnInit() {
    this.comidaService.getDestacadas().subscribe({
      next: (data) => {
        this.comidas = data.slice(0, 3) ?? [];
      },
      error: (error) => {
        console.error('Error al obtener las comidas', error);
      }
    });
  }

  protected readonly faFacebook = faFacebook;
  protected readonly faInstagram = faInstagram;
  protected readonly faXTwitter = faXTwitter;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faYoutube = faYoutube;
}
