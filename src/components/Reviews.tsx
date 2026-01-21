import React, { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface Review {
  name: string
  rating: number
  comment: string
}

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const loadReviews = () => {
      const data = localStorage.getItem(`reviews-${productId}`)
      setReviews(data ? JSON.parse(data) : [])
    }

    loadReviews()
    window.addEventListener("storage", loadReviews)
    return () => window.removeEventListener("storage", loadReviews)
  }, [productId])

  if (reviews.length === 0) {
    return (
      <p className="text-xs text-gray-500 mt-2">
        No reviews yet. Be the first to review!
      </p>
    )
  }

  return (
    <div className="mt-2 space-y-2">
      {reviews.slice(0, 1).map((r, i) => (
        <div key={i} className="text-sm">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                className={`w-3 h-3 ${
                  idx < r.rating
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-500">by {r.name}</span>
          </div>
          <p className="text-xs text-gray-600 truncate">
            {r.comment}
          </p>
        </div>
      ))}
    </div>
  )
}
// import React, { useEffect, useState } from "react"
// import { Star } from "lucide-react"

// interface Review {
//   id: number
//   user_name: string
//   rating: number
//   comment: string
//   created_at: string
// }

// export default function Reviews({ productId }: { productId: string }) {
//   const [reviews, setReviews] = useState<Review[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         setLoading(true)
//         const res = await fetch(
//           `http://localhost:5000/api/reviews/${productId}`
//         )
//         const data = await res.json()
//         setReviews(data)
//       } catch (err) {
//         console.error("Failed to load reviews", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchReviews()
//   }, [productId])

//   if (loading) {
//     return (
//       <p className="text-xs text-gray-400 mt-2">Loading reviews...</p>
//     )
//   }

//   if (reviews.length === 0) {
//     return (
//       <p className="text-xs text-gray-500 mt-2">
//         No reviews yet. Be the first to review!
//       </p>
//     )
//   }

//   return (
//     <div className="mt-3 space-y-3">
//       {reviews.slice(0, 2).map((r) => (
//         <div
//           key={r.id}
//           className="border rounded-lg p-2 bg-gray-50"
//         >
//           <div className="flex items-center gap-1 mb-1">
//             {[1, 2, 3, 4, 5].map((n) => (
//               <Star
//                 key={n}
//                 className={`w-3 h-3 ${
//                   n <= r.rating
//                     ? "text-yellow-400 fill-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//             <span className="text-xs text-gray-500 ml-1">
//               {r.user_name}
//             </span>
//           </div>

//           <p className="text-xs text-gray-700 line-clamp-2">
//             {r.comment}
//           </p>
//         </div>
//       ))}
//     </div>
//   )
// }
// // import React, { useEffect, useState } from "react"
// // import AddReview from "./AddReview"

// // interface Review {
// //   id: string
// //   rating: number
// //   comment: string
// //   user_name: string
// // }

// // export default function Reviews({ productId }: { productId: string }) {
// //   const [reviews, setReviews] = useState<Review[]>([])
// //   const [loading, setLoading] = useState(true)

// //   const fetchReviews = async () => {
// //     try {
// //       setLoading(true)
// //       const res = await fetch(
// //         `http://localhost:5000/api/reviews/${productId}`
// //       )
// //       const data = await res.json()
// //       setReviews(data)
// //     } catch (err) {
// //       console.error("Failed to load reviews", err)
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     fetchReviews()
// //   }, [productId])

// //   return (
// //     <div className="mt-6">
// //       <h3 className="font-semibold text-sm mb-2">Reviews</h3>

// //       <AddReview productId={productId} onSuccess={fetchReviews} />

// //       {loading ? (
// //         <p className="text-xs text-gray-400 mt-2">Loading reviews...</p>
// //       ) : reviews.length === 0 ? (
// //         <p className="text-xs text-gray-400 mt-2">
// //           No reviews yet. Be the first to review!
// //         </p>
// //       ) : (
// //         <div className="mt-3 space-y-3">
// //           {reviews.map((r) => (
// //             <div key={r.id} className="border rounded p-3">
// //               <div className="flex justify-between text-xs text-gray-600">
// //                 <span>{r.user_name}</span>
// //                 <span>⭐ {r.rating}</span>
// //               </div>
// //               <p className="text-sm mt-1">{r.comment}</p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }
