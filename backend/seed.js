import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from './models/Product.js'

dotenv.config()

const products = [
  {
    name: "Ikan Clownfish",
    category: "Ikan Laut",
    price: 85000,
    originalPrice: 100000,
    stock: 20,
    rating: 4.8,
    reviews: 120,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/052_Clown_fish_in_Pacific_Ocean.jpg/800px-052_Clown_fish_in_Pacific_Ocean.jpg",
    description: "Ikan clownfish atau ikan badut, terkenal dari film Finding Nemo. Cocok untuk aquarium laut.",
    featured: true,
    isNewProduct: false,
  },
  {
    name: "Ikan Cupang Halfmoon",
    category: "Ikan Air Tawar",
    price: 45000,
    originalPrice: 60000,
    stock: 35,
    rating: 4.5,
    reviews: 89,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Betta_fish_%28Betta_splendens%29.jpg/800px-Betta_fish_%28Betta_splendens%29.jpg",
    description: "Ikan cupang halfmoon dengan sirip indah berbentuk setengah lingkaran. Mudah dirawat.",
    featured: true,
    isNewProduct: false,
  },
  {
    name: "Ikan Arwana Silver",
    category: "Ikan Air Tawar",
    price: 750000,
    originalPrice: 900000,
    stock: 8,
    rating: 4.9,
    reviews: 45,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Silver_arowana.jpg/800px-Silver_arowana.jpg",
    description: "Arwana silver, ikan hias premium yang dipercaya membawa keberuntungan.",
    featured: true,
    isNewProduct: false,
  },
  {
    name: "Ikan Koi Kohaku",
    category: "Ikan Koi",
    price: 200000,
    originalPrice: 250000,
    stock: 15,
    rating: 4.7,
    reviews: 67,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Koi_fish_%28Cyprinus_carpio%29.jpg/800px-Koi_fish_%28Cyprinus_carpio%29.jpg",
    description: "Koi kohaku dengan motif merah putih yang elegan, cocok untuk kolam taman.",
    featured: false,
    isNewProduct: true,
  },
  {
    name: "Ikan Guppy Fancy",
    category: "Ikan Air Tawar",
    price: 15000,
    originalPrice: 20000,
    stock: 100,
    rating: 4.3,
    reviews: 200,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Guppy_pair.jpg/800px-Guppy_pair.jpg",
    description: "Guppy fancy dengan warna cerah dan ekor panjang. Cocok untuk pemula.",
    featured: false,
    isNewProduct: true,
  },
  {
    name: "Ikan Discus Blue",
    category: "Ikan Air Tawar",
    price: 350000,
    originalPrice: 400000,
    stock: 12,
    rating: 4.6,
    reviews: 33,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Symphysodon_discus.jpg/800px-Symphysodon_discus.jpg",
    description: "Discus blue, raja aquarium air tawar dengan warna biru memukau.",
    featured: true,
    isNewProduct: false,
  },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected!')

    await Product.deleteMany()
    console.log('🗑️ Data lama dihapus')

    await Product.insertMany(products)
    console.log('✅ Data produk berhasil dimasukkan!')

    mongoose.disconnect()
    console.log('👋 Selesai!')
  } catch (err) {
    console.error('❌ Error:', err)
  }
}

seed()