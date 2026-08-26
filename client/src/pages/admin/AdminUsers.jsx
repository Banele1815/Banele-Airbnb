import { useState, useEffect } from 'react'
import { FiTrash2, FiSearch } from 'react-icons/fi'
import { getAdminUsers, updateUserRole, adminDeleteUser } from '../../services/adminService'
import { useAuth } from '../../context/AuthContext'

const ROLE_COLOURS = {
  guest: 'bg-gray-100 text-gray-700',
  host: 'bg-blue-50 text-blue-700',
  admin: 'bg-rose-50 text-airbnb-red',
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    getAdminUsers()
      .then((data) => { setUsers(data); setFiltered(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
    )
  }, [search, users])

  async function handleRoleChange(id, role) {
    setUpdating(id)
    try {
      const updated = await updateUserRole(id, role)
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: updated.role } : u)))
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user? This cannot be undone.')) return
    try {
      await adminDeleteUser(id)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-airbnb-dark">All Users</h2>

      <div className="relative">
        <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-airbnb-gray" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-9 text-sm"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-airbnb-gray">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-airbnb-gray">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">User</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-airbnb-gray hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 font-medium text-airbnb-gray">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-airbnb-red text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-airbnb-dark">{u.name}</span>
                        {u._id === currentUser?._id && (
                          <span className="text-xs bg-gray-100 text-airbnb-gray px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-airbnb-gray hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updating === u._id || u._id === currentUser?._id}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${ROLE_COLOURS[u.role]} disabled:opacity-60`}
                      >
                        <option value="guest">guest</option>
                        <option value="host">host</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-airbnb-gray hidden md:table-cell text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-ZA')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(u._id)}
                          disabled={u._id === currentUser?._id}
                          className="p-1.5 rounded-lg text-airbnb-gray hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete user"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-airbnb-gray">Showing {filtered.length} of {users.length} users</p>
    </div>
  )
}
