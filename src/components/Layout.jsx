import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  )
}

export default Layout