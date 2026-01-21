
// // // // // // // // import React, { useEffect, useState } from "react"

// // // // // // // // interface Product {
// // // // // // // //   id: string
// // // // // // // //   name: string
// // // // // // // //   price: number
// // // // // // // //   originalPrice: number
// // // // // // // //   image: string
// // // // // // // //   category: string
// // // // // // // //   rating: number
// // // // // // // //   reviews: number
// // // // // // // //   inStock: number // Changed to number to represent quantity
// // // // // // // //   discount: number
// // // // // // // // }

// // // // // // // // export default function AdminProducts() {
// // // // // // // //   // STEP 1 — Create two states
// // // // // // // //   const [dbProducts, setDbProducts] = useState<Product[]>([])
// // // // // // // //   const [adminProducts, setAdminProducts] = useState<Product[]>(() => {
// // // // // // // //     if (typeof window !== "undefined") {
// // // // // // // //       const stored = localStorage.getItem("admin_products")
// // // // // // // //       return stored ? JSON.parse(stored) : []
// // // // // // // //     }
// // // // // // // //     return []
// // // // // // // //   })

// // // // // // // //   // Derived state: Combine both for the UI
// // // // // // // //   const products = [...dbProducts, ...adminProducts]

// // // // // // // //   const [newProduct, setNewProduct] = useState<Product>({
// // // // // // // //     id: "",
// // // // // // // //     name: "",
// // // // // // // //     price: 0,
// // // // // // // //     originalPrice: 0,
// // // // // // // //     image: "",
// // // // // // // //     category: "",
// // // // // // // //     rating: 4.5,
// // // // // // // //     reviews: 0,
// // // // // // // //     inStock: 10, // Default local stock count
// // // // // // // //     discount: 0
// // // // // // // //   })

// // // // // // // //   // STEP 2 — Fetch DB products properly with normalization
// // // // // // // //   useEffect(() => {
// // // // // // // //     fetch("http://localhost:5000/api/products")
// // // // // // // //       .then(res => res.json())
// // // // // // // //       .then(data => {
// // // // // // // //         console.log("DB PRODUCTS FROM SERVER:", data)

// // // // // // // //         const normalized = data.map((p: any) => ({
// // // // // // // //           id: String(p.id || p.product_id),
// // // // // // // //           name: p.name || p.title,
// // // // // // // //           price: Number(p.price),
// // // // // // // //           originalPrice: Number(p.price),
// // // // // // // //           image: p.image || p.image_url,
// // // // // // // //           category: p.category || p.category_name,
// // // // // // // //           rating: Number(p.rating ?? 4.5),
// // // // // // // //           reviews: Number(p.reviews_count ?? 0),
// // // // // // // //           discount: Number(p.discount ?? 0),
// // // // // // // //           inStock: Number(p.stock ?? 0) // Updated to raw stock number
// // // // // // // //         }))

// // // // // // // //         setDbProducts(normalized)
// // // // // // // //       })
// // // // // // // //       .catch(err => console.error("Failed loading products", err))
// // // // // // // //   }, [])

// // // // // // // //   // STEP 3 — Save only admin products
// // // // // // // //   useEffect(() => {
// // // // // // // //     localStorage.setItem("admin_products", JSON.stringify(adminProducts))
// // // // // // // //   }, [adminProducts])

// // // // // // // //   // STEP 4 — Add Product → goes only to adminProducts
// // // // // // // //   const handleAdd = () => {
// // // // // // // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // // // // // // //       alert("Fill all fields")
// // // // // // // //       return
// // // // // // // //     }

// // // // // // // //     const productToAdd: Product = {
// // // // // // // //       ...newProduct,
// // // // // // // //       id: "admin_" + Date.now().toString(),
// // // // // // // //       price: Number(newProduct.price),
// // // // // // // //       originalPrice: Number(newProduct.price),
// // // // // // // //       inStock: Number(newProduct.inStock)
// // // // // // // //     }

// // // // // // // //     setAdminProducts(prev => [...prev, productToAdd])

// // // // // // // //     // Reset Form
// // // // // // // //     setNewProduct({
// // // // // // // //       id: "",
// // // // // // // //       name: "",
// // // // // // // //       price: 0,
// // // // // // // //       originalPrice: 0,
// // // // // // // //       image: "",
// // // // // // // //       category: "",
// // // // // // // //       rating: 4.5,
// // // // // // // //       reviews: 0,
// // // // // // // //       inStock: 10,
// // // // // // // //       discount: 0
// // // // // // // //     })
// // // // // // // //   }

// // // // // // // //   // STEP 5 — Delete Product Correctly
// // // // // // // //   const deleteProduct = async (id: string) => {
// // // // // // // //     if (id.startsWith("admin_")) {
// // // // // // // //       setAdminProducts(prev => prev.filter(p => p.id !== id))
// // // // // // // //     } else {
// // // // // // // //       try {
// // // // // // // //         await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" })
// // // // // // // //         setDbProducts(prev => prev.filter(p => p.id !== id))
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Failed to delete DB product", err)
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   // STEP 6 — Toggle Stock (For local items, we flip between 0 and 10)
// // // // // // // //   const toggleStock = (id: string) => {
// // // // // // // //     const updateFn = (p: Product) => 
// // // // // // // //       p.id === id ? { ...p, inStock: p.inStock > 0 ? 0 : 10 } : p

// // // // // // // //     if (id.startsWith("admin_")) {
// // // // // // // //       setAdminProducts(prev => prev.map(updateFn))
// // // // // // // //     } else {
// // // // // // // //       setDbProducts(prev => prev.map(updateFn))
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <div className="p-6">
// // // // // // // //       <h2 className="text-2xl font-bold mb-4">Admin Product Manager</h2>

// // // // // // // //       {/* Form Section */}
// // // // // // // //       <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3 mb-6">
// // // // // // // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // // //           <input
// // // // // // // //             placeholder="Product Name"
// // // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // // //             value={newProduct.name}
// // // // // // // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // // // // // // //           />
// // // // // // // //           <input
// // // // // // // //             placeholder="Price"
// // // // // // // //             type="number"
// // // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // // //             value={newProduct.price || ""}
// // // // // // // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // // // // // // //           />
// // // // // // // //           <input
// // // // // // // //             placeholder="Image URL"
// // // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // // //             value={newProduct.image}
// // // // // // // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // // // // // // //           />
// // // // // // // //           <input
// // // // // // // //             placeholder="Category"
// // // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // // //             value={newProduct.category}
// // // // // // // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // // // // // // //           />
// // // // // // // //           <input
// // // // // // // //             placeholder="Initial Stock Quantity"
// // // // // // // //             type="number"
// // // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // // //             value={newProduct.inStock}
// // // // // // // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // // // // // // //           />
// // // // // // // //         </div>

// // // // // // // //         <button
// // // // // // // //           onClick={handleAdd}
// // // // // // // //           className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
// // // // // // // //         >
// // // // // // // //           Add Product
// // // // // // // //         </button>
// // // // // // // //       </div>

// // // // // // // //       {/* STEP 6 — Show total product count */}
// // // // // // // //       <p className="text-lg font-semibold mb-4 text-gray-700">
// // // // // // // //         Total Products: {products.length}
// // // // // // // //       </p>

// // // // // // // //       {/* Product List Grid */}
// // // // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
// // // // // // // //         {products.map(product => (
// // // // // // // //           <div
// // // // // // // //             key={product.id}
// // // // // // // //             className="bg-white rounded-xl shadow-md overflow-hidden border transition-hover hover:shadow-lg"
// // // // // // // //           >
// // // // // // // //             <img
// // // // // // // //               src={product.image}
// // // // // // // //               alt={product.name}
// // // // // // // //               className="w-full h-40 object-cover"
// // // // // // // //             />

// // // // // // // //             <div className="p-3">
// // // // // // // //               <div className="flex justify-between items-start">
// // // // // // // //                 <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
// // // // // // // //                 {product.id.startsWith("admin_") && (
// // // // // // // //                   <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded font-bold">LOCAL</span>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //               <p className="text-blue-600 font-semibold">₹{product.price}</p>
              
// // // // // // // //               {/* STEP 5 — Display stock count in Admin UI */}
// // // // // // // //               <p className={`text-sm font-semibold ${product.inStock > 0 ? "text-green-600" : "text-red-500"}`}>
// // // // // // // //                 Stock: {product.inStock}
// // // // // // // //               </p>

// // // // // // // //               <div className="flex gap-2 mt-3">
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => toggleStock(product.id)}
// // // // // // // //                   className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 text-sm font-medium rounded transition-colors"
// // // // // // // //                 >
// // // // // // // //                   Toggle
// // // // // // // //                 </button>

// // // // // // // //                 <button
// // // // // // // //                   onClick={() => deleteProduct(product.id)}
// // // // // // // //                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm font-medium rounded transition-colors"
// // // // // // // //                 >
// // // // // // // //                   Delete
// // // // // // // //                 </button>
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         ))}
// // // // // // // //       </div>

// // // // // // // //       {products.length === 0 && (
// // // // // // // //         <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
// // // // // // // //           No products available.
// // // // // // // //         </div>
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   )
// // // // // // // // }

// // // // // // // import React, { useEffect, useState } from "react"

// // // // // // // interface Product {
// // // // // // //   id: string
// // // // // // //   name: string
// // // // // // //   price: number
// // // // // // //   originalPrice: number
// // // // // // //   image: string
// // // // // // //   category: string
// // // // // // //   rating: number
// // // // // // //   reviews: number
// // // // // // //   inStock: number 
// // // // // // //   discount: number
// // // // // // // }

