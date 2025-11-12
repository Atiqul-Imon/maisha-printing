/**
 * Navigation data - centralized for consistency and easier maintenance
 */

export interface NavItem {
  name: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const services: NavItem[] = [
  { name: 'T-Shirt Printing', href: '/services/t-shirt' },
  { name: 'Glass Printing', href: '/services/glass' },
  { name: 'Calendar Printing', href: '/services/calendar' },
  { name: 'ID Card Printing', href: '/services/id-card' },
  { name: 'Ribbon Printing', href: '/services/ribbon' },
  { name: 'Sticker Printing', href: '/services/sticker' },
  { name: 'Visiting Card', href: '/services/visiting-card' },
  { name: 'Flyer & Brochure', href: '/services/flyer-brochure' },
];

export const quickLinks: NavItem[] = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Services', href: '/services' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Get Quote', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

