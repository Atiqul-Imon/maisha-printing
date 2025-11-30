# Product & Service System Refactor - Implementation Plan

## Overview
Complete refactor of the product/service display system with simplified homepage cards and enhanced detail page with side-by-side image gallery and pricing.

---

## 🎯 Requirements Summary

### Homepage (Product Cards)
- **Display**: Single image + title only
- **Remove**: Description, tags, category badges, "View Details" link text
- **Keep**: Clickable card that navigates to detail page

### Product Detail Page
- **Image Layout**: Multiple images displayed side-by-side (horizontal gallery)
- **Content Layout**: Title and price displayed directly below the image gallery
- **Remove**: Current thumbnail gallery below main image
- **Add**: Price field to product schema
- **Add**: Quantity selector and "Add to Cart" button
- **Add**: Shopping cart functionality

### Shopping Cart & Checkout
- **Add to Cart**: Button on product detail page with quantity selector
- **Cart Icon**: Display in header with item count badge
- **Cart Page**: View cart items, update quantities, remove items
- **Checkout Page**: Customer information form and order submission
- **Order Integration**: Connect to existing order management system

---

## 🛒 Shopping Cart & Checkout Requirements

### Cart Features
- Add products to cart from detail page
- Quantity selector (1-99)
- View cart items with subtotal
- Update/remove items from cart
- Persistent cart (localStorage)
- Cart icon in header with item count badge
- Responsive cart drawer/page

### Checkout Features
- Customer information form (name, phone, email, address)
- Order summary with totals
- Payment method selection
- Order confirmation
- Integration with existing order API
- Guest checkout (no account required)

---

## 📋 Implementation Steps

### Phase 1: Database Schema Updates

#### 1.1 Add Price Field to Product Type
**File**: `src/types/product.ts`
- Add `price?: number` field to `Product` interface
- Add `currency?: string` (default: 'BDT' or '৳')
- Consider adding `priceRange?: { min: number; max: number }` for variable pricing

#### 1.2 Update MongoDB Schema
- No migration needed (MongoDB is schema-less)
- Ensure existing products handle missing price gracefully
- Update admin form to include price input

---

### Phase 2: Component Refactoring

#### 2.1 Simplify ProductCard Component
**File**: `src/components/ProductCard.tsx`

**Changes**:
- Remove `shortDescription` display
- Remove category badges/tags
- Remove "View Details" text/arrow
- Keep only: Image + Title
- Maintain hover effects and navigation
- Simplify card styling (remove shadows, rounded corners per previous request)

**New Structure**:
```tsx
<Link>
  <Image />
  <Title />
</Link>
```

#### 2.2 Refactor Product Detail Page
**File**: `src/app/products/[slug]/page.tsx`

**Major Changes**:
1. **Image Gallery Section**:
   - Change from vertical layout (main image + thumbnails below) to horizontal layout
   - Display all images side-by-side in a scrollable or grid container
   - Images should be equal height, responsive
   - Option: Add lightbox/modal for full-screen image viewing

2. **Content Section**:
   - Move title and price directly below image gallery
   - Price should be prominently displayed (large, bold)
   - Add quantity selector (1-99) with +/- buttons
   - Add "Add to Cart" button (prominent, green)
   - Keep description and other content below cart section
   - Keep contact buttons (Call/Email) as secondary actions

**New Layout Structure**:
```
[Image Gallery - Side by Side]
[Title]
[Price]
[Quantity Selector + Add to Cart Button]
[Description]
[Contact Buttons (Call/Email)]
[Features]
```

**Responsive Behavior**:
- Mobile: Images stack vertically or scroll horizontally
- Tablet: 2-3 images per row
- Desktop: All images side-by-side (if space allows) or scrollable

---

### Phase 3: Shopping Cart Implementation

#### 3.1 Cart State Management
**File**: `src/context/CartContext.tsx` (New)

**Features**:
- Global cart state using React Context
- Add/remove/update cart items
- Calculate cart totals
- Persist cart to localStorage
- Cart item count for badge
- Type-safe cart operations
- Sync cart on mount (load from localStorage)
- Clear cart after successful checkout

**Cart Item Structure**:
```typescript
interface CartItem {
  productId: string;
  productSlug: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}
```

**Context API**:
```typescript
interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

**Integration**:
- Add `CartProvider` to `src/app/providers.tsx`
- Wrap app with cart context
- Use `useCart()` hook in components

**File to Update**: `src/app/providers.tsx`
```tsx
import { CartProvider } from '@/context/CartContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
```

#### 3.2 Cart Icon Component
**File**: `src/components/CartIcon.tsx` (New)

**Features**:
- Display cart icon in header
- Show item count badge
- Link to cart page
- Animate on item add

**Integration**:
- Add to `src/components/Header.tsx`
- Position: Right side of header

#### 3.3 Cart Page
**File**: `src/app/cart/page.tsx` (New)

**Features**:
- Display all cart items
- Quantity update controls
- Remove item button
- Subtotal calculation
- "Proceed to Checkout" button
- Empty cart state
- Responsive design

**Layout**:
```
[Page Header: Shopping Cart]
[Cart Items List]
  - Product image
  - Product title
  - Price
  - Quantity controls
  - Remove button
  - Item subtotal