// // // // // // // export default function AdminProducts() {
// // // // // // //   // Now managing everything via dbProducts which syncs with your server
// // // // // // //   const [dbProducts, setDbProducts] = useState<Product[]>([])

// // // // // // //   // products now simply references the database state
// // // // // // //   const products = dbProducts

// // // // // // //   const [newProduct, setNewProduct] = useState<Product>({
// // // // // // //     id: "",
// // // // // // //     name: "",
// // // // // // //     price: 0,
// // // // // // //     originalPrice: 0,
// // // // // // //     image: "",
// // // // // // //     category: "",
// // // // // // //     rating: 4.5,
// // // // // // //     reviews: 0,
// // // // // // //     inStock: 10,
// // // // // // //     discount: 0
// // // // // // //   })

// // // // // // //   // Helper function to fetch and normalize data
// // // // // // //   const fetchProductsFromServer = async () => {
// // // // // // //     try {
// // // // // // //       const res = await fetch("http://localhost:5000/api/products")
// // // // // // //       const data = await res.json()

// // // // // // //       const normalized = data.map((p: any) => ({
// // // // // // //         id: String(p.id || p.product_id),
// // // // // // //         name: p.name || p.title,
// // // // // // //         price: Number(p.price),
// // // // // // //         originalPrice: Number(p.price),
// // // // // // //         image: p.image || p.image_url,
// // // // // // //         category: p.category || p.category_name,
// // // // // // //         rating: Number(p.rating ?? 4.5),
// // // // // // //         reviews: Number(p.reviews_count ?? 0),
// // // // // // //         discount: Number(p.discount ?? 0),
// // // // // // //         inStock: Number(p.stock ?? 0)
// // // // // // //       }))

// // // // // // //       setDbProducts(normalized)
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Failed loading products", err)
// // // // // // //     }
// // // // // // //   }

// // // // // // //   // Initial Load
// // // // // // //   useEffect(() => {
// // // // // // //     fetchProductsFromServer()
// // // // // // //   }, [])

// // // // // // //   // Handle Add: DB Insert + Refresh
// // // // // // //   const handleAdd = async () => {
// // // // // // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // // // // // //       alert("Fill all fields")
// // // // // // //       return
// // // // // // //     }

// // // // // // //     try {
// // // // // // //       await fetch("http://localhost:5000/api/products", {
// // // // // // //         method: "POST",
// // // // // // //         headers: {
// // // // // // //           "Content-Type": "application/json",
// // // // // // //           Authorization: "Bearer " + localStorage.getItem("token")
// // // // // // //         },
// // // // // // //         body: JSON.stringify({
// // // // // // //           name: newProduct.name,
// // // // // // //           price: newProduct.price,
// // // // // // //           image: newProduct.image,
// // // // // // //           category: newProduct.category,
// // // // // // //           stock: newProduct.inStock
// // // // // // //         })
// // // // // // //       })

// // // // // // //       // Re-fetch products from server to keep UI in sync
// // // // // // //       await fetchProductsFromServer()

// // // // // // //       // Reset Form
// // // // // // //       setNewProduct({
// // // // // // //         id: "",
// // // // // // //         name: "",
// // // // // // //         price: 0,
// // // // // // //         originalPrice: 0,
// // // // // // //         image: "",
// // // // // // //         category: "",
// // // // // // //         rating: 4.5,
// // // // // // //         reviews: 0,
// // // // // // //         inStock: 10,
// // // // // // //         discount: 0
// // // // // // //       })

// // // // // // //     } catch (err) {
// // // // // // //       console.error("Admin add failed:", err)
// // // // // // //     }
// // // // // // //   }

// // // // // // //   // Delete Product from DB
// // // // // // //   const deleteProduct = async (id: string) => {
// // // // // // //     try {
// // // // // // //       await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" })
// // // // // // //       setDbProducts(prev => prev.filter(p => p.id !== id))
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Failed to delete DB product", err)
// // // // // // //     }
// // // // // // //   }

// // // // // // //   // Toggle Stock (Local UI update)
// // // // // // //   const toggleStock = (id: string) => {
// // // // // // //     setDbProducts(prev => prev.map(p => 
// // // // // // //       p.id === id ? { ...p, inStock: p.inStock > 0 ? 0 : 10 } : p
// // // // // // //     ))
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <div className="p-6">
// // // // // // //       <h2 className="text-2xl font-bold mb-4">Admin Product Manager</h2>

// // // // // // //       {/* Form Section */}
// // // // // // //       <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3 mb-6">
// // // // // // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // // // // // //           <input
// // // // // // //             placeholder="Product Name"
// // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // //             value={newProduct.name}
// // // // // // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             placeholder="Price"
// // // // // // //             type="number"
// // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // //             value={newProduct.price || ""}
// // // // // // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             placeholder="Image URL"
// // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // //             value={newProduct.image}
// // // // // // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             placeholder="Category"
// // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // //             value={newProduct.category}
// // // // // // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // // // // // //           />
// // // // // // //           <input
// // // // // // //             placeholder="Initial Stock Quantity"
// // // // // // //             type="number"
// // // // // // //             className="border p-2 rounded-lg w-full"
// // // // // // //             value={newProduct.inStock}
// // // // // // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // // // // // //           />
// // // // // // //         </div>

// // // // // // //         <button
// // // // // // //           onClick={handleAdd}
// // // // // // //           className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
// // // // // // //         >
// // // // // // //           Add Product
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       <p className="text-lg font-semibold mb-4 text-gray-700">
// // // // // // //         Total Products: {products.length}
// // // // // // //       </p>

// // // // // // //       {/* Product List Grid */}
// // // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
// // // // // // //         {products.map(product => (
// // // // // // //           <div
// // // // // // //             key={product.id}
// // // // // // //             className="bg-white rounded-xl shadow-md overflow-hidden border transition-hover hover:shadow-lg"
// // // // // // //           >
// // // // // // //             <img
// // // // // // //               src={product.image}
// // // // // // //               alt={product.name}
// // // // // // //               className="w-full h-40 object-cover"
// // // // // // //             />

// // // // // // //             <div className="p-3">
// // // // // // //               <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
// // // // // // //               <p className="text-blue-600 font-semibold">₹{product.price}</p>
              
// // // // // // //               <p className={`text-sm font-semibold ${product.inStock > 0 ? "text-green-600" : "text-red-500"}`}>
// // // // // // //                 Stock: {product.inStock}
// // // // // // //               </p>

// // // // // // //               <div className="flex gap-2 mt-3">
// // // // // // //                 <button
// // // // // // //                   onClick={() => toggleStock(product.id)}
// // // // // // //                   className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-3 py-1 text-sm font-medium rounded transition-colors"
// // // // // // //                 >
// // // // // // //                   Toggle
// // // // // // //                 </button>

// // // // // // //                 <button
// // // // // // //                   onClick={() => deleteProduct(product.id)}
// // // // // // //                   className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm font-medium rounded transition-colors"
// // // // // // //                 >
// // // // // // //                   Delete
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         ))}
// // // // // // //       </div>

// // // // // // //       {products.length === 0 && (
// // // // // // //         <div className="text-center py-20 text-gray-500 border-2 border-dashed rounded-xl">
// // // // // // //           No products available.
// // // // // // //         </div>
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   )
// // // // // // // }

// // // // // // import React, { useEffect, useState } from "react"

// // // // // // interface Product {
// // // // // //   id: string
// // // // // //   name: string
// // // // // //   price: number
// // // // // //   originalPrice: number
// // // // // //   image: string
// // // // // //   category: string
// // // // // //   rating: number
// // // // // //   reviews: number
// // // // // //   inStock: number 
// // // // // //   discount: number
// // // // // // }

// // // // // // export default function AdminProducts() {
// // // // // //   const [dbProducts, setDbProducts] = useState<Product[]>([])
  
// // // // // //   // products references dbProducts to ensure the UI shows the latest database state
// // // // // //   const products = dbProducts

// // // // // //   const [newProduct, setNewProduct] = useState<Product>({
// // // // // //     id: "", 
// // // // // //     name: "", 
// // // // // //     price: 0, 
// // // // // //     originalPrice: 0, 
// // // // // //     image: "", 
// // // // // //     category: "", 
// // // // // //     rating: 4.5, 
// // // // // //     reviews: 0, 
// // // // // //     inStock: 10, 
// // // // // //     discount: 0
// // // // // //   })

// // // // // //   // Fetches current products and stock levels from the database
// // // // // //   const fetchProductsFromServer = async () => {
// // // // // //     try {
// // // // // //       const res = await fetch("http://localhost:5000/api/products")
// // // // // //       const data = await res.json()
      
// // // // // //       const normalized = data.map((p: any) => ({
// // // // // //         id: String(p.id || p.product_id),
// // // // // //         name: p.name || p.title,
// // // // // //         price: Number(p.price),
// // // // // //         originalPrice: Number(p.price),
// // // // // //         image: p.image || p.image_url,
// // // // // //         category: p.category || p.category_name,
// // // // // //         rating: Number(p.rating ?? 4.5),
// // // // // //         reviews: Number(p.reviews_count ?? 0),
// // // // // //         discount: Number(p.discount ?? 0),
// // // // // //         inStock: Number(p.stock ?? 0) // This now accurately reflects stock decreased by orders
// // // // // //       }))
      
// // // // // //       setDbProducts(normalized)
// // // // // //     } catch (err) {
// // // // // //       console.error("Failed loading products", err)
// // // // // //     }
// // // // // //   }

