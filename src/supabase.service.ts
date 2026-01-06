import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  precio_anterior?: number;
  descuento?: number;
  categoria: string;
  imagen: string;
  valoraciones: number;
  stock: number;
  descripcion?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Obtener todos los productos
  async obtenerProductos(): Promise<Producto[]> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }

    return data || [];
  }

  // Obtener productos por categoría
  async obtenerProductosPorCategoria(categoria: string): Promise<Producto[]> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('categoria', categoria)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error obteniendo productos por categoría:', error);
      return [];
    }

    return data || [];
  }

  // Obtener un producto por ID
  async obtenerProductoPorId(id: number): Promise<Producto | null> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error obteniendo producto:', error);
      return null;
    }

    return data;
  }

  // Buscar productos
  async buscarProductos(termino: string): Promise<Producto[]> {
    const { data, error } = await this.supabase
      .from('productos')
      .select('*')
      .ilike('nombre', `%${termino}%`);

    if (error) {
      console.error('Error buscando productos:', error);
      return [];
    }

    return data || [];
  }

  // Agregar producto (solo admin)
  async agregarProducto(producto: Producto): Promise<Producto | null> {
    const { data, error } = await this.supabase
      .from('productos')
      .insert([producto])
      .select()
      .single();

    if (error) {
      console.error('Error agregando producto:', error);
      return null;
    }

    return data;
  }

  // Actualizar producto (solo admin)
  async actualizarProducto(id: number, producto: Partial<Producto>): Promise<boolean> {
    const { error } = await this.supabase
      .from('productos')
      .update(producto)
      .eq('id', id);

    if (error) {
      console.error('Error actualizando producto:', error);
      return false;
    }

    return true;
  }

  // Eliminar producto (solo admin)
  async eliminarProducto(id: number): Promise<boolean> {
    const { error } = await this.supabase
      .from('productos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando producto:', error);
      return false;
    }

    return true;
  }

  // Suscribirse a cambios en productos (tiempo real)
  suscribirseAProductos(callback: (payload: any) => void) {
    return this.supabase
      .channel('productos_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'productos' },
        callback
      )
      .subscribe();
  }
}