export interface Product {
  id_producto?: number;
  fk_categoria: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  precio: number;
  stock: number;
  fecha_de_creacion?: Date;
}
