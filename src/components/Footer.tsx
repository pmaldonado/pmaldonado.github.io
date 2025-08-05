import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto px-6 sm:px-12 flex items-center">
      <div className="flex space-x-1">
        <a 
          href="https://github.com/pmaldonado" 
          className="p-1.5 text-2xl icon-highlight"
          target="_blank" 
          rel="noreferrer"
        >
          <Github size={32} />
        </a>
        <a 
          href="https://twitter.com/_malptr" 
          className="p-1.5 text-2xl icon-highlight"
          target="_blank" 
          rel="noreferrer"
        >
          <Twitter size={32} />
        </a>
        <a 
          href="https://www.linkedin.com/in/peterhmaldonado/" 
          className="p-1.5 text-2xl icon-highlight"
          target="_blank" 
          rel="noreferrer"
        >
          <Linkedin size={32} />
        </a>
      </div>
    </footer>
  );
}