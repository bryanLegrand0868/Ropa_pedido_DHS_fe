import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
    message: string
    className?: string
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
    if (!message) return null

    return (
        <div className={cn("flex items-center gap-2 text-red-500 text-sm p-2 bg-red-50 rounded-md", className)}>
            <AlertCircle size={16} />
            <span>{message}</span>
        </div>
    )
}
