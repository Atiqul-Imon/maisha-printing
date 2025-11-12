/**
 * Testimonials data
 * Moved to separate file for better code organization and potential future database migration
 */

export interface Testimonial {
  name: string;
  company: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Lia BD',
    company: 'Satisfied Customer',
    content: 'আলহামদুলিল্লাহ, খুব সুন্দর সার্ভিস । কথা ও কাজে 100% মিল আছে।',
    rating: 5
  },
  {
    name: 'Prakash Chakma',
    company: 'Happy Customer',
    content: 'খুব ভালো সার্ভিস। আগামীর জন্য শুভ কামনা রইলো আপনাদের প্রতি।',
    rating: 5
  },
  {
    name: 'Tahmina Chowdhury',
    company: 'Quality Customer',
    content: 'I have not found such good service and quality for printing anywhere. Only here I found the quality and service to my heart. 💙',
    rating: 5
  },
  {
    name: 'Zahid Sazzad',
    company: 'Madrasa Customer',
    content: 'আলহামদুলিল্লাহ খুবই চমৎকার ডিজাইন করেছে আমার মাদ্রাসার ছাত্র ছাত্রী দের আইডি কার্ডের, সঠিক সময়ে হতে পেয়ে আমি খুব খুশি, আল্লাহ তাকে তার নেক আশাগুলা পুরণ করাক।',
    rating: 5
  },
  {
    name: 'Rddwan Rahman',
    company: 'Design Customer',
    content: 'আপনার কাজের মান অনেক ভালো। অসাধারণ একটা ডিজাইন দিয়েছেন তার জন্য ধন্যবাদ। সময় মত ডেলিভারি দেওয়ার জন্য ধন্যবাদ।',
    rating: 5
  },
  {
    name: 'Syed Hasan Shahriar Rofi',
    company: 'Calendar Customer',
    content: 'সাশ্রয়ী মূল্যে ভাল ক্যালেন্ডার বা যে কোন প্রিন্টিং এর জন্য নিঃসন্দেহে নির্ভরযোগ্য একটি প্রতিষ্ঠান।',
    rating: 5
  }
];

