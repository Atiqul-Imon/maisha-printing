/**
 * Navigation data - centralized for consistency and easier maintenance
 */

export interface NavItem {
  name: string;
  href: string;
}

export const mainNavigation: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export const quickLinks: NavItem[] = [
  { name: 'About Us', href: '/about' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Get Quote', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
];

