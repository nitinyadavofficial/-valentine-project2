import { Link } from 'react-router-dom';
import { Train, Twitter, Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/utils/cn';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Investors', href: '/investors' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Live Chat', href: '/chat' },
    { label: 'Feedback', href: '/feedback' },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cancellation Policy', href: '/cancellation' },
    { label: 'Refund Policy', href: '/refund' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  services: [
    { label: 'Train Search', href: '/search' },
    { label: 'Live Tracking', href: '/tracking' },
    { label: 'PNR Status', href: '/pnr' },
    { label: 'Group Booking', href: '/group-booking' },
    { label: 'Corporate Travel', href: '/corporate' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/railgo', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/railgo', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/railgo', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/railgo', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/railgo', label: 'YouTube' },
];

const contactInfo = [
  { icon: Mail, text: 'support@railgo.com', href: 'mailto:support@railgo.com' },
  { icon: Phone, text: '+91 1800 123 4567', href: 'tel:+9118001234567' },
  { icon: MapPin, text: 'RailGo HQ, Bengaluru, India', href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-navy-50 dark:bg-navy-950 border-t border-navy-200 dark:border-navy-800">
      <div className="section-container py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-2 lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2" aria-label="RailGo Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-navy-800 flex items-center justify-center">
                <Train className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-navy-900 dark:text-white">RailGo</span>
            </Link>
            <p className="text-navy-600 dark:text-navy-400 text-base leading-relaxed max-w-xs">
              Book Your Journey. Track Your Train. Travel Smarter.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <nav className="space-y-4" aria-label="Company">
            <h3 className="font-semibold text-navy-900 dark:text-white">Company</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-4" aria-label="Support">
            <h3 className="font-semibold text-navy-900 dark:text-white">Support</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-4" aria-label="Legal">
            <h3 className="font-semibold text-navy-900 dark:text-white">Legal</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="space-y-4" aria-label="Services">
            <h3 className="font-semibold text-navy-900 dark:text-white">Services</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4" aria-label="Contact">
            <h3 className="font-semibold text-navy-900 dark:text-white">Contact Us</h3>
            <ul className="space-y-3" role="list">
              {contactInfo.map((item) => (
                <li key={item.text}>
                  <a href={item.href} className="flex items-center gap-2 text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-200 dark:border-navy-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-navy-500 dark:text-navy-500 text-sm">
              © {new Date().getFullYear()} RailGo. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-navy-500 dark:text-navy-500">
              <span>Made with ❤️ for Indian Railways travelers</span>
              <span>Demo Live Data</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}