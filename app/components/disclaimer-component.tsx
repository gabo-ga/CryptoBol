import { Badge } from "@/app/components/ui/badge"

export default function Disclaimer() {
  return (
    <>
      <p className="text-blue-200 text-sm">
        Precios puedes varias segun ciertos factores y exchanges.
      </p>
      <Badge variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
        Solo para uso informativo
      </Badge>
    </>
  )
}
