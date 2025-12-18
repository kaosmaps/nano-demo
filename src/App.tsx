import { BackgroundEffects } from './components/BackgroundEffects'
import { Header } from './components/Header'
import { DemoGrid } from './components/DemoGrid'
import { Footer } from './components/Footer'
import { AdminPanelProvider, AdminPanel } from './components/admin'
import demosData from './data/demos.json'
import type { Demo } from './types'

function App() {
  const demos = demosData.demos as Demo[]

  return (
    <AdminPanelProvider>
      <div className="relative min-h-screen flex flex-col">
        <BackgroundEffects />

        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Header />

          <main className="pb-12">
            <DemoGrid demos={demos} />
          </main>

          <Footer />
        </div>

        {/* Admin Panel - Fixed position bottom-left */}
        <AdminPanel />
      </div>
    </AdminPanelProvider>
  )
}

export default App
