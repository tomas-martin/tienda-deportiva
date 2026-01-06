import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class ProductosComponent {

  productos = [
    { nombre: 'Camiseta Futsal', precio: 15000 },
    { nombre: 'Short Deportivo', precio: 12000 },
    { nombre: 'Zapatillas Indoor', precio: 45000 }
  ];

}