// // // // // //   useEffect(() => {
// // // // // //     fetchProductsFromServer()
// // // // // //   }, [])

// // // // // //   // Add Product to DB
// // // // // //   const handleAdd = async () => {
// // // // // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // // // // //       alert("Fill all fields")
// // // // // //       return
// // // // // //     }

// // // // // //     try {
// // // // // //       await fetch("http://localhost:5000/api/products", {
// // // // // //         method: "POST",
// // // // // //         headers: {
// // // // // //           "Content-Type": "application/json",
// // // // // //           Authorization: "Bearer " + localStorage.getItem("token")
// // // // // //         },
// // // // // //         body: JSON.stringify({
// // // // // //           name: newProduct.name,
// // // // // //           price: newProduct.price,
// // // // // //           image: newProduct.image,
// // // // // //           category: newProduct.category,
// // // // // //           stock: newProduct.inStock
// // // // // //         })
// // // // // //       })

// // // // // //       // Refresh list to show the newly added product
// // // // // //       await fetchProductsFromServer()

// // // // // //       // Reset Form
// // // // // //       setNewProduct({
// // // // // //         id: "", name: "", price: 0, originalPrice: 0, image: "", 
// // // // // //         category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
// // // // // //       })

// // // // // //     } catch (err) {
// // // // // //       console.error("Admin add failed:", err)
// // // // // //     }
// // // // // //   }

// // // // // //   // Delete Product from DB
// // // // // //   const deleteProduct = async (id: string) => {
// // // // // //     if (!window.confirm("Are you sure you want to delete this product?")) return

// // // // // //     try {
// // // // // //       await fetch(`http://localhost:5000/api/products/${id}`, { 
// // // // // //         method: "DELETE",
// // // // // //         headers: {
// // // // // //           Authorization: "Bearer " + localStorage.getItem("token")
// // // // // //         }
// // // // // //       })
// // // // // //       // Update local state for immediate feedback
// // // // // //       setDbProducts(prev => prev.filter(p => p.id !== id))
// // // // // //     } catch (err) {
// // // // // //       console.error("Failed to delete product", err)
// // // // // //     }
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="p-6">
// // // // // //       <div className="flex justify-between items-center mb-6">
// // // // // //         <h2 className="text-2xl font-bold text-gray-800">Admin Product Manager</h2>
// // // // // //         <button 
// // // // // //           onClick={fetchProductsFromServer}
// // // // // //           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
// // // // // //         >
// // // // // //           🔄 Refresh Stock Levels
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {/* Form Section */}
// // // // // //       <div className="bg-white p-6 rounded-xl shadow-sm border space-y-3 mb-8">
// // // // // //         <h3 className="font-semibold text-gray-700 mb-2">Add New Product</h3>
// // // // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // // // // //           <input
// // // // // //             placeholder="Product Name"
// // // // // //             className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
// // // // // //             value={newProduct.name}
// // // // // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // // // // //           />
// // // // // //           <input
// // // // // //             placeholder="Price (₹)"
// // // // // //             type="number"
// // // // // //             className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
// // // // // //             value={newProduct.price || ""}
// // // // // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // // // // //           />
// // // // // //           <input
// // // // // //             placeholder="Image URL"
// // // // // //             className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
// // // // // //             value={newProduct.image}
// // // // // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // // // // //           />
// // // // // //           <input
// // // // // //             placeholder="Category"
// // // // // //             className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
// // // // // //             value={newProduct.category}
// // // // // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // // // // //           />
// // // // // //           <input
// // // // // //             placeholder="Initial Stock"
// // // // // //             type="number"
// // // // // //             className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
// // // // // //             value={newProduct.inStock}
// // // // // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // // // // //           />
// // // // // //         </div>
// // // // // //         <button
// // // // // //           onClick={handleAdd}
// // // // // //           className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-lg transition-colors mt-2"
// // // // // //         >
// // // // // //           Add Product
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       <p className="text-gray-600 mb-4 font-medium">Total Products: {products.length}</p>
      
// // // // // //       {/* Product List Grid */}
// // // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // // // // //         {products.map(product => (
// // // // // //           <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow">
// // // // // //             <div className="relative h-40">
// // // // // //               <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
// // // // // //               {product.inStock === 0 && (
// // // // // //                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
// // // // // //                   <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Out of Stock</span>
// // // // // //                 </div>
// // // // // //               )}
// // // // // //             </div>

// // // // // //             <div className="p-4">
// // // // // //               <h3 className="font-bold text-gray-800 truncate mb-1">{product.name}</h3>
// // // // // //               <p className="text-blue-600 font-bold text-lg mb-2">₹{product.price}</p>
              
// // // // // //               {/* Dynamic Stock Indicator */}
// // // // // //               <div className="flex items-center justify-between mb-4">
// // // // // //                 <span className="text-sm text-gray-500">Inventory:</span>
// // // // // //                 <span className={`text-sm font-bold px-2 py-0.5 rounded ${
// // // // // //                   product.inStock > 5 
// // // // // //                     ? "text-green-700 bg-green-50" 
// // // // // //                     : product.inStock > 0 
// // // // // //                       ? "text-orange-700 bg-orange-50" 
// // // // // //                       : "text-red-700 bg-red-50"
// // // // // //                 }`}>
// // // // // //                   {product.inStock} Units
// // // // // //                 </span>
// // // // // //               </div>

// // // // // //               <button 
// // // // // //                 onClick={() => deleteProduct(product.id)} 
// // // // // //                 className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold transition-colors border border-red-200"
// // // // // //               >
// // // // // //                 Delete Product
// // // // // //               </button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         ))}
// // // // // //       </div>

// // // // // //       {products.length === 0 && (
// // // // // //         <div className="text-center py-20 text-gray-400 border-2 border-dashed rounded-xl bg-gray-50">
// // // // // //           No products found in the database.
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   )
// // // // // // }
// // // // // import React, { useEffect, useState } from "react"

// // // // // interface Product {
// // // // //   id: string
// // // // //   name: string
// // // // //   price: number
// // // // //   originalPrice: number
// // // // //   image: string
// // // // //   category: string
// // // // //   rating: number
// // // // //   reviews: number
// // // // //   inStock: number 
// // // // //   discount: number
// // // // // }

// // // // // export default function AdminProducts() {
// // // // //   const [dbProducts, setDbProducts] = useState<Product[]>([])
  
// // // // //   const [newProduct, setNewProduct] = useState<Product>({
// // // // //     id: "", 
// // // // //     name: "", 
// // // // //     price: 0, 
// // // // //     originalPrice: 0, 
// // // // //     image: "", 
// // // // //     category: "", 
// // // // //     rating: 4.5, 
// // // // //     reviews: 0, 
// // // // //     inStock: 10, 
// // // // //     discount: 0
// // // // //   })

// // // // //   // This function pulls the ACTUAL stock from your database
// // // // //   const fetchProductsFromServer = async () => {
// // // // //     try {
// // // // //       // Use a timestamp or cache: 'no-store' to prevent getting old data
// // // // //       const res = await fetch("http://localhost:5000/api/products", {
// // // // //         cache: 'no-store' 
// // // // //       })
// // // // //       const data = await res.json()
      
// // // // //       const normalized = data.map((p: any) => ({
// // // // //         id: String(p.id || p.product_id),
// // // // //         name: p.name || p.title,
// // // // //         price: Number(p.price),
// // // // //         originalPrice: Number(p.price),
// // // // //         image: p.image || p.image_url,
// // // // //         category: p.category || p.category_name,
// // // // //         rating: Number(p.rating ?? 4.5),
// // // // //         reviews: Number(p.reviews_count ?? 0),
// // // // //         discount: Number(p.discount ?? 0),
// // // // //         inStock: Number(p.stock ?? 0) // Ensure p.stock is the column name in your DB
// // // // //       }))
      
// // // // //       setDbProducts(normalized)
// // // // //     } catch (err) {
// // // // //       console.error("Failed loading products", err)
// // // // //     }
// // // // //   }

// // // // //   // Initial fetch when the component loads
// // // // //   useEffect(() => {
// // // // //     fetchProductsFromServer()
// // // // //   }, [])

// // // // //   const handleAdd = async () => {
// // // // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // // // //       alert("Fill all fields")
// // // // //       return
// // // // //     }

// // // // //     try {
// // // // //       const response = await fetch("http://localhost:5000/api/products", {
// // // // //         method: "POST",
// // // // //         headers: {
// // // // //           "Content-Type": "application/json",
// // // // //           Authorization: "Bearer " + localStorage.getItem("token")
// // // // //         },
// // // // //         body: JSON.stringify({
// // // // //           name: newProduct.name,
// // // // //           price: newProduct.price,
// // // // //           image: newProduct.image,
// // // // //           category: newProduct.category,
// // // // //           stock: newProduct.inStock
// // // // //         })
// // // // //       })

// // // // //       if (response.ok) {
// // // // //         await fetchProductsFromServer() // Refresh list
// // // // //         setNewProduct({
// // // // //           id: "", name: "", price: 0, originalPrice: 0, image: "", 
// // // // //           category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
// // // // //         })
// // // // //       }
// // // // //     } catch (err) {
// // // // //       console.error("Admin add failed:", err)
// // // // //     }
// // // // //   }

// // // // //   const deleteProduct = async (id: string) => {
// // // // //     if (!window.confirm("Delete this product?")) return
// // // // //     try {
// // // // //       await fetch(`http://localhost:5000/api/products/${id}`, { 
// // // // //         method: "DELETE",
// // // // //         headers: { Authorization: "Bearer " + localStorage.getItem("token") }
// // // // //       })
// // // // //       fetchProductsFromServer()
// // // // //     } catch (err) {
// // // // //       console.error("Delete failed", err)
// // // // //     }
// // // // //   }

