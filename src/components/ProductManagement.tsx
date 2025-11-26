import { useState } from 'react';
import { Product } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductManagementProps {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, product: Product) => void;
}

export function ProductManagement({ products, addProduct, deleteProduct, updateProduct }: ProductManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    sizes: 'XS,S,M,L,XL'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      sizes: 'XS,S,M,L,XL'
    });
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
      category: formData.category,
      sizes: formData.sizes.split(',').map(s => s.trim())
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, product);
      toast.success('Producto actualizado');
    } else {
      addProduct(product);
      toast.success('Producto agregado');
    }

    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      sizes: product.sizes.join(',')
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct(id);
      toast.success('Producto eliminado');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#6B5B52]">Gestión de Productos</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#D4A59A] hover:bg-[#C49588]">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#D4A59A]">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name" className="text-[#6B5B52]">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-[#E8DED5]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-[#6B5B52]">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="border-[#E8DED5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-[#6B5B52]">Precio *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="border-[#E8DED5]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-[#6B5B52]">Categoría *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="border-[#E8DED5]"
                    placeholder="Ej: Blusas, Vestidos"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image" className="text-[#6B5B52]">URL de Imagen</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="border-[#E8DED5]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <Label htmlFor="sizes" className="text-[#6B5B52]">Tallas (separadas por comas)</Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  className="border-[#E8DED5]"
                  placeholder="XS,S,M,L,XL"
                />
              </div>

              <Button type="submit" className="w-full bg-[#D4A59A] hover:bg-[#C49588]">
                {editingProduct ? 'Actualizar' : 'Agregar'} Producto
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden border-[#E8DED5]">
            <div className="aspect-[3/4] overflow-hidden bg-[#F5EDE7]">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-[#6B5B52]">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#A08679] mb-2">{product.description}</p>
              <p className="text-[#D4A59A] mb-2">${product.price.toFixed(2)}</p>
              <p className="text-sm text-[#A08679]">Categoría: {product.category}</p>
              <p className="text-sm text-[#A08679]">Tallas: {product.sizes.join(', ')}</p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(product)}
                className="flex-1 border-[#D4A59A] text-[#D4A59A]"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(product.id)}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 text-[#A08679]">
          No hay productos. Agrega el primero usando el botón "Nuevo Producto"
        </div>
      )}
    </div>
  );
}
