import { useState } from 'react';
import { Product } from '../App';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    onAddToCart(product, selectedSize);
    toast.success('Agregado al carrito');
    setSelectedSize('');
  };

  return (
    <Card className="overflow-hidden border-[#E8DED5] hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] overflow-hidden bg-[#F5EDE7]">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-[#6B5B52] mb-1">{product.name}</h3>
        <p className="text-sm text-[#A08679] mb-3">{product.description}</p>
        <p className="text-[#D4A59A]">Q{product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="border-[#E8DED5]">
            <SelectValue placeholder="Talla" />
          </SelectTrigger>
          <SelectContent>
            {product.sizes.map(size => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAddToCart}
          className="bg-[#D4A59A] hover:bg-[#C49588]"
        >
          Agregar
        </Button>
      </CardFooter>
    </Card>
  );
}
