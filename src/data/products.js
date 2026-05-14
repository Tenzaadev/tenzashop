export const categories = [
  { id: 'hoodie', nameKey: 'hoodie', slug: 'hoodie', name: 'Hoodie' },
  { id: 'tshirt', nameKey: 'tshirt', slug: 'tshirt', name: 'T-shirts' },
  { id: 'pants', nameKey: 'pants', slug: 'pants', name: 'Pants' },
  { id: 'shorts', nameKey: 'shorts', slug: 'shorts', name: 'Shorts' },
  { id: 'jacket', nameKey: 'jacket', slug: 'jacket', name: 'Jackets' },
  { id: 'windbreaker', nameKey: 'windbreaker', slug: 'windbreaker', name: 'Windbreakers' },
  { id: 'sneakers', nameKey: 'sneakers', slug: 'sneakers', name: 'Sneakers' },
  { id: 'accessories', nameKey: 'accessories', slug: 'accessories', name: 'Accessories' },
  { id: 'limited', nameKey: 'limited', slug: 'limited', name: 'Limited' },
]

const productImages = {
  hoodie: [
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&q=80',
  ],
  tshirt: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1576566588028-414520f5bfba?w=400&h=500&fit=crop&q=80',
  ],
  pants: [
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80',
  ],
  shorts: [
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop&q=80',
  ],
  jacket: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544923246-77307dd270b5?w=400&h=500&fit=crop&q=80',
  ],
  windbreaker: [
    'https://images.unsplash.com/photo-1556909114-3d375dc0d79a?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551697531921-411906c23b8d?w=400&h=500&fit=crop&q=80',
  ],
  sneakers: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773090a5?w=400&h=500&fit=crop&q=80',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=500&fit=crop&q=80',
  ],
}

