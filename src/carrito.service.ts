import { Injectable, signal, computed } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  // Señales para manejo reactivo del carrito
  private itemsCarrito = signal<ProductoCarrito[]>([]);
  
  // Computados derivados
  public items = this.itemsCarrito.asReadonly();
  
  public totalItems = computed(() => 
    this.itemsCarrito().reduce((sum, item) => sum + item.cantidad, 0)
  );
  
  public totalPrecio = computed(() => 
    this.itemsCarrito().reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  );

  constructor() {
    // Cargar carrito desde localStorage al iniciar
    this.cargarCarritoDesdeStorage();
  }

  // Agregar producto al carrito
  agregarProducto(producto: any): void {
    const items = this.itemsCarrito();
    const existente = items.find(item => item.id === producto.id);

    if (existente) {
      // Si ya existe, incrementar cantidad
      this.actualizarCantidad(producto.id, existente.cantidad + 1);
    } else {
      // Si no existe, agregar nuevo
      const nuevoItem: ProductoCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        imagen: producto.imagen,
        categoria: producto.categoria
      };
      
      this.itemsCarrito.update(items => [...items, nuevoItem]);
    }

    this.guardarCarritoEnStorage();
    this.mostrarNotificacion(`${producto.nombre} agregado al carrito`);
  }

  // Eliminar producto del carrito
  eliminarProducto(id: number): void {
    this.itemsCarrito.update(items => items.filter(item => item.id !== id));
    this.guardarCarritoEnStorage();
    this.mostrarNotificacion('Producto eliminado del carrito');
  }

  // Actualizar cantidad de un producto
  actualizarCantidad(id: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarProducto(id);
      return;
    }

    this.itemsCarrito.update(items =>
      items.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    );

    this.guardarCarritoEnStorage();
  }

  // Incrementar cantidad
  incrementarCantidad(id: number): void {
    const item = this.itemsCarrito().find(i => i.id === id);
    if (item) {
      this.actualizarCantidad(id, item.cantidad + 1);
    }
  }

  // Decrementar cantidad
  decrementarCantidad(id: number): void {
    const item = this.itemsCarrito().find(i => i.id === id);
    if (item) {
      this.actualizarCantidad(id, item.cantidad - 1);
    }
  }

  // Vaciar carrito
  vaciarCarrito(): void {
    this.itemsCarrito.set([]);
    this.guardarCarritoEnStorage();
    this.mostrarNotificacion('Carrito vaciado');
  }

  // Obtener cantidad de un producto específico
  obtenerCantidadProducto(id: number): number {
    const item = this.itemsCarrito().find(i => i.id === id);
    return item ? item.cantidad : 0;
  }

  // Verificar si un producto está en el carrito
  productoEnCarrito(id: number): boolean {
    return this.itemsCarrito().some(item => item.id === id);
  }

  // Guardar carrito en localStorage
  private guardarCarritoEnStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('sportpro_carrito', JSON.stringify(this.itemsCarrito()));
    }
  }

  // Cargar carrito desde localStorage
  private cargarCarritoDesdeStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const carritoGuardado = localStorage.getItem('sportpro_carrito');
      if (carritoGuardado) {
        try {
          const items = JSON.parse(carritoGuardado);
          this.itemsCarrito.set(items);
        } catch (error) {
          console.error('Error cargando carrito:', error);
          this.itemsCarrito.set([]);
        }
      }
    }
  }

  // Mostrar notificación simple (puedes mejorar con un toast service)
  private mostrarNotificacion(mensaje: string): void {
    // Implementar aquí tu sistema de notificaciones
    // Por ahora, solo console.log
    console.log('Notificación:', mensaje);
    
    // Alternativa simple con alert (solo para desarrollo)
    // alert(mensaje);
  }

  // Calcular descuento si aplica
  calcularDescuento(): number {
    const total = this.totalPrecio();
    
    // Ejemplo: 10% de descuento en compras mayores a $50,000
    if (total > 50000) {
      return total * 0.1;
    }
    
    return 0;
  }

  // Calcular costo de envío
  calcularEnvio(): number {
    const total = this.totalPrecio();
    
    // Envío gratis en compras mayores a $50,000
    if (total > 50000) {
      return 0;
    }
    
    // Envío estándar
    return 5000;
  }

  // Total final con descuentos y envío
  totalFinal(): number {
    const subtotal = this.totalPrecio();
    const descuento = this.calcularDescuento();
    const envio = this.calcularEnvio();
    
    return subtotal - descuento + envio;
  }
}