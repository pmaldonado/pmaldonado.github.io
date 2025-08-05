import headshot from './assets/headshot.jpeg'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="min-h-screen text-[#3C280D]" 
         style={{ 
           fontFamily: '"Hoefler Text", "Times New Roman", serif',
           backgroundColor: '#fdf9f1',
           backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")',
           backgroundRepeat: 'repeat'
         }}>
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-12 mt-12">
          <img 
            src={headshot} 
            alt="Headshot of Peter" 
            className="rounded-full w-60 float-right ml-4 mb-6 -mt-12 md:block hidden"
          />
          <img 
            src={headshot} 
            alt="Headshot of Peter" 
            className="rounded-full w-40 sm:w-50 mx-auto mb-6 block md:hidden"
          />
          
          <h1 className="text-5xl md:text-6xl font-normal mb-2 tracking-tight">
            Peter Maldonado
          </h1>
          
          <h2 className="text-2xl font-normal leading-snug tracking-tight mb-4">
            I like AI, scientific progress, and effective governance.
          </h2>
          
          <h2 className="text-2xl font-normal leading-snug tracking-tight mb-4">
            I'm a machine learning engineer at{' '}
            <a 
              href="https://www.ello.com/" 
              className="link-highlight"
            >
              Ello
            </a>
            , where we're building an AI tutor for every child.
            Previously, I was a research fellow in the{' '}
            <a 
              href="https://reglab.stanford.edu/" 
              className="link-highlight"
            >
              RegLab
            </a>
            {' ' }at Stanford Law School and worked across startups and big tech.
          </h2>
          
          <h2 className="text-2xl font-normal leading-snug tracking-tight mb-4">
            In my spare time, I take photos of the sunset, ride trains, and enjoy long walks around SF.
          </h2>
          
          <h2 className="text-2xl font-normal leading-snug tracking-tight mb-8">
            If any of that sounds interesting, reach out via{' '}
            <a 
              href="mailto:foxes_phage_4x@icloud.com" 
              className="link-highlight"
            >
              email
            </a>
            {' '}or{' '}
            <a 
              href="https://twitter.com/_malptr" 
              className="link-highlight"
            >
              X
            </a>
            .
          </h2>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