// // // // //   return (
// // // // //     <div className="p-6">
// // // // //       <div className="flex justify-between items-center mb-6">
// // // // //         <h2 className="text-2xl font-bold text-gray-800">Admin Product Manager</h2>
// // // // //         <button 
// // // // //           onClick={fetchProductsFromServer}
// // // // //           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
// // // // //         >
// // // // //           🔄 Sync Inventory
// // // // //         </button>
// // // // //       </div>

// // // // //       {/* Add Product Form */}
// // // // //       <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
// // // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // // // //           <input
// // // // //             placeholder="Product Name"
// // // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // // //             value={newProduct.name}
// // // // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // // // //           />
// // // // //           <input
// // // // //             placeholder="Price"
// // // // //             type="number"
// // // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // // //             value={newProduct.price || ""}
// // // // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // // // //           />
// // // // //           <input
// // // // //             placeholder="Stock Quantity"
// // // // //             type="number"
// // // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // // //             value={newProduct.inStock}
// // // // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // // // //           />
// // // // //           <input
// // // // //             placeholder="Image URL"
// // // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none lg:col-span-2"
// // // // //             value={newProduct.image}
// // // // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // // // //           />
// // // // //           <input
// // // // //             placeholder="Category"
// // // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // // //             value={newProduct.category}
// // // // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // // // //           />
// // // // //         </div>
// // // // //         <button
// // // // //           onClick={handleAdd}
// // // // //           className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-lg transition-colors"
// // // // //         >
// // // // //           Add Product
// // // // //         </button>
// // // // //       </div>

// // // // //       {/* Product List */}
// // // // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // // // //         {dbProducts.map(product => (
// // // // //           <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
// // // // //             <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
// // // // //             <div className="p-4">
// // // // //               <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
// // // // //               <p className="text-blue-600 font-bold">₹{product.price}</p>
              
// // // // //               <div className="flex items-center justify-between mt-3 mb-4">
// // // // //                 <span className="text-sm text-gray-500">Inventory:</span>
// // // // //                 <span className={`text-sm font-bold px-3 py-1 rounded-full ${
// // // // //                   product.inStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
// // // // //                 }`}>
// // // // //                   {product.inStock} Units
// // // // //                 </span>
// // // // //               </div>

// // // // //               <button 
// // // // //                 onClick={() => deleteProduct(product.id)} 
// // // // //                 className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold border border-red-100 hover:bg-red-100 transition-colors"
// // // // //               >
// // // // //                 Delete Product
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   )
// // // // // }

// // // // import React, { useEffect, useState } from "react"

// // // // interface Product {
// // // //   id: string
// // // //   name: string
// // // //   price: number
// // // //   originalPrice: number
// // // //   image: string
// // // //   category: string
// // // //   rating: number
// // // //   reviews: number
// // // //   inStock: number 
// // // //   discount: number
// // // // }

// // // // export default function AdminProducts() {
// // // //   const [dbProducts, setDbProducts] = useState<Product[]>([])
  
// // // //   const [newProduct, setNewProduct] = useState<Product>({
// // // //     id: "", 
// // // //     name: "", 
// // // //     price: 0, 
// // // //     originalPrice: 0, 
// // // //     image: "", 
// // // //     category: "", 
// // // //     rating: 4.5, 
// // // //     reviews: 0, 
// // // //     inStock: 10, 
// // // //     discount: 0
// // // //   })

// // // //   // This function pulls the ACTUAL stock from your database
// // // //   const fetchProductsFromServer = async () => {
// // // //     try {
// // // //       const res = await fetch("http://localhost:5000/api/products", {
// // // //         cache: 'no-store' 
// // // //       })
// // // //       const data = await res.json()
      
// // // //       const normalized = data.map((p: any) => ({
// // // //         // Ensure ID is treated as a string (UUID)
// // // //         id: String(p.id || p.product_id),
// // // //         name: p.name || p.title,
// // // //         price: Number(p.price),
// // // //         originalPrice: Number(p.price),
// // // //         image: p.image || p.image_url,
// // // //         category: p.category || p.category_name,
// // // //         rating: Number(p.rating ?? 4.5),
// // // //         reviews: Number(p.reviews_count ?? 0),
// // // //         discount: Number(p.discount ?? 0),
// // // //         inStock: Number(p.stock ?? 0) 
// // // //       }))
      
// // // //       setDbProducts(normalized)
// // // //     } catch (err) {
// // // //       console.error("Failed loading products", err)
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     fetchProductsFromServer()
// // // //   }, [])

// // // //   const handleAdd = async () => {
// // // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // // //       alert("Fill all fields")
// // // //       return
// // // //     }

// // // //     try {
// // // //       const response = await fetch("http://localhost:5000/api/products", {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: "Bearer " + localStorage.getItem("token")
// // // //         },
// // // //         body: JSON.stringify({
// // // //           name: newProduct.name,
// // // //           price: newProduct.price,
// // // //           image: newProduct.image,
// // // //           category: newProduct.category,
// // // //           stock: newProduct.inStock
// // // //         })
// // // //       })

// // // //       if (response.ok) {
// // // //         await fetchProductsFromServer() 
// // // //         setNewProduct({
// // // //           id: "", name: "", price: 0, originalPrice: 0, image: "", 
// // // //           category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
// // // //         })
// // // //       }
// // // //     } catch (err) {
// // // //       console.error("Admin add failed:", err)
// // // //     }
// // // //   }

// // // //   const deleteProduct = async (id: string) => {
// // // //     if (!window.confirm("Delete this product?")) return
// // // //     try {
// // // //       await fetch(`http://localhost:5000/api/products/${id}`, { 
// // // //         method: "DELETE",
// // // //         headers: { Authorization: "Bearer " + localStorage.getItem("token") }
// // // //       })
// // // //       fetchProductsFromServer()
// // // //     } catch (err) {
// // // //       console.error("Delete failed", err)
// // // //     }
// // // //   }

// // // //   return (
// // // //     <div className="p-6">
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <h2 className="text-2xl font-bold text-gray-800">Admin Product Manager</h2>
// // // //         <button 
// // // //           onClick={fetchProductsFromServer}
// // // //           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
// // // //         >
// // // //           🔄 Sync Inventory
// // // //         </button>
// // // //       </div>

// // // //       <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // // //           <input
// // // //             placeholder="Product Name"
// // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // //             value={newProduct.name}
// // // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // // //           />
// // // //           <input
// // // //             placeholder="Price"
// // // //             type="number"
// // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // //             value={newProduct.price || ""}
// // // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // // //           />
// // // //           <input
// // // //             placeholder="Stock Quantity"
// // // //             type="number"
// // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // //             value={newProduct.inStock}
// // // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // // //           />
// // // //           <input
// // // //             placeholder="Image URL"
// // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none lg:col-span-2"
// // // //             value={newProduct.image}
// // // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // // //           />
// // // //           <input
// // // //             placeholder="Category"
// // // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
// // // //             value={newProduct.category}
// // // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // // //           />
// // // //         </div>
// // // //         <button
// // // //           onClick={handleAdd}
// // // //           className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-lg transition-colors"
// // // //         >
// // // //           Add Product
// // // //         </button>
// // // //       </div>

// // // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // // //         {dbProducts.map(product => (
// // // //           <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
// // // //             <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
// // // //             <div className="p-4">
// // // //               <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
// // // //               <p className="text-blue-600 font-bold">₹{product.price}</p>
              
// // // //               <div className="flex items-center justify-between mt-3 mb-4">
// // // //                 <span className="text-sm text-gray-500">Inventory:</span>
// // // //                 <span className={`text-sm font-bold px-3 py-1 rounded-full ${
// // // //                   product.inStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
// // // //                 }`}>
// // // //                   {product.inStock} Units
// // // //                 </span>
// // // //               </div>

// // // //               <button 
// // // //                 onClick={() => deleteProduct(product.id)} 
// // // //                 className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold border border-red-100 hover:bg-red-100 transition-colors"
// // // //               >
// // // //                 Delete Product
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>
// // // //     </div>
// // // //   )
// // // // }
// // // import React, { useEffect, useState } from "react"

// // // interface Product {
// // //   id: string
// // //   name: string
// // //   price: number
// // //   originalPrice: number
// // //   image: string
// // //   category: string
// // //   rating: number
// // //   reviews: number
// // //   inStock: number 
// // //   discount: number
// // // }

// // // export default function AdminProducts() {
// // //   const [dbProducts, setDbProducts] = useState<Product[]>([])
  
// // //   const [newProduct, setNewProduct] = useState<Product>({
// // //     id: "", 
// // //     name: "", 
// // //     price: 0, 
// // //     originalPrice: 0, 
// // //     image: "", 
// // //     category: "", 
// // //     rating: 4.5, 
// // //     reviews: 0, 
// // //     inStock: 10, 
// // //     discount: 0
// // //   })

// // //   const fetchProductsFromServer = async () => {
// // //     try {
// // //       const res = await fetch("http://localhost:5000/api/products", {
// // //         cache: 'no-store' 
// // //       })
// // //       const data = await res.json()
      
