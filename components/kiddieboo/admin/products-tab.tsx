"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Plus, Pencil, Trash2, X, Upload, Link as LinkIcon, Star, Search } from "lucide-react"

const SIZES = ["0-3M", "3-6M", "6-12M", "12-18M", "2T", "3T", "4T", "5T", "6", "7", "8", "XS", "S", "M", "L"]

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  sale_price: number | null
  category: string
  image_url: string | null
  sizes: string[]
  colors: string[]
  size_inventory: Record<string, number> | null
  in_stock: boolean
  featured: boolean
}

type FormState = {
  name: string
  description: string
  price: string
  sale_price: string
  category: string
  image_url: string
  sizes: string[]
  size_inventory: Record<string, number>
  colors: string
  in_stock: boolean
  featured: boolean
}

const defaultForm: FormState = {
  name: "", description: "", price: "", sale_price: "", category: "",
  image_url: "", sizes: [], size_inventory: {}, colors: "", in_stock: true, featured: false,
}

export function ProductsTab({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<FormState>(defaultForm)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageMode, setImageMode] = useState<"upload" | "url">("upload")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured" | "regular">("all")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchesFeatured = filterFeatured === "all" ||
      (filterFeatured === "featured" && p.featured) ||
      (filterFeatured === "regular" && !p.featured)
    return matchesSearch && matchesFeatured
  })

  const featuredCount = products.filter((p) => p.featured).length

  function openNew() {
    setEditing(null)
    setForm(defaultForm)
    setImagePreview(null)
    setImageMode("upload")
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      sale_price: p.sale_price != null ? String(p.sale_price) : "",
      category: p.category,
      image_url: p.image_url ?? "",
      sizes: p.sizes ?? [],
      size_inventory: p.size_inventory ?? {},
      colors: p.colors?.join(", ") ?? "",
      in_stock: p.in_stock,
      featured: p.featured,
    })
    setImagePreview(p.image_url)
    setImageMode(p.image_url ? "url" : "upload")
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setImagePreview(null)
  }

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImagePreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Upload failed")
      setForm((prev) => ({ ...prev, image_url: json.url }))
      toast.success("Image uploaded")
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed")
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      category: form.category,
      image_url: form.image_url || null,
      sizes: form.sizes,
      size_inventory: form.size_inventory || {},
      colors: form.colors.split(",").map((s) => s.trim()).filter(Boolean),
      in_stock: form.in_stock,
      featured: form.featured,
    }

    const supabase = createClient()

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id)
      if (error) { toast.error("Failed to update product"); setLoading(false); return }
      toast.success("Product updated")
      setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...payload } : p))
      router.refresh()
    } else {
      const { data: newProduct, error } = await supabase.from("products").insert(payload).select().single()
      if (error) { toast.error("Failed to create product"); setLoading(false); return }
      toast.success("Product created")
      setProducts((prev) => [newProduct, ...prev])
    }

    setLoading(false)
    closeForm()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return
    const { error } = await supabase.from("products").delete().eq("id", id)
    if (error) { toast.error("Failed to delete"); return }
    setProducts((prev) => prev.filter((p) => p.id !== id))
    toast.success("Product deleted")
  }

  async function toggleFeatured(id: string, currentFeatured: boolean) {
    const { error } = await supabase
      .from("products")
      .update({ featured: !currentFeatured })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update featured status")
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: !currentFeatured } : p))
      )
      toast.success(`Product ${!currentFeatured ? "added to" : "removed from"} Featured Picks`)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} total &middot; {featuredCount} featured
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterFeatured === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterFeatured("all")}
          >
            All
          </Button>
          <Button
            variant={filterFeatured === "featured" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterFeatured("featured")}
          >
            <Star className="mr-1.5 h-3 w-3" />
            Featured
          </Button>
          <Button
            variant={filterFeatured === "regular" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterFeatured("regular")}
          >
            Regular
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              {editing ? "Edit Product" : "New Product"}
            </h2>
            <button onClick={closeForm} aria-label="Close">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" required className="mt-1" value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input id="category" required className="mt-1" value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} className="mt-1" value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">Price (₵) *</Label>
                <Input id="price" type="number" step="0.01" min="0" required className="mt-1" value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="sale_price">Sale Price (₵)</Label>
                <Input id="sale_price" type="number" step="0.01" min="0" className="mt-1" value={form.sale_price}
                  onChange={(e) => setForm((p) => ({ ...p, sale_price: e.target.value }))} />
              </div>
            </div>

            <div>
              <Label>Product Image</Label>
              <div className="mt-2 flex gap-2 mb-3">
                <button type="button"
                  onClick={() => setImageMode("upload")}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${imageMode === "upload" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </button>
                <button type="button"
                  onClick={() => setImageMode("url")}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${imageMode === "url" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>
                  <LinkIcon className="h-3.5 w-3.5" /> Image URL
                </button>
              </div>

              {imageMode === "upload" ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-8 text-center transition-colors hover:border-primary hover:bg-muted/60"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
  {imagePreview ? (
  <div className="relative h-32 w-32 overflow-hidden rounded-lg">
    <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
  </div>
  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">Click to upload image</p>
                      <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                    </>
                  )}
                  {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading...</p>}
                  {imagePreview && !uploading && (
                    <p className="mt-2 text-xs text-muted-foreground">Click to replace</p>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={form.image_url}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, image_url: e.target.value }))
                      setImagePreview(e.target.value || null)
                    }}
                  />
  {imagePreview && (
  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border">
    <img src={imagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" />
  </div>
  )}
                </div>
              )}
            </div>

            <div>
              <Label>Sizes & Inventory</Label>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto rounded-lg border border-border p-3 bg-muted/50">
                {SIZES.map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <label className="flex items-center gap-2 flex-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.sizes.includes(size)}
                        onChange={() => {
                          if (form.sizes.includes(size)) {
                            setForm((p) => {
                              const { [size]: _, ...rest } = p.size_inventory
                              return { ...p, sizes: p.sizes.filter((s) => s !== size), size_inventory: rest }
                            })
                          } else {
                            setForm((p) => ({
                              ...p,
                              sizes: [...p.sizes, size],
                              size_inventory: { ...p.size_inventory, [size]: 0 },
                            }))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-foreground">{size}</span>
                    </label>
                    {form.sizes.includes(size) && (
                      <input
                        type="number"
                        min="0"
                        value={form.size_inventory[size] ?? 0}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            size_inventory: { ...p.size_inventory, [size]: parseInt(e.target.value) || 0 },
                          }))
                        }
                        className="w-16 rounded border border-border px-2 py-1 text-sm text-foreground bg-white"
                        placeholder="Qty"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="colors">Colors (comma separated)</Label>
              <Input id="colors" className="mt-1" placeholder="Red, Blue, Green" value={form.colors}
                onChange={(e) => setForm((p) => ({ ...p, colors: e.target.value }))} />
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm((p) => ({ ...p, in_stock: e.target.checked }))} className="rounded" />
                In Stock
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} className="rounded" />
                Featured (show on homepage)
              </label>
            </div>
            
            <p className="text-xs text-muted-foreground">
              To add a discount tag, enter a Sale Price lower than the regular Price above.
            </p>

            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : editing ? "Update Product" : "Create Product"}
            </Button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">Product</th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground sm:table-cell">Category</th>
              <th className="hidden px-4 py-3 text-right font-semibold text-foreground md:table-cell">Price</th>
              <th className="hidden px-4 py-3 text-center font-semibold text-foreground lg:table-cell">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-foreground">Featured</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
  <div className="flex items-center gap-3">
  {p.image_url ? (
  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
    <img src={p.image_url} alt={p.name} className="absolute inset-0 h-full w-full object-cover" />
  </div>
  ) : (
  <div className="h-10 w-10 rounded-lg bg-muted" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{p.category}</p>
                      <p className="text-xs font-semibold text-foreground md:hidden">
                        {p.sale_price ? `₵${p.sale_price.toFixed(2)}` : `₵${p.price.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.category}</td>
                <td className="hidden px-4 py-3 text-right font-semibold text-foreground md:table-cell">
                  {p.sale_price ? (
                    <span>
                      <span className="text-orange-500">₵{p.sale_price.toFixed(2)}</span>{" "}
                      <span className="text-xs text-muted-foreground line-through">₵{p.price.toFixed(2)}</span>
                    </span>
                  ) : (
                    `₵${p.price.toFixed(2)}`
                  )}
                </td>
                <td className="hidden px-4 py-3 text-center lg:table-cell">
                  <Badge variant={p.in_stock ? "default" : "secondary"}>
                    {p.in_stock ? "In Stock" : "Out"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFeatured(p.id, p.featured)}
                    aria-label={p.featured ? "Remove from featured" : "Add to featured"}
                    className={p.featured ? "text-orange-500 hover:text-orange-600" : "text-muted-foreground hover:text-foreground"}
                  >
                    <Star className={`h-4 w-4 ${p.featured ? "fill-orange-500" : ""}`} />
                  </Button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {products.length === 0
                    ? 'No products yet. Click "Add Product" to get started.'
                    : "No products match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
