import { useEffect, useState } from "react"
import { Shield, ShieldOff, UserX } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  is_active: number
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
    setUsers(await res.json())
  }

  useEffect(() => { fetchUsers() }, [])

  const toggleStatus = async (id: string, active: number) => {
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:5000/api/users/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ is_active: active })
    })
    fetchUsers()
  }

  const toggleRole = async (id: string, role: string) => {
    const token = localStorage.getItem("token")
    await fetch(`http://localhost:5000/api/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    })
    fetchUsers()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Users Management</h2>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">
                  {u.is_active ? "Active" : "Blocked"}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => toggleStatus(u.id, u.is_active ? 0 : 1)}
                    className="text-orange-600"
                  >
                    <UserX size={16} />
                  </button>
                  <button
                    onClick={() =>
                      toggleRole(u.id, u.role === "admin" ? "customer" : "admin")
                    }
                    className="text-indigo-600"
                  >
                    {u.role === "admin" ? <ShieldOff size={16}/> : <Shield size={16}/>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
