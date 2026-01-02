import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function ErrorPopup({
  open,
  onClose,
  title = "Error",
  message,
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-sm text-muted-foreground">
          {message}
        </DialogDescription>

        <DialogFooter>
          <Button variant="destructive" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