function randStock(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function randSold(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

export const products = [
  { id: 'hoodie-001', name: { uz: 'Tech qora hudie', ru: 'Черный тех худи', en: 'Black techwear hoodie', fi: 'Musta techwear-huppari', sv: 'Svart techwear-hoodie' }, category: 'hoodie', price: 189, oldPrice: 249, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop&q=80', colors: ['#000000', '#FFFFFF'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 28, sold: 142 },
  { id: 'hoodie-002', name: 'Void Oversized Hoodie', category: 'hoodie', price: 159, oldPrice: null, image: productImages.hoodie[1], colors: ['#FFFFFF'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 15, sold: 89 },
  { id: 'hoodie-003', name: 'Stealth Cargo Hoodie', category: 'hoodie', price: 219, oldPrice: 279, image: productImages.hoodie[2], colors: ['#808080'], sizes: ['M', 'L', 'XL'], isNew: true, isLimited: true, stock: 8, sold: 34 },
  { id: 'hoodie-004', name: 'Acid Wash Hoodie', category: 'hoodie', price: 179, oldPrice: 229, image: productImages.hoodie[0], colors: ['#CCFF00'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 22, sold: 67 },
  { id: 'tshirt-001', name: { uz: 'Streetwear futbolka', ru: 'Стритвир футболка', en: 'Streetwear t-shirt', fi: 'Streetwear t-paita', sv: 'Streetwear t-shirt' }, category: 'tshirt', price: 89, oldPrice: null, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 45, sold: 198 },
  { id: 'tshirt-002', name: 'Tech Script Tee', category: 'tshirt', price: 79, oldPrice: 99, image: productImages.tshirt[1], colors: ['#FFFFFF'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 35, sold: 156 },
  { id: 'tshirt-003', name: 'Grid Print Tee', category: 'tshirt', price: 99, oldPrice: null, image: productImages.tshirt[2], colors: ['#808080'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, isLimited: true, stock: 12, sold: 45 },
  { id: 'tshirt-004', name: 'Striped Athletic Tee', category: 'tshirt', price: 89, oldPrice: 109, image: productImages.tshirt[0], colors: ['#FFFFFF'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 30, sold: 112 },
  { id: 'pants-001', name: { uz: 'Cargo shim', ru: 'Карго штаны', en: 'Cargo pants', fi: 'Cargo-housut', sv: 'Cargo-byxor' }, category: 'pants', price: 229, oldPrice: 299, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 20, sold: 78 },
  { id: 'pants-002', name: 'Wide Track Pants', category: 'pants', price: 199, oldPrice: null, image: productImages.pants[1], colors: ['#808080'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 14, sold: 56 },
  { id: 'pants-003', name: 'Joggers Pro', category: 'pants', price: 179, oldPrice: 229, image: productImages.pants[0], colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 25, sold: 93 },
  { id: 'pants-004', name: 'Utility Cargo', category: 'pants', price: 249, oldPrice: null, image: productImages.pants[1], colors: ['#2d2d2d'], sizes: ['M', 'L', 'XL'], isNew: false, isLimited: true, stock: 6, sold: 22 },
  { id: 'shorts-001', name: { uz: 'Streetwear shortik', ru: 'Стритвир шорты', en: 'Streetwear shorts', fi: 'Streetwear-shortsit', sv: 'Streetwear-shorts' }, category: 'shorts', price: 119, oldPrice: null, image: 'https://images.unsplash.com/photo-1506629905607-45ec9d6ed3e1?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 32, sold: 67 },
  { id: 'shorts-002', name: 'Cargo Shorts', category: 'shorts', price: 139, oldPrice: 179, image: productImages.shorts[0], colors: ['#808080'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 18, sold: 45 },
  { id: 'shorts-003', name: 'Bball Shorts', category: 'shorts', price: 129, oldPrice: null, image: productImages.shorts[0], colors: ['#000000', '#CCFF00'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 22, sold: 38 },
  { id: 'shorts-004', name: 'Swim Shorts', category: 'shorts', price: 99, oldPrice: 129, image: productImages.shorts[0], colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 40, sold: 29 },
  { id: 'jacket-001', name: { uz: 'Bomber kurtka', ru: 'Бомбер куртка', en: 'Bomber jacket', fi: 'Bomber-takki', sv: 'Bomberjacka' }, category: 'jacket', price: 349, oldPrice: 449, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 12, sold: 34 },
  { id: 'jacket-002', name: 'Track Jacket', category: 'jacket', price: 279, oldPrice: null, image: productImages.jacket[1], colors: ['#FFFFFF'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 10, sold: 28 },
  { id: 'jacket-003', name: 'Puffer Jacket', category: 'jacket', price: 449, oldPrice: 549, image: productImages.jacket[0], colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 7, sold: 19 },
  { id: 'jacket-004', name: 'Limited Bomber X', category: 'jacket', price: 599, oldPrice: null, image: productImages.jacket[1], colors: ['#CCFF00'], sizes: ['S', 'M', 'L'], isNew: false, isLimited: true, stock: 3, sold: 12 },
  { id: 'windbreaker-001', name: { uz: 'Shamolga qarshi kurtka', ru: 'Виндбрейкер', en: 'Windbreaker jacket', fi: 'Tuulitakki', sv: 'Vindjacka' }, category: 'windbreaker', price: 199, oldPrice: 259, image: 'https://images.unsplash.com/photo-1556909114-3d375dc0d79a?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 16, sold: 41 },
  { id: 'windbreaker-002', name: 'Rain Jacket', category: 'windbreaker', price: 229, oldPrice: null, image: productImages.jacket[1], colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, stock: 12, sold: 23 },
  { id: 'windbreaker-003', name: 'Packable Wind', category: 'windbreaker', price: 179, oldPrice: 229, image: productImages.jacket[0], colors: ['#FFFFFF'], sizes: ['S', 'M', 'L', 'XL'], isNew: true, stock: 20, sold: 35 },
  { id: 'sneakers-001', name: { uz: 'Street krossovka', ru: 'Стрит кроссовки', en: 'Streetwear sneakers', fi: 'Streetwear-lenkkarit', sv: 'Streetwear-sneakers' }, category: 'sneakers', price: 279, oldPrice: null, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['40', '41', '42', '43', '44', '45'], isNew: true, stock: 18, sold: 89 },
  { id: 'sneakers-002', name: 'Runner Pro', category: 'sneakers', price: 249, oldPrice: 319, image: productImages.sneakers[1], colors: ['#FFFFFF'], sizes: ['40', '41', '42', '43', '44', '45'], isNew: false, stock: 14, sold: 67 },
  { id: 'sneakers-003', name: 'Street Runner', category: 'sneakers', price: 229, oldPrice: null, image: productImages.sneakers[0], colors: ['#000000'], sizes: ['40', '41', '42', '43', '44', '45'], isNew: true, stock: 22, sold: 45 },
  { id: 'accessories-001', name: { uz: 'Tech kepka', ru: 'Тех кепка', en: 'Streetwear cap', fi: 'Streetwear-lippis', sv: 'Streetwear-keps' }, category: 'accessories', price: 59, oldPrice: null, image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['One Size'], isNew: true, stock: 50, sold: 234 },
  { id: 'accessories-002', name: 'Bucket Hat', category: 'accessories', price: 49, oldPrice: 69, image: productImages.accessories[1], colors: ['#000000'], sizes: ['One Size'], isNew: false, stock: 38, sold: 178 },
  { id: 'accessories-003', name: 'Tech Bag', category: 'accessories', price: 89, oldPrice: null, image: productImages.accessories[0], colors: ['#000000'], sizes: ['One Size'], isNew: true, stock: 25, sold: 92 },
  { id: 'accessories-004', name: 'Waist Bag', category: 'accessories', price: 69, oldPrice: 89, image: productImages.accessories[1], colors: ['#000000'], sizes: ['One Size'], isNew: false, stock: 30, sold: 145 },
  { id: 'limited-001', name: { uz: 'Eksklyuziv kolleksiya', ru: 'Эксклюзивная коллекция', en: 'Exclusive rare collection', fi: 'Eksklusiivinen kokoelma', sv: 'Exklusiv kollektion' }, category: 'limited', price: 599, oldPrice: null, image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop&q=80', colors: ['#000000'], sizes: ['S', 'M', 'L', 'XL'], isNew: false, isLimited: true, stock: 5, sold: 18 },
  { id: 'limited-002', name: 'GOLD EDITION HOODIE', category: 'limited', price: 399, oldPrice: null, image: productImages.hoodie[0], colors: ['#FFD700'], sizes: ['S', 'M', 'L'], isNew: true, isLimited: true, stock: 10, sold: 8 },
]

export function getProductsByCategory(categorySlug) {
  return products.filter(p => p.category === categorySlug)
}

export function getProductById(productId) {
  return products.find(p => p.id === productId)
}

export function getPlaceholderImage(text) {
  return `https://placehold.co/400x500/1a1a1a/ccff00?text=${encodeURIComponent(text)}`
}