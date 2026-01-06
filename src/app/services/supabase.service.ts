// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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
    try {
      const { data, error } = await this.supabase
        .from('productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      return [];
    }
  }

  // Obtener productos por categoría
  async obtenerProductosPorCategoria(categoria: string): Promise<Producto[]> {
    try {
      const { data, error } = await this.supabase
        .from('productos')
        .select('*')
        .eq('categoria', categoria)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      return [];
    }
  }

  // Obtener un producto por ID
  async obtenerProductoPorId(id: number): Promise<Producto | null> {
    try {
      const { data, error } = await this.supabase
        .from('productos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      return null;
    }
  }

  // Buscar productos
  async buscarProductos(termino: string): Promise<Producto[]> {
    try {
      const { data, error } = await this.supabase
        .from('productos')
        .select('*')
        .ilike('nombre', `%${termino}%`);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error buscando productos:', error);
      return [];
    }
  }
}