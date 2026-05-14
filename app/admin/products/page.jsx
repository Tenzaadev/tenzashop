'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit2, Trash2, Save, X, Upload, Search, Package,
  DollarSign, Hash, Eye, TrendingUp, Star
} from 'lucide-react'
import { products as defaultProducts, categories } from '@/data/products'
import { useHeatMap } from '@/hooks/useHeatMap'
import { useI18n } from '@/i18n'
import ImageUpload from '@/components/ImageUpload'

const L = {
  uz: {
    title: 'Mahsulotlar', search: 'Qidirish...', all: 'Barchasi',
    addProduct: 'Yangi mahsulot', totalProducts: 'Jami mahsulot',
    inStock: 'Sotuvda bor', lowStock: 'Kam qolgan', outOfStock: 'Tugagan',
    product: 'Mahsulot', category: 'Kategoriya', price: 'Narx',
    stock: 'Omborda', sold: 'Sotilgan', actions: 'Harakat',
    edit: 'Tahrirlash', delete_: "O'chirish", save: 'Saqlash',
    add: "Qo'shish", close: 'Yopish', name: 'Nomi', oldPrice: 'Eski narx',
    quantity: 'Soni', imageUrl: 'Rasm URL', sizes: "O'lchamlar",
    colors: 'Ranglar', desc: 'Tavsif', confirmDelete: "Haqiqatan ham o'chirmoqchimisiz?",
    allCategories: 'Barcha kategoriyalar', noProducts: 'Mahsulotlar yo\'q',
    editProduct: 'Mahsulotni tahrirlash', addNewProduct: 'Yangi mahsulot qo\'shish',
    views: "Ko'rishlar", purchases: 'Sotuvlar',
  },
  ru: {
    title: 'Товары', search: 'Поиск...', all: 'Все',
    addProduct: 'Новый товар', totalProducts: 'Всего товаров',
    inStock: 'В наличии', lowStock: 'Мало', outOfStock: 'Нет в наличии',
    product: 'Товар', category: 'Категория', price: 'Цена',
    stock: 'На складе', sold: 'Продано', actions: 'Действия',
    edit: 'Редактировать', delete_: 'Удалить', save: 'Сохранить',
    add: 'Добавить', close: 'Закрыть', name: 'Название',
    oldPrice: 'Старая цена', quantity: 'Количество', imageUrl: 'URL изображения',
    sizes: 'Размеры', colors: 'Цвета', desc: 'Описание',
    confirmDelete: 'Вы действительно хотите удалить?',
    allCategories: 'Все категории', noProducts: 'Нет товаров',
    editProduct: 'Редактировать товар', addNewProduct: 'Добавить новый товар',
    views: 'Просмотры', purchases: 'Продажи',
  },
  en: {
    title: 'Products', search: 'Search...', all: 'All',
    addProduct: 'Add Product', totalProducts: 'Total Products',
    inStock: 'In Stock', lowStock: 'Low Stock', outOfStock: 'Out of Stock',
    product: 'Product', category: 'Category', price: 'Price',
    stock: 'Stock', sold: 'Sold', actions: 'Actions',
    edit: 'Edit', delete_: 'Delete', save: 'Save',
    add: 'Add', close: 'Close', name: 'Name',
    oldPrice: 'Old Price', quantity: 'Quantity', imageUrl: 'Image URL',
    sizes: 'Sizes', colors: 'Colors', desc: 'Description',
    confirmDelete: 'Are you sure you want to delete?',
    allCategories: 'All Categories', noProducts: 'No products',
    editProduct: 'Edit Product', addNewProduct: 'Add New Product',
    views: 'Views', purchases: 'Purchases',
  },
  fi: {
    title: 'Tuotteet', search: 'Hae...', all: 'Kaikki',
    addProduct: 'Lisää tuote', totalProducts: 'Tuotteet yhteensä',
    inStock: 'Varastossa', lowStock: 'Vähän jäljellä', outOfStock: 'Loppu',
    product: 'Tuote', category: 'Kategoria', price: 'Hinta',
    stock: 'Varasto', sold: 'Myyty', actions: 'Toiminnot',
    edit: 'Muokkaa', delete_: 'Poista', save: 'Tallenna',
    add: 'Lisää', close: 'Sulje', name: 'Nimi',
    oldPrice: 'Vanha hinta', quantity: 'Määrä', imageUrl: 'Kuvan URL',
    sizes: 'Koot', colors: 'Värit', desc: 'Kuvaus',
    confirmDelete: 'Haluatko varmasti poistaa?',
    allCategories: 'Kaikki kategoriat', noProducts: 'Ei tuotteita',
    editProduct: 'Muokkaa tuotetta', addNewProduct: 'Lisää uusi tuote',
    views: 'Katselut', purchases: 'Ostot',
  },
  sv: {
    title: 'Produkter', search: 'Sök...', all: 'Alla',
    addProduct: 'Lägg till produkt', totalProducts: 'Totalt produkter',
    inStock: 'I lager', lowStock: 'Få kvar', outOfStock: 'Slutsåld',
    product: 'Produkt', category: 'Kategori', price: 'Pris',
    stock: 'Lager', sold: 'Sålda', actions: 'Åtgärder',
    edit: 'Redigera', delete_: 'Ta bort', save: 'Spara',
    add: 'Lägg till', close: 'Stäng', name: 'Namn',
    oldPrice: 'Gammalt pris', quantity: 'Antal', imageUrl: 'Bild-URL',
    sizes: 'Storlekar', colors: 'Färger', desc: 'Beskrivning',
    confirmDelete: 'Är du säker på att du vill ta bort?',
    allCategories: 'Alla kategorier', noProducts: 'Inga produkter',
    editProduct: 'Redigera produkt', addNewProduct: 'Lägg till ny produkt',
    views: 'Visningar', purchases: 'Köp',
  },
}