[Cart Summary]
  - Subtotal
  - Shipping (if applicable)
  - Total
  - Checkout Button
```

#### 3.4 Add to Cart Button Component
**File**: `src/components/AddToCartButton.tsx` (New)

**Features**:
- Quantity selector (1-99)
- Add to cart functionality
- Success feedback (toast/notification)
- Disabled state for products without price
- Loading state during add

**Props**:
```typescript
interface AddToCartButtonProps {
  product: Product;
  onAdd?: () => void;
}
```

---

### Phase 4: Checkout Implementation

#### 4.1 Checkout Page
**File**: `src/app/checkout/page.tsx` (New)

**Features**:
- Customer information form
  - Name (required)
  - Phone (required)
  - Email (optional)
  - Address (optional)
  - City (optional)
  - Postal Code (optional)
  - Special Instructions (optional)
- Order summary sidebar
- Payment method selection
- Form validation
- Order submission
- Success/error handling

**Layout**:
```
[Checkout Form - Left Side]
  - Customer Information
  - Payment Method
  - Special Instructions
[Order Summary - Right Side]
  - Items list
  - Subtotal
  - Shipping
  - Total
  - Place Order Button
```

#### 4.2 Public Order API Endpoint
**File**: `src/app/api/orders/public/route.ts` (New)

**Features**:
- Public endpoint (no admin auth required)
- Create order from cart
- Validate customer information
- Generate order number
- Send confirmation (optional: email/SMS)
- Return order confirmation

**Security**:
- Rate limiting (prevent spam)
- Input validation
- Sanitize customer data
- Optional: CAPTCHA

#### 4.3 Order Confirmation Page
**File**: `src/app/checkout/confirmation/page.tsx` (New)

**Features**:
- Display order number
- Order summary
- Customer information
- Next steps message
- "Continue Shopping" button
- Print order option

---

### Phase 5: Admin Panel Updates

#### 5.1 Add Price Field to Admin Form
**File**: `src/app/admin/page.tsx`

**Changes**:
- Add price input field in product form
- Add currency selector (optional)
- Validate price input (must be positive number)
- Update form state to include price
- Update API calls to include price

#### 5.2 Update Product API Routes
**Files**: 
- `src/app/api/products/route.ts` (POST)
- `src/app/api/products/[id]/route.ts` (PUT)

**Changes**:
- Accept `price` and `currency` in request body
- Store price in database
- Return price in API responses

---

### Phase 6: Styling & UX Enhancements

#### 4.1 Homepage Product Grid
- Ensure cards are clean and minimal
- Maintain responsive grid (1/2/3/4 columns)
- Optimize image aspect ratios for consistency

#### 4.2 Detail Page Image Gallery
**Options for Side-by-Side Display**:

**Option A: Horizontal Scroll**
- All images in a single row
- Horizontal scroll on mobile
- Smooth scrolling with snap points

**Option B: Responsive Grid**
- Desktop: All images in one row (if ≤4 images)
- Tablet: 2-3 images per row
- Mobile: 1-2 images per row

**Option C: Carousel/Slider**
- Swipeable carousel for mobile
- Grid view for desktop
- Navigation arrows/dots

**Recommendation**: Option B (Responsive Grid) - Most flexible and user-friendly

#### 4.3 Price Display
- Large, prominent price display
- Format: "৳ 1,500" or "BDT 1,500"
- If price range: "৳ 1,500 - ৳ 3,000"
- If no price: "Contact for pricing" or hide price section

---

### Phase 7: Data Migration & Backward Compatibility

#### 5.1 Handle Existing Products
- Products without price should display "Contact for pricing"
- Ensure all existing products continue to work
- No breaking changes to existing data

#### 5.2 Image Handling
- Ensure first image is used for homepage card
- All images displayed on detail page
- Handle products with single image gracefully

---

## 🔧 Technical Implementation Details

### Image Gallery Component (New)
**File**: `src/components/ProductImageGallery.tsx` (Optional - can be inline)

**Features**:
- Responsive grid layout
- Equal height images
- Lazy loading for performance
- Optional: Lightbox for full-screen viewing
- Optional: Image zoom on hover

**Props**:
```typescript
interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}
```

### Price Display Component (New)
**File**: `src/components/ProductPrice.tsx` (Optional - can be inline)

**Features**:
- Format currency properly
- Handle price ranges
- Handle missing prices
- Responsive typography

**Props**:
```typescript
interface ProductPriceProps {
  price?: number;
  priceRange?: { min: number; max: number };
  currency?: string;
}
```

---

## 📁 Files to Modify

### Core Files
1. `src/types/product.ts` - Add price fields
2. `src/components/ProductCard.tsx` - Simplify to image + title
3. `src/app/products/[slug]/page.tsx` - Complete layout refactor
4. `src/app/admin/page.tsx` - Add price input field
5. `src/app/api/products/route.ts` - Handle price in API
6. `src/app/api/products/[id]/route.ts` - Handle price in API

### Shopping Cart & Checkout Files
7. `src/context/CartContext.tsx` - Cart state management
8. `src/components/CartIcon.tsx` - Cart icon with badge
9. `src/components/AddToCartButton.tsx` - Add to cart component
10. `src/app/cart/page.tsx` - Cart page
11. `src/app/checkout/page.tsx` - Checkout page
12. `src/app/checkout/confirmation/page.tsx` - Order confirmation
13. `src/app/api/orders/public/route.ts` - Public order API

### Optional New Files
14. `src/components/ProductImageGallery.tsx` - Reusable image gallery
15. `src/components/ProductPrice.tsx` - Reusable price display

### Utility Files (if needed)
16. `src/lib/currency.ts` - Currency formatting utilities
17. `src/lib/cart.ts` - Cart utility functions

---

## 🎨 Design Specifications

### Homepage Card
- **Image**: Aspect ratio 4:3 or 16:9 (consistent)
- **Title**: Single line, ellipsis if too long
- **Padding**: Minimal (p-4 or p-6)
- **Border**: Sharp corners (no rounded), no shadow
- **Hover**: Subtle border color change

### Detail Page
- **Image Gallery**: 
  - Gap: 8px (gap-2)
  - Border radius: 0 (sharp corners)
  - Equal height: 400px (desktop), 300px (tablet), 250px (mobile)
- **Title**: 
  - Font size: 2xl-4xl (responsive)
  - Font weight: Bold
  - Margin: mt-6 mb-4
- **Price**:
  - Font size: 3xl-5xl (responsive)
  - Font weight: Bold
  - Color: Green-600 or Gray-900
  - Margin: mb-6

---

## ✅ Testing Checklist

### Functionality
- [ ] Homepage displays only image + title
- [ ] Clicking card navigates to detail page
- [ ] Detail page shows all images side-by-side
- [ ] Title and price appear below images
- [ ] Quantity selector works correctly
- [ ] Add to cart button adds items to cart
- [ ] Cart icon shows correct item count
- [ ] Cart page displays all items
- [ ] Cart items can be updated/removed
- [ ] Checkout form validates correctly
- [ ] Order submission works
- [ ] Order confirmation displays correctly
- [ ] Price displays correctly (with/without currency)
- [ ] Products without price show "Contact for pricing"
- [ ] Admin can add/edit price
- [ ] Price saves correctly to database
- [ ] Responsive design works on all screen sizes

### Edge Cases
- [ ] Product with single image
- [ ] Product with many images (5+)
- [ ] Product without price (disable add to cart)
- [ ] Product with price range
- [ ] Empty image array (fallback)
- [ ] Empty cart state
- [ ] Cart persistence across page reloads
- [ ] Maximum quantity (99) handling
- [ ] Invalid cart items (product deleted)
- [ ] Network error during checkout

### Performance
- [ ] Images lazy load correctly
- [ ] No layout shift on image load
- [ ] Fast page transitions
- [ ] Optimized image sizes

---

## 🚀 Implementation Order

1. **Phase 1**: Update types and schema (price field)
2. **Phase 2**: Refactor ProductCard (simplify homepage)
3. **Phase 3**: Implement shopping cart (context, components, cart page)
4. **Phase 4**: Refactor detail page layout + Add to Cart
5. **Phase 5**: Implement checkout page and public order API
6. **Phase 6**: Add price to admin panel
7. **Phase 7**: Update API routes
8. **Phase 8**: Testing and polish

---

## 📝 Notes

- Maintain backward compatibility with existing products
- Ensure responsive design works on all devices
- Keep performance optimizations (lazy loading, image optimization)
- Maintain accessibility (alt text, keyboard navigation)
- Consider SEO implications (price in structured data)
- Cart uses localStorage for persistence (client-side only)
- Public order API should have rate limiting to prevent abuse
- Consider adding order confirmation email/SMS (future enhancement)
- Products without price should disable "Add to Cart" button
- Cart should handle deleted products gracefully (show error, remove item)

---

## 🎯 Success Criteria

✅ Homepage shows clean, minimal product cards (image + title only)
✅ Detail page displays images side-by-side
✅ Title and price are prominently displayed below images
✅ Quantity selector and Add to Cart button work correctly
✅ Cart icon displays in header with item count
✅ Cart page shows all items with update/remove functionality
✅ Checkout page collects customer information and creates orders
✅ Orders integrate with existing admin order management system
✅ Admin can manage product prices
✅ All changes are responsive and performant
✅ No breaking changes to existing functionality
✅ Cart persists across page reloads

---

**Ready to proceed?** Review this plan and confirm if you'd like any modifications before implementation begins.

