import LiveComponent from "@/app/components/ui/liveComponent"
import Header from "@/app/components/ui/header"
import Footer from "@/app/components/ui/footer"
import Background from "./components/ui/background"
import Disclaimer from "./components/disclaimer-component"
import InformationComponent from "./components/information-component"
import DashboardClient from "./components/dashboard-client"

export default function USDTBOBExchange() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden">
      <Background />

      <div className="relative max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="text-center space-y-3 pt-2">
          <Header />
          <LiveComponent />
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            COTIZACIÓN USDT/BOB
          </h1>
        </div>

        <DashboardClient />

        {/* Info Section - Moved to bottom */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
          <InformationComponent/>
          <Disclaimer/>
        </div>
        <Footer />
      </div>
    </div>
  )
}
