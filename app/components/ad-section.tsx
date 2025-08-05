"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Star, Shield, Zap } from "lucide-react"

interface AdSectionProps {
  title: string
  description: string
  type: "banner" | "card"
}

export default function AdSection({ title, description, type }: AdSectionProps) {
  if (type === "banner") {
    return (
      <div className="px-4">
        <Card className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyan-400/20 rounded-full">
                  <Zap className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                  <p className="text-cyan-100 text-sm">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white border-0">
                  Get Started
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4">
      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md border-indigo-400/30 hover:border-indigo-400/50 transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Shield className="h-5 w-5 text-indigo-400" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-indigo-100">{description}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white border-0">
                Learn More
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-indigo-400/50 text-indigo-200 hover:bg-indigo-500/20 bg-transparent"
              >
                Download App
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-indigo-300">
              <span>✓ Secure & Licensed</span>
              <span>✓ 24/7 Support</span>
              <span>✓ Low Fees</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
