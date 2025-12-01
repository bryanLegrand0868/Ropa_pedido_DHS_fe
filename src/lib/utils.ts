import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
    }).format(price)
}

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-GT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const compressImage = async (file: File): Promise<File> => {
    // Basic implementation - in a real app we might use a library like browser-image-compression
    // For now, we'll just return the file as is, but this placeholder exists for future expansion
    return file
}
