-- Tabla de Productos
CREATE TABLE productos (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  precio_anterior DECIMAL(10, 2),
  descuento INTEGER,
  categoria TEXT NOT NULL,
  imagen TEXT NOT NULL,
  valoraciones INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_precio ON productos(precio);
CREATE INDEX idx_productos_stock ON productos(stock);

-- Tabla de Categorías
CREATE TABLE categorias (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL,
  icon TEXT,
  cantidad INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Usuarios (extendiendo auth.users)
CREATE TABLE perfiles_usuarios (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nombre_completo TEXT,
  telefono TEXT,
  direccion TEXT,
  ciudad TEXT,
  provincia TEXT,
  codigo_postal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Pedidos
CREATE TABLE pedidos (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente', -- pendiente, procesando, enviado, entregado, cancelado
  metodo_pago TEXT,
  direccion_envio JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Items de Pedido
CREATE TABLE items_pedido (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT REFERENCES pedidos NOT NULL,
  producto_id BIGINT REFERENCES productos NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Carrito
CREATE TABLE carrito (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users NOT NULL,
  producto_id BIGINT REFERENCES productos NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(usuario_id, producto_id)
);

-- Tabla de Reseñas
CREATE TABLE resenas (
  id BIGSERIAL PRIMARY KEY,
  producto_id BIGINT REFERENCES productos NOT NULL,
  usuario_id UUID REFERENCES auth.users NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(producto_id, usuario_id)
);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION actualizar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER trigger_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_perfiles_updated_at
  BEFORE UPDATE ON perfiles_usuarios
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

CREATE TRIGGER trigger_carrito_updated_at
  BEFORE UPDATE ON carrito
  FOR EACH ROW
  EXECUTE FUNCTION actualizar_updated_at();

-- Políticas de seguridad RLS (Row Level Security)
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE items_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;

-- Productos: lectura pública, escritura solo admin
CREATE POLICY "Productos visibles para todos"
  ON productos FOR SELECT
  USING (true);

CREATE POLICY "Solo admin puede insertar productos"
  ON productos FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Solo admin puede actualizar productos"
  ON productos FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Perfiles: cada usuario ve y edita solo su perfil
CREATE POLICY "Usuarios ven su propio perfil"
  ON perfiles_usuarios FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuarios actualizan su propio perfil"
  ON perfiles_usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Pedidos: cada usuario ve solo sus pedidos
CREATE POLICY "Usuarios ven sus propios pedidos"
  ON pedidos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios crean sus propios pedidos"
  ON pedidos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Carrito: cada usuario maneja solo su carrito
CREATE POLICY "Usuarios ven su propio carrito"
  ON carrito FOR ALL
  USING (auth.uid() = usuario_id);

-- Reseñas: lectura pública, escritura autenticada
CREATE POLICY "Reseñas visibles para todos"
  ON resenas FOR SELECT
  USING (true);

CREATE POLICY "Usuarios autenticados crean reseñas"
  ON resenas FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

-- Insertar datos de ejemplo
INSERT INTO categorias (nombre, icon, cantidad) VALUES
  ('Ropa', '👕', 150),
  ('Calzado', '👟', 85),
  ('Accesorios', '🎒', 120),
  ('Deportes', '⚽', 95),
  ('Entrenamiento', '🏋️', 110),
  ('Tecnología', '⌚', 45);

-- Productos de ejemplo
INSERT INTO productos (nombre, precio, precio_anterior, descuento, categoria, imagen, valoraciones, stock, descripcion) VALUES
  ('Camiseta Pro Training', 15000, 20000, 25, 'Ropa', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 245, 15, 'Camiseta de alto rendimiento con tecnología de secado rápido'),
  ('Short Deportivo Elite', 12000, 16000, 25, 'Ropa', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', 189, 20, 'Short cómodo y flexible para entrenamientos intensos'),
  ('Zapatillas RunSpeed X', 45000, 55000, 18, 'Calzado', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 432, 8, 'Zapatillas de running con amortiguación superior'),
  ('Mochila SportPack 30L', 18000, NULL, NULL, 'Accesorios', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 156, 25, 'Mochila espaciosa con compartimentos organizados'),
  ('Botella Térmica Pro', 8000, 10000, 20, 'Accesorios', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 98, 50, 'Mantiene tus bebidas frías por 24h y calientes por 12h'),
  ('Guantes Training Grip', 9500, NULL, NULL, 'Accesorios', 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400', 134, 30, 'Guantes con agarre superior para levantamiento'),
  ('Pelota Fútbol Match', 22000, 28000, 21, 'Deportes', 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aac?w=400', 276, 12, 'Pelota profesional de fútbol tamaño oficial'),
  ('Kit Pesas Ajustables', 35000, NULL, NULL, 'Entrenamiento', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', 198, 10, 'Set de pesas ajustables de 2.5kg a 24kg'),
  ('Colchoneta Yoga Premium', 14000, NULL, NULL, 'Entrenamiento', 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 167, 18, 'Colchoneta extra gruesa antideslizante'),
  ('Banda Elástica Set Pro', 11000, 14000, 21, 'Entrenamiento', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400', 143, 22, 'Set de 5 bandas con diferentes resistencias'),
  ('Reloj Deportivo GPS', 52000, 65000, 20, 'Tecnología', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400', 389, 6, 'Smartwatch deportivo con GPS y monitor cardíaco'),
  ('Gorra Deportiva UV', 7500, NULL, NULL, 'Accesorios', 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', 112, 40, 'Gorra con protección UV50+');