export default function AdminProductsPage() {
  const { locale } = useI18n()
  const ll = L[locale] || L.uz
  const { stats: heatStats } = useHeatMap()

  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const [newProduct, setNewProduct] = useState({
    name: '', category: 'hoodie', price: '', oldPrice: '', stock: '',
    sizes: 'S,M,L,XL', colors: '#000000,#FFFFFF',
    image: '', description: '', isNew: false, isLimited: false
  })

  const [stats, setStats] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tenza_products') || 'null')
    if (saved && saved.length > 0) {
      setProducts(saved)
    } else {
      setProducts(defaultProducts)
      localStorage.setItem('tenza_products', JSON.stringify(defaultProducts))
    }
  }, [])

  useEffect(() => {
    const total = products.length
    const inStock = products.filter(p => (p.stock || 0) > 5).length
    const lowStock = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length
    const outOfStock = products.filter(p => (p.stock || 0) === 0).length
    setStats({ total, inStock, lowStock, outOfStock })
  }, [products])

  const filteredProducts = products.filter(p => {
    const q = searchQuery.toLowerCase()
    const n = typeof p.name === 'string' ? p.name.toLowerCase() : (p.name?.[locale] || p.name?.en || '').toLowerCase()
    if (!n.includes(q) && !p.id.toLowerCase().includes(q)) return false
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    return true
  })

  const catNames = {}
  categories.forEach(c => { catNames[c.id] = c.name })

  const persist = (updated) => {
    setProducts(updated)
    localStorage.setItem('tenza_products', JSON.stringify(updated))
  }

  const handleSaveEdit = () => {
    if (!editingProduct) return
    persist(products.map(p => p.id === editingProduct.id ? editingProduct : p))
    setEditingProduct(null)
  }

  const handleAddProduct = () => {
    const product = {
      id: (newProduct.category || 'product') + '-' + Date.now().toString(36),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price) || 0,
      oldPrice: newProduct.oldPrice ? parseFloat(newProduct.oldPrice) : null,
      stock: parseInt(newProduct.stock) || 0,
      sold: 0,
      sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: newProduct.colors.split(',').map(c => c.trim()).filter(Boolean),
      image: newProduct.image || '',
      description: newProduct.description,
      isNew: newProduct.isNew,
      isLimited: newProduct.isLimited
    }
    persist([product, ...products])
    setNewProduct({ name: '', category: 'hoodie', price: '', oldPrice: '', stock: '', sizes: 'S,M,L,XL', colors: '#000000,#FFFFFF', image: '', description: '', isNew: false, isLimited: false })
    setShowAddForm(false)
  }

  const handleDelete = (id) => {
    if (!confirm(ll.confirmDelete)) return
    persist(products.filter(p => p.id !== id))
  }

  const handleStockChange = (id, change) => {
    persist(products.map(p => p.id === id ? { ...p, stock: Math.max(0, (p.stock || 0) + change) } : p))
  }

  const productName = (p) => typeof p.name === 'string' ? p.name : (p.name?.[locale] || p.name?.en || '')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Package className="text-[#ccff00]" size={28} /> {ll.title}
        </h1>
        <button onClick={() => setShowAddForm(true)}
          className="px-6 py-3 bg-[#ccff00] text-black font-bold rounded-2xl flex items-center gap-2 hover:bg-white transition-all">
          <Plus size={20} /> {ll.addProduct}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { icon: Package, value: stats.total, label: ll.totalProducts, color: 'text-[#ccff00]' },
          { icon: Package, value: stats.inStock, label: ll.inStock, color: 'text-green-400' },
          { icon: Package, value: stats.lowStock, label: ll.lowStock, color: 'text-yellow-400' },
          { icon: Package, value: stats.outOfStock, label: ll.outOfStock, color: 'text-red-400' },
        ].map((card, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4">
            <card.icon className={`${card.color} mb-2`} size={24} />
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-gray-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-3 text-gray-500" />
          <input type="text" placeholder={ll.search} value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#ccff00]/50">
          <option value="all">{ll.allCategories}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-gray-400 text-sm font-medium">{ll.product}</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">{ll.category}</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">{ll.price}</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">{ll.stock}</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">{ll.sold}</th>
                <th className="text-left p-4 text-gray-400 text-sm font-medium">{ll.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                        {product.image && (
                          <img src={product.image} alt={productName(product)} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{productName(product)}</p>
                        <p className="text-gray-500 text-xs">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                      {catNames[product.category] || product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-white font-bold">${product.price}</span>
                      {product.oldPrice && (
                        <span className="text-gray-500 line-through text-xs ml-2">${product.oldPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleStockChange(product.id, -1)}
                        className="w-7 h-7 bg-white/10 rounded-lg text-white hover:bg-white/20 flex items-center justify-center text-sm font-bold">
                        -
                      </button>
                      <span className={`font-bold w-8 text-center text-sm ${
                        (product.stock || 0) === 0 ? 'text-red-400' :
                        (product.stock || 0) <= 5 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {product.stock || 0}
                      </span>
                      <button onClick={() => handleStockChange(product.id, 1)}
                        className="w-7 h-7 bg-white/10 rounded-lg text-white hover:bg-white/20 flex items-center justify-center text-sm font-bold">
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{product.sold || 0}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(product)}
                        className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-500/10 rounded-lg text-red-400 hover:bg-red-500/20">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Package size={48} className="mx-auto mb-3 opacity-20" />
            <p>{ll.noProducts}</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{ll.editProduct}</h3>
                  <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div>
                  <label className="text-sm text-gray-400">{ll.name}</label>
                  <input value={editingProduct.name}
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">{ll.price} ($)</label>
                    <input type="number" value={editingProduct.price}
                      onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{ll.oldPrice} ($)</label>
                    <input type="number" value={editingProduct.oldPrice || ''}
                      onChange={e => setEditingProduct({...editingProduct, oldPrice: e.target.value ? parseFloat(e.target.value) : null})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">{ll.quantity}</label>
                    <input type="number" value={editingProduct.stock || 0}
                      onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{ll.category}</label>
                    <select value={editingProduct.category}
                      onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#111]">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <ImageUpload
                  currentImage={editingProduct.image}
                  onImageChange={(newImage) => setEditingProduct({...editingProduct, image: newImage})}
                  locale={locale} />

                <div>
                  <label className="text-sm text-gray-400">{ll.desc}</label>
                  <textarea value={editingProduct.description || ''}
                    onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50 resize-none" />
                </div>

                <button onClick={handleSaveEdit}
                  className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl flex items-center justify-center gap-2">
                  <Save size={20} /> {ll.save}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">{ll.addNewProduct}</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div>
                  <label className="text-sm text-gray-400">{ll.name} *</label>
                  <input value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">{ll.price} ($) *</label>
                    <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{ll.oldPrice} ($)</label>
                    <input type="number" value={newProduct.oldPrice} onChange={e => setNewProduct({...newProduct, oldPrice: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">{ll.quantity} *</label>
                    <input type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">{ll.category}</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#111]">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <ImageUpload
                  currentImage={newProduct.image}
                  onImageChange={(newImage) => setNewProduct({...newProduct, image: newImage})}
                  locale={locale} />

                <div>
                  <label className="text-sm text-gray-400">{ll.sizes}</label>
                  <input value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                </div>

                <div>
                  <label className="text-sm text-gray-400">{ll.colors}</label>
                  <input value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50" />
                </div>

                <div>
                  <label className="text-sm text-gray-400">{ll.desc}</label>
                  <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mt-1 text-sm outline-none focus:border-[#ccff00]/50 resize-none" />
                </div>

                <button onClick={handleAddProduct}
                  disabled={!newProduct.name || !newProduct.price}
                  className="w-full py-4 bg-[#ccff00] text-black font-bold rounded-2xl disabled:opacity-30 flex items-center justify-center gap-2">
                  <Plus size={20} /> {ll.add}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
