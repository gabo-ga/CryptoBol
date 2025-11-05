import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"


export default function InformationComponent() {
    return (
        <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Información del mercado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                <span>Precio directo desde Binance</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full flex-shrink-0"></div>
                <span>Actualización cada minuto</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200 text-sm">
                <div className="w-2 h-2 bg-indigo-400 rounded-full flex-shrink-0"></div>
                <span>Precio en tiempo real</span>
              </div>
            </CardContent>
          </Card>
    )
    }