# TENZA Shop - Image Upload Guide

## Quick Start

1. **Put your photos in folders:**
   ```
   public/images/products/hoodie/     → your hoodie photos
   public/images/products/tshirt/    → your t-shirt photos
   public/images/products/pants/    → your pants photos
   public/images/products/shorts/  → your shorts photos
   public/images/products/jacket/   → your jacket photos
   public/images/products/windbreaker/ → your windbreaker photos
   public/images/products/sneakers/ → your sneakers photos
   public/images/products/accessories/ → your accessories photos
   public/images/products/limited/  → your limited edition photos
   ```

2. **Name your files consistently:**
   ```
   hoodie-black-front.jpg      (main image)
   hoodie-black-back.jpg     (hover image)
   hoodie-white-front.jpg
   hoodie-white-back.jpg
   ```

3. **Update products.js with your paths:**
   ```javascript
   {
     id: 'hoodie-001',
     name: 'My Hoodie',
     category: 'hoodie',
     image: '/images/products/hoodie/hoodie-black-front.jpg',
     hoverImage: '/images/products/hoodie/hoodie-black-back.jpg',
     ...
   }
   ```

4. **Restart server:**
   ```bash
   npm run dev
   ```

## Supported Formats
- JPG, JPEG, PNG, WEBP
- Recommended size: 800x1000px (or larger)
- File names: lowercase, no spaces, use hyphens

## Placeholders
If photos are missing, placeholder images will show automatically.

## Categories Mapping
| Folder | Category Slug |
|--------|---------------|
| hoodie | hoodie |
| tshirt | t-shirt |
| pants | pants |
| shorts | shorts |
| jacket | jacket |
| windbreaker | windbreaker |
| sneakers | sneakers |
| accessories | accessories |
| limited | limited |

## Example File Names
```
hoodie-black-front.jpg
hoodie-black-back.jpg
hoodie-white-front.jpg
tshirt-basic-white.jpg
pants-cargo-black.jpg
sneakers-runner-white.jpg
```