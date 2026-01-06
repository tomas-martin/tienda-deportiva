import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  precioAnterior?: number;
  descuento?: number;
  categoria: string;
  imagen: string;
  valoraciones: number;
  stock: number;
}

interface CategoriaDestacada {
  nombre: string;
  icon: string;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Camiseta Pro Training',
      precio: 15000,
      precioAnterior: 20000,
      descuento: 25,
      categoria: 'Ropa',
      imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      valoraciones: 245,
      stock: 15
    },
    {
      id: 2,
      nombre: 'Short Deportivo Elite',
      precio: 12000,
      precioAnterior: 16000,
      descuento: 25,
      categoria: 'Ropa',
      imagen: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
      valoraciones: 189,
      stock: 20
    },
    {
      id: 3,
      nombre: 'Zapatillas RunSpeed X',
      precio: 45000,
      precioAnterior: 55000,
      descuento: 18,
      categoria: 'Calzado',
      imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      valoraciones: 432,
      stock: 8
    },
    {
      id: 4,
      nombre: 'Mochila SportPack 30L',
      precio: 18000,
      categoria: 'Accesorios',
      imagen: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      valoraciones: 156,
      stock: 25
    },
    {
      id: 5,
      nombre: 'Botella Térmica Pro',
      precio: 8000,
      precioAnterior: 10000,
      descuento: 20,
      categoria: 'Accesorios',
      imagen: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
      valoraciones: 98,
      stock: 50
    },
    {
      id: 6,
      nombre: 'Guantes Training Grip',
      precio: 9500,
      categoria: 'Accesorios',
      imagen: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400',
      valoraciones: 134,
      stock: 30
    },
    {
      id: 7,
      nombre: 'Pelota Fútbol Match',
      precio: 22000,
      precioAnterior: 28000,
      descuento: 21,
      categoria: 'Deportes',
      imagen: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aac?w=400',
      valoraciones: 276,
      stock: 12
    },
    {
      id: 8,
      nombre: 'Kit Pesas Ajustables',
      precio: 35000,
      categoria: 'Entrenamiento',
      imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      valoraciones: 198,
      stock: 10
    },
    {
      id: 9,
      nombre: 'Colchoneta Yoga Premium',
      precio: 14000,
      categoria: 'Entrenamiento',
      imagen: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      valoraciones: 167,
      stock: 18
    },
    {
      id: 10,
      nombre: 'Banda Elástica Set Pro',
      precio: 11000,
      precioAnterior: 14000,
      descuento: 21,
      categoria: 'Entrenamiento',
      imagen: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
      valoraciones: 143,
      stock: 22
    },
    {
      id: 11,
      nombre: 'Reloj Deportivo GPS',
      precio: 52000,
      precioAnterior: 65000,
      descuento: 20,
      categoria: 'Tecnología',
      imagen: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
      valoraciones: 389,
      stock: 6
    },
    {
      id: 12,
      nombre: 'Gorra Deportiva UV',
      precio: 7500,
      categoria: 'Accesorios',
      imagen: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400',
      valoraciones: 112,
      stock: 40
    }
  ];

  productosFiltrados: Producto[] = [];
  categoriaSeleccionada = 'Todos';
  
  categorias = ['Todos', 'Ropa', 'Calzado', 'Accesorios', 'Deportes', 'Entrenamiento', 'Tecnología'];
  
  categoriasDestacadas: CategoriaDestacada[] = [
    { nombre: 'Ropa Deportiva', icon: '👕', cantidad: 150 },
    { nombre: 'Calzado', icon: '👟', cantidad: 85 },
    { nombre: 'Accesorios', icon: '🎒', cantidad: 120 },
    { nombre: 'Equipamiento', icon: '⚽', cantidad: 95 },
    { nombre: 'Tecnología', icon: '⌚', cantidad: 45 },
    { nombre: 'Nutrición', icon: '🥤', cantidad: 78 }
  ];

  ngOnInit(): void {
    this.productosFiltrados = this.productos;
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    
    if (categoria === 'Todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(
        p => p.categoria === categoria
      );
    }
  }

  agregarAlCarrito(producto: Producto): void {
    // Aquí conectarás con tu servicio de carrito
    console.log('Producto agregado al carrito:', producto);
    
    // Ejemplo de notificación visual (puedes implementar un toast/snackbar)
    alert(`${producto.nombre} agregado al carrito!`);
  }
}