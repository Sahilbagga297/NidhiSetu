import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                NidhiSetu
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering citizens with secure, transparent, and accessible government benefits through advanced biometric technology.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal & Policy</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Terms of Service</Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Security Standards</Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Accessibility</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Government Complex,<br />
                  New Delhi, India 110001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@nidhisetu.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} NidhiSetu. All rights reserved.</p>
          <p className="mt-2 text-xs">A Government of India Initiative</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;