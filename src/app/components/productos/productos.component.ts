// src/app/components/productos/productos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService, Producto } from '../../services/supabase.service';

interface CategoriaDestacada {
  nombre: string;
  icon: string;
  cantidad: number;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriaSeleccionada = 'Todos';
  cargando = true;
  error: string | null = null;
  
  categorias = ['Todos', 'Ropa', 'Calzado', 'Accesorios', 'Deportes', 'Entrenamiento', 'Tecnología'];
  
  categoriasDestacadas: CategoriaDestacada[] = [
    { nombre: 'Ropa Deportiva', icon: '👕', cantidad: 150 },
    { nombre: 'Calzado', icon: '👟', cantidad: 85 },
    { nombre: 'Accesorios', icon: '🎒', cantidad: 120 },
    { nombre: 'Equipamiento', icon: '⚽', cantidad: 95 },
    { nombre: 'Tecnología', icon: '⌚', cantidad: 45 },
    { nombre: 'Nutrición', icon: '🥤', cantidad: 78 }
  ];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.cargarProductos();
  }

  async cargarProductos(): Promise<void> {
    try {
      this.cargando = true;
      this.error = null;
      
      this.productos = await this.supabaseService.obtenerProductos();
      this.productosFiltrados = this.productos;
      
      console.log('Productos cargados:', this.productos.length);
    } catch (err) {
      this.error = 'Error al cargar los productos. Por favor, intenta de nuevo.';
      console.error('Error:', err);
    } finally {
      this.cargando = false;
    }
  }

  async filtrarPorCategoria(categoria: string): Promise<void> {
    this.categoriaSeleccionada = categoria;
    this.cargando = true;
    
    try {
      if (categoria === 'Todos') {
        this.productosFiltrados = await this.supabaseService.obtenerProductos();
      } else {
        this.productosFiltrados = await this.supabaseService.obtenerProductosPorCategoria(categoria);
      }
    } catch (err) {
      console.error('Error filtrando productos:', err);
      this.error = 'Error al filtrar productos';
    } finally {
      this.cargando = false;
    }
  }

  agregarAlCarrito(producto: Producto): void {
    console.log('Producto agregado al carrito:', producto);
    alert(`${producto.nombre} agregado al carrito!`);
  }
}