import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    className?: string
    size?: number
}

export const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
    return (
        <div className="flex justify-center items-center p-4">
            <Loader2
                className={cn("animate-spin text-primary", className)}
                size={size}
            />
        </div>
    )
}
