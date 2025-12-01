import { Button } from '@/components/common/Button'
import { cn } from '@/lib/utils'

interface ProductFiltersProps {
    categories: string[]
    selectedCategory: string | null
    onSelectCategory: (category: string | null) => void
}

export const ProductFilters = ({
    categories,
    selectedCategory,
    onSelectCategory
}: ProductFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-8">
            <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => onSelectCategory(null)}
                className={cn("rounded-full", selectedCategory === null && "bg-primary text-white")}
            >
                Todos
            </Button>

            {categories.map((category) => (
                <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => onSelectCategory(category)}
                    className={cn("rounded-full", selectedCategory === category && "bg-primary text-white")}
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
