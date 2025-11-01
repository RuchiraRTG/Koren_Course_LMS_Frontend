import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer({ logoSrc, logoAlt = 'Company Logo', logoWidth = 'w-32' }) {
  return (
    <footer className="bg-black text-gray-300 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Company Info Section */}
          <div className="space-y-2">
            {logoSrc && (
              <img 
                src={logoSrc} 
                alt={logoAlt}
                className={`${logoWidth} h-auto object-contain`}
              />
            )}
            <p className="text-xs leading-relaxed">
              Empowering education through innovative learning management solutions.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3 pt-1">
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-sm">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="/" className="text-sm hover:text-primary-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/about" className="text-sm hover:text-primary-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="/courses" className="text-sm hover:text-primary-400 transition-colors">Courses</a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-primary-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-sm">Resources</h3>
            <ul className="space-y-1">
              <li>
                <a href="/faq" className="text-sm hover:text-primary-400 transition-colors">FAQ</a>
              </li>
              <li>
                <a href="/blog" className="text-sm hover:text-primary-400 transition-colors">Blog</a>
              </li>
              <li>
                <a href="/support" className="text-sm hover:text-primary-400 transition-colors">Support</a>
              </li>
              <li>
                <a href="/docs" className="text-sm hover:text-primary-400 transition-colors">Documentation</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-2 text-sm">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary-400" />
                <a href="tel:+1234567890" className="text-sm hover:text-primary-400 transition-colors">+1 (234) 567-890</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-primary-400 mt-0.5" />
                <a href="mailto:info@koren.com" className="text-sm hover:text-primary-400 transition-colors">info@koren.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-primary-400 mt-0.5" />
                <span className="text-sm">123 Education Lane<br />Learning City, LC 12345</span>
              </li>
            </ul>
          </div>

        </div>

        
        {/* Divider */}
        <div className="border-t border-gray-700 my-4"></div>


        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            &copy; 2025 Koren LMS. All rights reserved.
          </p>
          
          <div className="flex gap-4 text-xs">
            <a href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</a>
            <a href="/cookies" className="hover:text-primary-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