// // //       const normalized = data.map((p: any) => ({
// // //         // 🔥 FIX: Using the Database UUID (p.id) directly
// // //         id: String(p.id), 
// // //         name: p.name || p.title,
// // //         price: Number(p.price),
// // //         originalPrice: Number(p.price),
// // //         image: p.image || p.image_url,
// // //         category: p.category || p.category_name,
// // //         rating: Number(p.rating ?? 4.5),
// // //         reviews: Number(p.reviews_count ?? 0),
// // //         discount: Number(p.discount ?? 0),
// // //         inStock: Number(p.stock ?? 0) 
// // //       }))
      
// // //       setDbProducts(normalized)
// // //     } catch (err) {
// // //       console.error("Failed loading products", err)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     fetchProductsFromServer()
// // //   }, [])

// // //   const handleAdd = async () => {
// // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // //       alert("Fill all fields")
// // //       return
// // //     }

// // //     try {
// // //       const response = await fetch("http://localhost:5000/api/products", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: "Bearer " + localStorage.getItem("token")
// // //         },
// // //         body: JSON.stringify({
// // //           name: newProduct.name,
// // //           price: newProduct.price,
// // //           image: newProduct.image,
// // //           category: newProduct.category,
// // //           stock: newProduct.inStock
// // //         })
// // //       })

// // //       if (response.ok) {
// // //         await fetchProductsFromServer() 
// // //         setNewProduct({
// // //           id: "", name: "", price: 0, originalPrice: 0, image: "", 
// // //           category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
// // //         })
// // //       }
// // //     } catch (err) {
// // //       console.error("Admin add failed:", err)
// // //     }
// // //   }

// // //   const deleteProduct = async (id: string) => {
// // //     if (!window.confirm("Delete this product?")) return
// // //     try {
// // //       await fetch(`http://localhost:5000/api/products/${id}`, { 
// // //         method: "DELETE",
// // //         headers: { Authorization: "Bearer " + localStorage.getItem("token") }
// // //       })
// // //       fetchProductsFromServer()
// // //     } catch (err) {
// // //       console.error("Delete failed", err)
// // //     }
// // //   }

// // //   return (
// // //     <div className="p-6">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h2 className="text-2xl font-bold text-gray-800">Admin Product Manager</h2>
// // //         <button 
// // //           onClick={fetchProductsFromServer}
// // //           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95"
// // //         >
// // //           🔄 Sync Inventory
// // //         </button>
// // //       </div>

// // //       <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // //           <input
// // //             placeholder="Product Name"
// // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
// // //             value={newProduct.name}
// // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // //           />
// // //           <input
// // //             placeholder="Price"
// // //             type="number"
// // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
// // //             value={newProduct.price || ""}
// // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // //           />
// // //           <input
// // //             placeholder="Stock Quantity"
// // //             type="number"
// // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
// // //             value={newProduct.inStock}
// // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // //           />
// // //           <input
// // //             placeholder="Image URL"
// // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 lg:col-span-2"
// // //             value={newProduct.image}
// // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // //           />
// // //           <input
// // //             placeholder="Category"
// // //             className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
// // //             value={newProduct.category}
// // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // //           />
// // //         </div>
// // //         <button
// // //           onClick={handleAdd}
// // //           className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-lg transition-colors"
// // //         >
// // //           Add Product
// // //         </button>
// // //       </div>

// // //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // //         {dbProducts.map(product => (
// // //           <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden border">
// // //             <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
// // //             <div className="p-4">
// // //               <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
// // //               <p className="text-blue-600 font-bold">₹{product.price}</p>
// // //               <div className="flex items-center justify-between mt-3 mb-4">
// // //                 <span className="text-sm text-gray-500">Inventory:</span>
// // //                 <span className={`text-sm font-bold px-3 py-1 rounded-full ${
// // //                   product.inStock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
// // //                 }`}>
// // //                   {product.inStock} Units
// // //                 </span>
// // //               </div>
// // //               <button 
// // //                 onClick={() => deleteProduct(product.id)} 
// // //                 className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold border border-red-100 hover:bg-red-100 transition-colors"
// // //               >
// // //                 Delete Product
// // //               </button>
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   )
// // // }
// // // import React, { useEffect, useState } from "react"

// // // interface Product {
// // //   id: string
// // //   name: string
// // //   price: number
// // //   originalPrice: number
// // //   image: string
// // //   category: string
// // //   rating: number
// // //   reviews: number
// // //   inStock: number 
// // //   discount: number
// // // }

// // // export default function AdminProducts() {
// // //   const [dbProducts, setDbProducts] = useState<Product[]>([])
// // //   const [loading, setLoading] = useState(true)
  
// // //   const [newProduct, setNewProduct] = useState<Product>({
// // //     id: "", 
// // //     name: "", 
// // //     price: 0, 
// // //     originalPrice: 0, 
// // //     image: "", 
// // //     category: "", 
// // //     rating: 4.5, 
// // //     reviews: 0, 
// // //     inStock: 10, 
// // //     discount: 0
// // //   })

// // //   // Pulls the latest stock from the database
// // //   const fetchProductsFromServer = async () => {
// // //     setLoading(true)
// // //     try {
// // //       const res = await fetch("http://localhost:5000/api/products", {
// // //         cache: 'no-store' 
// // //       })
// // //       const data = await res.json()
      
// // //       const normalized = data.map((p: any) => ({
// // //         id: String(p.id),
// // //         name: p.name,
// // //         price: Number(p.price),
// // //         originalPrice: Number(p.price),
// // //         image: p.image,
// // //         category: p.category,
// // //         rating: Number(p.rating ?? 4.5),
// // //         reviews: Number(p.reviews_count ?? 0),
// // //         discount: Number(p.discount ?? 0),
// // //         inStock: Number(p.stock ?? 0) 
// // //       }))
      
// // //       setDbProducts(normalized)
// // //     } catch (err) {
// // //       console.error("Failed loading products", err)
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     fetchProductsFromServer()
// // //   }, [])

// // //   // ✅ CORRECTED: Sent token in headers to bypass admin middleware
// // //   const handleAdd = async () => {
// // //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// // //       alert("Please fill all required fields")
// // //       return
// // //     }

// // //     try {
// // //       const res = await fetch("http://localhost:5000/api/products", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           "Authorization": "Bearer " + localStorage.getItem("token") // Added Token
// // //         },
// // //         body: JSON.stringify({
// // //           name: newProduct.name,
// // //           price: newProduct.price,
// // //           image: newProduct.image,
// // //           category: newProduct.category,
// // //           stock: newProduct.inStock // Matches backend column name
// // //         })
// // //       })

// // //       if (res.ok) {
// // //         await fetchProductsFromServer() 
// // //         setNewProduct({
// // //           id: "", name: "", price: 0, originalPrice: 0, image: "", 
// // //           category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
// // //         })
// // //       } else {
// // //         const errData = await res.json()
// // //         alert("Error: " + (errData.error || "Failed to add product"))
// // //       }
// // //     } catch (err) {
// // //       console.error("Admin add failed:", err)
// // //     }
// // //   }

// // //   // ✅ CORRECTED: Sent token in headers for deletion
// // //   const deleteProduct = async (id: string) => {
// // //     if (!window.confirm("Are you sure you want to delete this product?")) return

// // //     try {
// // //       const res = await fetch(`http://localhost:5000/api/products/${id}`, { 
// // //         method: "DELETE",
// // //         headers: {
// // //           "Authorization": "Bearer " + localStorage.getItem("token") // Added Token
// // //         }
// // //       })
// // //       if (res.ok) {
// // //         setDbProducts(prev => prev.filter(p => p.id !== id))
// // //       } else {
// // //         alert("Action forbidden: Admins only")
// // //       }
// // //     } catch (err) {
// // //       console.error("Failed to delete product", err)
// // //     }
// // //   }

// // //   return (
// // //     <div className="p-6 max-w-7xl mx-auto">
// // //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
// // //         <div>
// // //           <h2 className="text-3xl font-bold text-gray-900">Inventory Manager</h2>
// // //           <p className="text-gray-500">Add products and track stock levels synced with the database.</p>
// // //         </div>
// // //         <button 
// // //           onClick={fetchProductsFromServer}
// // //           className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
// // //         >
// // //           <span>🔄</span> Sync Database
// // //         </button>
// // //       </div>

// // //       {/* Product Form */}
// // //       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
// // //         <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Product</h3>
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
// // //           <input
// // //             placeholder="Product Name"
// // //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// // //             value={newProduct.name}
// // //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// // //           />
// // //           <input
// // //             placeholder="Price (₹)"
// // //             type="number"
// // //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// // //             value={newProduct.price || ""}
// // //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// // //           />
// // //           <input
// // //             placeholder="Image URL"
// // //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// // //             value={newProduct.image}
// // //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// // //           />
// // //           <input
// // //             placeholder="Category"
// // //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// // //             value={newProduct.category}
// // //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// // //           />
// // //           <input
// // //             placeholder="Initial Stock"
// // //             type="number"
// // //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// // //             value={newProduct.inStock}
// // //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// // //           />
// // //         </div>
// // //         <button
// // //           onClick={handleAdd}
// // //           className="mt-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-3 rounded-xl transition-all shadow-md"
// // //         >
// // //           Create Product
// // //         </button>
// // //       </div>

// // //       <div className="flex items-center justify-between mb-6">
// // //         <h3 className="text-xl font-bold text-gray-800">Current Catalog</h3>
// // //         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
// // //           {dbProducts.length} Items
// // //         </span>
// // //       </div>
      
// // //       {loading ? (
// // //         <div className="text-center py-20 text-gray-400">Loading catalog...</div>
// // //       ) : (
// // //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// // //           {dbProducts.map(product => (
// // //             <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
// // //               <div className="relative h-44">
// // //                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
// // //                 {product.inStock === 0 && (
// // //                   <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
// // //                     <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Out of Stock</span>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <div className="p-5">
// // //                 <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
// // //                 <p className="text-indigo-600 font-extrabold text-xl mb-4">₹{product.price}</p>
                
// // //                 <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-4">
// // //                   <span className="text-xs text-gray-500 font-bold uppercase">Stock</span>
// // //                   <span className={`text-sm font-black ${
// // //                     product.inStock > 5 ? "text-emerald-600" : product.inStock > 0 ? "text-amber-600" : "text-red-600"
// // //                   }`}>
// // //                     {product.inStock} Units
// // //                   </span>
// // //                 </div>

// // //                 <button 
// // //                   onClick={() => deleteProduct(product.id)} 
// // //                   className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-colors"
// // //                 >
// // //                   Delete Item
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       )}

// // //       {!loading && dbProducts.length === 0 && (
// // //         <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
// // //           No products found.
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }
// // import React, { useEffect, useState } from "react"

// // interface Product {
// //   id: string
// //   name: string
// //   price: number
// //   originalPrice: number
// //   image: string
// //   category: string
// //   rating: number
// //   reviews: number
// //   inStock: number 
// //   discount: number
// // }

// // export default function AdminProducts() {
// //   const [dbProducts, setDbProducts] = useState<Product[]>([])
// //   const [loading, setLoading] = useState(true)
  
// //   const [newProduct, setNewProduct] = useState<Product>({
// //     id: "", 
// //     name: "", 
// //     price: 0, 
// //     originalPrice: 0, 
// //     image: "", 
// //     category: "", 
// //     rating: 4.5, 
// //     reviews: 0, 
// //     inStock: 10, 
// //     discount: 0
// //   })

// //   const fetchProductsFromServer = async () => {
// //     setLoading(true)
// //     try {
// //       const res = await fetch("http://localhost:5000/api/products", {
// //         cache: 'no-store' 
// //       })
// //       const data = await res.json()
      
// //       const normalized = data.map((p: any) => ({
// //         id: String(p.id),
// //         name: p.name,
// //         price: Number(p.price),
// //         originalPrice: Number(p.price),
// //         image: p.image,
// //         category: p.category,
// //         rating: Number(p.rating ?? 4.5),
// //         reviews: Number(p.reviews_count ?? 0),
// //         discount: Number(p.discount ?? 0),
// //         inStock: Number(p.stock ?? 0) 
// //       }))
      
// //       setDbProducts(normalized)
// //     } catch (err) {
// //       console.error("Failed loading products", err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchProductsFromServer()
// //   }, [])

// //   /* ============================================================
// //       FIXED: POST REQUEST WITH TOKEN AND CORRECT BODY STRUCTURE
// //   ============================================================ */
// //   const handleAdd = async () => {
// //     if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.category) {
// //       alert("Please fill all required fields")
// //       return
// //     }

// //     try {
// //       // ✅ CORRECTED: Extract token and send in Authorization header
// //       const token = localStorage.getItem("token")
      
// //       const res = await fetch("http://localhost:5000/api/products", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${token}` 
// //         },
// //         body: JSON.stringify({
// //           name: newProduct.name,
// //           price: newProduct.price,
// //           stock: newProduct.inStock, // Sent as 'stock' per template
// //           image: newProduct.image,
// //           category: newProduct.category
// //         })
// //       })

// //       if (res.ok) {
// //         await fetchProductsFromServer() 
// //         setNewProduct({
// //           id: "", name: "", price: 0, originalPrice: 0, image: "", 
// //           category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
// //         })
// //       } else {
// //         const errData = await res.json()
// //         alert("Error: " + (errData.error || "Failed to add product"))
// //       }
// //     } catch (err) {
// //       console.error("Admin add failed:", err)
// //     }
// //   }

// //   /* ============================================================
// //       FIXED: DELETE REQUEST WITH TOKEN
// //   ============================================================ */
// //   const deleteProduct = async (id: string) => {
// //     if (!window.confirm("Are you sure you want to delete this product?")) return

// //     try {
// //       const token = localStorage.getItem("token")
// //       const res = await fetch(`http://localhost:5000/api/products/${id}`, { 
// //         method: "DELETE",
// //         headers: {
// //           "Authorization": `Bearer ${token}`
// //         }
// //       })

// //       if (res.ok) {
// //         setDbProducts(prev => prev.filter(p => p.id !== id))
// //       } else {
// //         alert("Action forbidden: Admins only")
// //       }
// //     } catch (err) {
// //       console.error("Failed to delete product", err)
// //     }
// //   }

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto">
// //       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
// //         <div>
// //           <h2 className="text-3xl font-bold text-gray-900">Inventory Manager</h2>
// //           <p className="text-gray-500">Add products and track stock levels synced with the database.</p>
// //         </div>
// //         <button 
// //           onClick={fetchProductsFromServer}
// //           className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
// //         >
// //           <span>🔄</span> Sync Database
// //         </button>
// //       </div>

// //       {/* Product Form */}
// //       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
// //         <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Product</h3>
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
// //           <input
// //             placeholder="Product Name"
// //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// //             value={newProduct.name}
// //             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
// //           />
// //           <input
// //             placeholder="Price (₹)"
// //             type="number"
// //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// //             value={newProduct.price || ""}
// //             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
// //           />
// //           <input
// //             placeholder="Image URL"
// //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// //             value={newProduct.image}
// //             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
// //           />
// //           <input
// //             placeholder="Category"
// //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// //             value={newProduct.category}
// //             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
// //           />
// //           <input
// //             placeholder="Initial Stock"
// //             type="number"
// //             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
// //             value={newProduct.inStock}
// //             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
// //           />
// //         </div>
// //         <button
// //           onClick={handleAdd}
// //           className="mt-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-3 rounded-xl transition-all shadow-md"
// //         >
// //           Create Product
// //         </button>
// //       </div>

// //       <div className="flex items-center justify-between mb-6">
// //         <h3 className="text-xl font-bold text-gray-800">Current Catalog</h3>
// //         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
// //           {dbProducts.length} Items
// //         </span>
// //       </div>
      
// //       {loading ? (
// //         <div className="text-center py-20 text-gray-400">Loading catalog...</div>
// //       ) : (
// //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //           {dbProducts.map(product => (
// //             <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
// //               <div className="relative h-44">
// //                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
// //                 {product.inStock === 0 && (
// //                   <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
// //                     <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Out of Stock</span>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="p-5">
// //                 <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
// //                 <p className="text-indigo-600 font-extrabold text-xl mb-4">₹{product.price}</p>
                
// //                 <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-4">
// //                   <span className="text-xs text-gray-500 font-bold uppercase">Stock</span>
// //                   <span className={`text-sm font-black ${
// //                     product.inStock > 5 ? "text-emerald-600" : product.inStock > 0 ? "text-amber-600" : "text-red-600"
// //                   }`}>
// //                     {product.inStock} Units
// //                   </span>
// //                 </div>

// //                 <button 
// //                   onClick={() => deleteProduct(product.id)} 
// //                   className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-colors"
// //                 >
// //                   Delete Item
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {!loading && dbProducts.length === 0 && (
// //         <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
// //           No products found.
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// import React, { useEffect, useState } from "react"

// interface Product {
//   id: string
//   name: string
//   price: number
//   originalPrice: number
//   image: string
//   category: string
//   rating: number
//   reviews: number
//   inStock: number 
//   discount: number
// }

// export default function AdminProducts() {
//   const [dbProducts, setDbProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
  
//   const [newProduct, setNewProduct] = useState<Product>({
//     id: "", 
//     name: "", 
//     price: 0, 
//     originalPrice: 0, 
//     image: "", 
//     category: "", 
//     rating: 4.5, 
//     reviews: 0, 
//     inStock: 10, 
//     discount: 0
//   })

//   const fetchProductsFromServer = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch("http://localhost:5000/api/products", {
//         cache: 'no-store' 
//       })
//       const data = await res.json()
      
//       const normalized = data.map((p: any) => ({
//         id: String(p.id),
//         name: p.name,
//         price: Number(p.price),
//         originalPrice: Number(p.price),
//         image: p.image,
//         category: p.category,
//         rating: Number(p.rating ?? 4.5),
//         reviews: Number(p.reviews_count ?? 0),
//         discount: Number(p.discount ?? 0),
//         inStock: Number(p.stock ?? 0) 
//       }))
      
//       setDbProducts(normalized)
//     } catch (err) {
//       console.error("Failed loading products", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchProductsFromServer()
//   }, [])

//   /* ============================================================
//       ✅ WORKING 100%: POST REQUEST WITH EXACT TEMPLATE LOGIC
//   ============================================================ */
//   const handleAdd = async () => {
//     const { name, price, inStock: stock, image, category } = newProduct;

//     // Check basic fields
//     if (!name || !price || !image || !category) {
//       alert("Please fill all required fields")
//       return
//     }

//     // 🔴 TOKEN CHECK
//     const token = localStorage.getItem("token")
//     if (!token) {
//       alert("No token found. Please login again.")
//       return
//     }

//     try {
//       // 🔴 MUST BE EXACT FETCH STRUCTURE
//       const res = await fetch("http://localhost:5000/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${token}`, 
//         },
//         body: JSON.stringify({
//           name,
//           price,
//           stock,
//           image,
//           category
//         }),
//       })

//       if (!res.ok) {
//         const err = await res.text()
//         console.error("ADD PRODUCT ERROR:", err)
//         alert("Failed to add product")
//         return
//       }

//       alert("Product added successfully")
      
//       // Refresh list and clear form
//       await fetchProductsFromServer() 
//       setNewProduct({
//         id: "", name: "", price: 0, originalPrice: 0, image: "", 
//         category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0
//       })

//     } catch (err) {
//       console.error("Admin add failed:", err)
//     }
//   }

//   const deleteProduct = async (id: string) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return

//     try {
//       const token = localStorage.getItem("token")
//       const res = await fetch(`http://localhost:5000/api/products/${id}`, { 
//         method: "DELETE",
//         headers: {
//           "Authorization": `Bearer ${token}`
//         }
//       })

//       if (res.ok) {
//         setDbProducts(prev => prev.filter(p => p.id !== id))
//       } else {
//         alert("Action forbidden: Admins only")
//       }
//     } catch (err) {
//       console.error("Failed to delete product", err)
//     }
//   }

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900">Inventory Manager</h2>
//           <p className="text-gray-500">Add products and track stock levels synced with the database.</p>
//         </div>
//         <button 
//           onClick={fetchProductsFromServer}
//           className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm"
//         >
//           <span>🔄</span> Sync Database
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Product</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//           <input
//             placeholder="Product Name"
//             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
//             value={newProduct.name}
//             onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
//           />
//           <input
//             placeholder="Price (₹)"
//             type="number"
//             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
//             value={newProduct.price || ""}
//             onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
//           />
//           <input
//             placeholder="Image URL"
//             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
//             value={newProduct.image}
//             onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
//           />
//           <input
//             placeholder="Category"
//             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
//             value={newProduct.category}
//             onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
//           />
//           <input
//             placeholder="Initial Stock"
//             type="number"
//             className="bg-gray-50 border-0 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none"
//             value={newProduct.inStock}
//             onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })}
//           />
//         </div>
//         <button
//           onClick={handleAdd}
//           className="mt-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-3 rounded-xl transition-all shadow-md"
//         >
//           Create Product
//         </button>
//       </div>

//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-bold text-gray-800">Current Catalog</h3>
//         <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
//           {dbProducts.length} Items
//         </span>
//       </div>
      
//       {loading ? (
//         <div className="text-center py-20 text-gray-400">Loading catalog...</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {dbProducts.map(product => (
//             <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
//               <div className="relative h-44">
//                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
//                 {product.inStock === 0 && (
//                   <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
//                     <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Out of Stock</span>
//                   </div>
//                 )}
//               </div>

//               <div className="p-5">
//                 <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
//                 <p className="text-indigo-600 font-extrabold text-xl mb-4">₹{product.price}</p>
                
//                 <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 mb-4">
//                   <span className="text-xs text-gray-500 font-bold uppercase">Stock</span>
//                   <span className={`text-sm font-black ${
//                     product.inStock > 5 ? "text-emerald-600" : product.inStock > 0 ? "text-amber-600" : "text-red-600"
//                   }`}>
//                     {product.inStock} Units
//                   </span>
//                 </div>

//                 <button 
//                   onClick={() => deleteProduct(product.id)} 
//                   className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-colors"
//                 >
//                   Delete Item
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!loading && dbProducts.length === 0 && (
//         <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
//           No products found.
//         </div>
//       )}
//     </div>
//   )
// }
// import React, { useEffect, useState } from "react"

// /* =====================
//    TYPES
// ===================== */

// interface Product {
//   id: string
//   name: string
//   price: number
//   originalPrice: number
//   image_url: string
//   category: string
//   rating: number
//   reviews: number
//   inStock: number
//   discount: number
// }

// /* =====================
//    COMPONENT
// ===================== */

// export default function AdminProducts() {
//   const [dbProducts, setDbProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)

//   const [newProduct, setNewProduct] = useState<Product>({
//     id: "",
//     name: "",
//     price: 0,
//     originalPrice: 0,
//     image_url: "",
//     category: "",
//     rating: 4.5,
//     reviews: 0,
//     inStock: 10,
//     discount: 0
//   })

//   /* =====================
//      FETCH PRODUCTS
//   ===================== */

//   const fetchProductsFromServer = async () => {
//     setLoading(true)
//     try {
//       const res = await fetch("http://localhost:5000/api/products", {
//         cache: "no-store"
//       })
//       const data = await res.json()

//       const normalized: Product[] = data.map((p: any) => ({
//         id: String(p.id),
//         name: p.name,
//         price: Number(p.price),
//         originalPrice: Number(p.original_price ?? p.price),
//         image_url: p.image_url,
//         category: p.category,
//         rating: Number(p.rating ?? 4.5),
//         reviews: Number(p.reviews_count ?? 0),
//         discount: 0,
//         inStock: Number(p.stock ?? 0)
//       }))

//       setDbProducts(normalized)
//     } catch (err) {
//       console.error("Failed loading products", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchProductsFromServer()
//   }, [])

//   /* =====================
//      ADD PRODUCT (ADMIN)
//   ===================== */

//   const handleAdd = async () => {
//     const { name, price, inStock: stock, image_url, category } = newProduct

//     if (!name || !price || !image_url || !category) {
//       alert("Please fill all required fields")
//       return
//     }

//     const token = localStorage.getItem("token")
//     if (!token) {
//       alert("No token found. Please login again.")
//       return
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           name,
//           price,
//           stock,
//           image_url,
//           category
//         })
//       })

//       if (!res.ok) {
//         const err = await res.text()
//         console.error("ADD PRODUCT ERROR:", err)
//         alert("Failed to add product")
//         return
//       }

//       alert("Product added successfully")
//       await fetchProductsFromServer()

//       setNewProduct({
//         id: "",
//         name: "",
//         price: 0,
//         originalPrice: 0,
//         image_url: "",
//         category: "",
//         rating: 4.5,
//         reviews: 0,
//         inStock: 10,
//         discount: 0
//       })
//     } catch (err) {
//       console.error("Admin add failed:", err)
//     }
//   }

//   /* =====================
//      DELETE PRODUCT
//   ===================== */

//   const deleteProduct = async (id: string) => {
//     if (!window.confirm("Delete this product?")) return

//     try {
//       const token = localStorage.getItem("token")
//       const res = await fetch(`http://localhost:5000/api/products/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })

//       if (res.ok) {
//         setDbProducts(prev => prev.filter(p => p.id !== id))
//       } else {
//         alert("Admin only action")
//       }
//     } catch (err) {
//       console.error("Delete failed", err)
//     }
//   }

//   /* =====================
//      UI
//   ===================== */

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold">Inventory Manager</h2>
//         <button
//           onClick={fetchProductsFromServer}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
//         >
//           🔄 Sync Database
//         </button>
//       </div>

//       {/* ADD PRODUCT */}
//       <div className="bg-white p-6 rounded-xl shadow mb-10">
//         <h3 className="font-bold mb-4">Add New Product</h3>

//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//           <input
//             placeholder="Product Name"
//             value={newProduct.name}
//             onChange={e =>
//               setNewProduct({ ...newProduct, name: e.target.value })
//             }
//             className="p-3 bg-gray-100 rounded"
//           />

//           <input
//             placeholder="Price"
//             type="number"
//             value={newProduct.price || ""}
//             onChange={e =>
//               setNewProduct({ ...newProduct, price: Number(e.target.value) })
//             }
//             className="p-3 bg-gray-100 rounded"
//           />

//           <input
//             placeholder="Image URL"
//             value={newProduct.image_url}
//             onChange={e =>
//               setNewProduct({ ...newProduct, image_url: e.target.value })
//             }
//             className="p-3 bg-gray-100 rounded"
//           />

//           <input
//             placeholder="Category"
//             value={newProduct.category}
//             onChange={e =>
//               setNewProduct({ ...newProduct, category: e.target.value })
//             }
//             className="p-3 bg-gray-100 rounded"
//           />

//           <input
//             placeholder="Stock"
//             type="number"
//             value={newProduct.inStock}
//             onChange={e =>
//               setNewProduct({ ...newProduct, inStock: Number(e.target.value) })
//             }
//             className="p-3 bg-gray-100 rounded"
//           />
//         </div>

//         <button
//           onClick={handleAdd}
//           className="mt-6 bg-green-600 text-white px-8 py-3 rounded-lg"
//         >
//           Create Product
//         </button>
//       </div>

//       {/* PRODUCT LIST */}
//       <h3 className="font-bold text-xl mb-4">
//         Current Catalog ({dbProducts.length})
//       </h3>

//       {loading ? (
//         <p>Loading…</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {dbProducts.map(product => (
//             <div key={product.id} className="bg-white rounded-xl shadow">
//               <img
//                 src={product.image_url}
//                 alt={product.name}
//                 className="h-44 w-full object-cover rounded-t-xl"
//               />
//               <div className="p-4">
//                 <h4 className="font-bold">{product.name}</h4>
//                 <p className="text-green-600 font-bold">₹{product.price}</p>
//                 <p className="text-sm">Stock: {product.inStock}</p>

//                 <button
//                   onClick={() => deleteProduct(product.id)}
//                   className="mt-3 w-full bg-red-100 text-red-600 py-2 rounded"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
import React, { useEffect, useState, useMemo } from "react"
import { 
  Edit, Trash2, Plus, Minus, Search, 
  Filter, AlertCircle, CheckCircle2, XCircle, 
  Package, LayoutDashboard, Image as ImageIcon,
  Save, X
} from "lucide-react"

/* =====================
    TYPES
===================== */

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  image_url: string
  category: string
  rating: number
  reviews: number
  inStock: number
  discount: number
  is_active?: number // 1 for active, 0 for inactive
}

/* =====================
    COMPONENT
===================== */

export default function AdminProducts() {
  const [dbProducts, setDbProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"All" | "Low Stock" | "Out of Stock" | "Inactive">("All")
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    price: 0,
    originalPrice: 0,
    image_url: "",
    category: "",
    rating: 4.5,
    reviews: 0,
    inStock: 10,
    discount: 0,
    is_active: 1
  })

  /* =====================
      FETCH PRODUCTS
  ===================== */

  const fetchProductsFromServer = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        cache: "no-store"
      })
      const data = await res.json()

      const normalized: Product[] = data.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        price: Number(p.price),
        originalPrice: Number(p.original_price ?? p.price),
        image_url: p.image_url,
        category: p.category,
        rating: Number(p.rating ?? 4.5),
        reviews: Number(p.reviews_count ?? 0),
        discount: 0,
        inStock: Number(p.stock ?? 0),
        is_active: p.is_active ?? 1
      }))

      setDbProducts(normalized)
    } catch (err) {
      console.error("Failed loading products", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsFromServer()
  }, [])

  /* =====================
      STATS CALCULATIONS
  ===================== */
  const stats = useMemo(() => {
    return {
      total: dbProducts.length,
      outOfStock: dbProducts.filter(p => p.inStock === 0).length,
      lowStock: dbProducts.filter(p => p.inStock > 0 && p.inStock <= 5).length,
      inactive: dbProducts.filter(p => p.is_active === 0).length
    }
  }, [dbProducts])

  /* =====================
      SEARCH & FILTER LOGIC
  ===================== */
  const filteredProducts = useMemo(() => {
    return dbProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                            p.category.toLowerCase().includes(search.toLowerCase());
      
      if (filterType === "Low Stock") return matchesSearch && p.inStock > 0 && p.inStock <= 5;
      if (filterType === "Out of Stock") return matchesSearch && p.inStock === 0;
      if (filterType === "Inactive") return matchesSearch && p.is_active === 0;
      return matchesSearch;
    })
  }, [dbProducts, search, filterType])

  /* =====================
      ACTIONS (CRUD)
  ===================== */

  const handleAdd = async () => {
    const { name, price, inStock: stock, image_url, category } = newProduct
    if (!name || !price || !image_url || !category) { alert("Please fill required fields"); return; }

    const token = localStorage.getItem("token")
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, price, stock, image_url, category })
      })

      if (!res.ok) throw new Error("Add failed")
      alert("Product added successfully")
      fetchProductsFromServer()
      setNewProduct({ id: "", name: "", price: 0, originalPrice: 0, image_url: "", category: "", rating: 4.5, reviews: 0, inStock: 10, discount: 0, is_active: 1 })
    } catch (err) { console.error(err) }
  }

  const handleUpdate = async (updatedProduct: Product) => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`http://localhost:5000/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            name: updatedProduct.name,
            price: updatedProduct.price,
            stock: updatedProduct.inStock,
            image_url: updatedProduct.image_url,
            category: updatedProduct.category,
            is_active: updatedProduct.is_active
        })
      })

      if (res.ok) {
        setIsEditModalOpen(false)
        fetchProductsFromServer()
      }
    } catch (err) { console.error("Update failed", err) }
  }

  const updateStockQuickly = async (id: string, delta: number) => {
    const product = dbProducts.find(p => p.id === id);
    if (!product) return;
    const newStock = Math.max(0, product.inStock + delta);
    
    // Optimistic UI Update
    setDbProducts(prev => prev.map(p => p.id === id ? { ...p, inStock: newStock } : p));

    try {
        const token = localStorage.getItem("token")
        await fetch(`http://localhost:5000/api/products/${id}/stock`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ stock: newStock })
        });
    } catch (err) { console.error("Stock update failed", err) }
  }

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) setDbProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      
      {/* 📊 DASHBOARD STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
            <div className="flex items-center gap-3 text-gray-500 text-sm mb-1"><Package size={16}/> Total Products</div>
            <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-red-500">
            <div className="flex items-center gap-3 text-gray-500 text-sm mb-1"><AlertCircle size={16}/> Out of Stock</div>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center gap-3 text-gray-500 text-sm mb-1"><AlertCircle size={16}/> Low Stock</div>
            <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-gray-400">
            <div className="flex items-center gap-3 text-gray-500 text-sm mb-1"><XCircle size={16}/> Inactive</div>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
            <LayoutDashboard /> Inventory Manager
        </h2>
        <div className="flex gap-2">
            <button onClick={fetchProductsFromServer} className="bg-white border p-2 rounded-lg hover:bg-gray-100 transition shadow-sm">🔄 Sync</button>
        </div>
      </div>

      {/* ➕ ADD PRODUCT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-10 border border-gray-100">
        <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-green-600"/> Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex flex-col gap-2">
            <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="p-3 bg-gray-50 rounded-lg border focus:ring-2 ring-indigo-200 outline-none" />
          </div>
          <input type="number" placeholder="Price" value={newProduct.price || ""} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="p-3 bg-gray-50 rounded-lg border" />
          <div className="relative group">
            <input placeholder="Image URL" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} className="p-3 bg-gray-50 rounded-lg border w-full" />
            {newProduct.image_url && (
                <div className="absolute top-12 left-0 z-50 p-2 bg-white shadow-xl rounded-lg border">
                    <img src={newProduct.image_url} className="h-20 w-20 object-cover rounded" alt="Preview" />
                </div>
            )}
          </div>
          <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="p-3 bg-gray-50 rounded-lg border">
            <option value="">Select Category</option>
            <option value="Dairy">Dairy</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Bakery">Bakery</option>
          </select>
          <input type="number" placeholder="Stock" value={newProduct.inStock} onChange={e => setNewProduct({ ...newProduct, inStock: Number(e.target.value) })} className="p-3 bg-gray-50 rounded-lg border" />
        </div>
        <button onClick={handleAdd} className="mt-6 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-100">
          <Plus size={18}/> Create Product
        </button>
      </div>

      {/* 🔍 SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18}/>
            <input 
                placeholder="Search by name or category..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 outline-none focus:ring-2 ring-indigo-100"
            />
        </div>
        <div className="flex gap-2">
            {(["All", "Low Stock", "Out of Stock", "Inactive"] as const).map(type => (
                <button 
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition ${filterType === type ? 'bg-indigo-600 text-white' : 'bg-white text-gray-500 border'}`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      {/* 📦 PRODUCT LIST */}
      {loading ? (
        <div className="text-center py-20"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className={`group bg-white rounded-2xl shadow-sm border hover:shadow-md transition-all relative overflow-hidden ${product.is_active === 0 ? 'opacity-75 grayscale' : ''}`}>
              
              {/* Image & Badges */}
              <div className="relative h-44">
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm">{product.category}</span>
                    {product.inStock <= 5 && product.inStock > 0 && <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold">LOW STOCK</span>}
                    {product.inStock === 0 && <span className="bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold">OUT OF STOCK</span>}
                </div>
                <div className="absolute top-2 right-2">
                    {product.is_active ? <CheckCircle2 className="text-green-500 bg-white rounded-full" size={20}/> : <XCircle className="text-gray-400 bg-white rounded-full" size={20}/>}
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 line-clamp-1">{product.name}</h4>
                    <p className="text-indigo-600 font-black">₹{product.price}</p>
                </div>

                {/* Quick Stock Controls */}
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg mb-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">Stock</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => updateStockQuickly(product.id, -1)} className="p-1 hover:bg-white rounded shadow-sm transition"><Minus size={14}/></button>
                        <span className={`font-bold ${product.inStock <= 5 ? 'text-orange-600' : 'text-gray-700'}`}>{product.inStock}</span>
                        <button onClick={() => updateStockQuickly(product.id, 1)} className="p-1 hover:bg-white rounded shadow-sm transition"><Plus size={14}/></button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => { setEditingProduct(product); setIsEditModalOpen(true); }}
                        className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition"
                    >
                        <Edit size={14}/> Edit
                    </button>
                    <button 
                        onClick={() => deleteProduct(product.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✏️ EDIT MODAL */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Edit size={20}/> Edit Product</h3>
                    <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex gap-4 items-center mb-2">
                        <img src={editingProduct.image_url} className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm" alt="Edit Preview" />
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-400 uppercase">Product Image URL</label>
                            <input value={editingProduct.image_url} onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} className="w-full p-2 border rounded-lg mt-1 text-sm bg-gray-50" />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
                            <input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-3 border rounded-xl mt-1 focus:ring-2 ring-indigo-100 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Price (₹)</label>
                            <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-3 border rounded-xl mt-1" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase">Stock Level</label>
                            <input type="number" value={editingProduct.inStock} onChange={e => setEditingProduct({...editingProduct, inStock: Number(e.target.value)})} className="w-full p-3 border rounded-xl mt-1" />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border">
                        <div>
                            <p className="font-bold text-gray-800">Status</p>
                            <p className="text-xs text-gray-500">{editingProduct.is_active ? 'Visible to customers' : 'Hidden from shop'}</p>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={!!editingProduct.is_active} 
                            onChange={e => setEditingProduct({...editingProduct, is_active: e.target.checked ? 1 : 0})}
                            className="w-6 h-6 accent-indigo-600"
                        />
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t flex gap-3">
                    <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">Cancel</button>
                    <button onClick={() => handleUpdate(editingProduct)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"><Save size={18}/> Update Product</button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}