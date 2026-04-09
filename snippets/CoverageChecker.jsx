"use client"

import { useState } from "react"

export const CoverageChecker = ({ onUpdate }) => {
  const SEARCH_API   = "https://api.coinpaprika.com/v1/search/"
  const STORE_LAST   = "dp:coverage:last"
  const CACHE_PREFIX = "dp:coverage:query:"
  const CACHE_TTL_MS = 5 * 60 * 1000          // 5 minutes
  const PRIMARY      = "#CA312C"              // matches docs.json colors.primary
  const SEARCH_LIMIT = 25

  function cacheKey(q) { return `${CACHE_PREFIX}${q.toLowerCase().trim()}` }

  function loadCache(q) {
    try {
      const raw = sessionStorage.getItem(cacheKey(q))
      if (!raw) return null
      const { ts, data } = JSON.parse(raw)
      return Date.now() - ts > CACHE_TTL_MS ? null : data
    } catch { return null }
  }
  function saveCache(q, data) {
    try { sessionStorage.setItem(cacheKey(q), JSON.stringify({ ts: Date.now(), data })) } catch {}
  }
  function saveLast(query, results) {
    try { sessionStorage.setItem(STORE_LAST, JSON.stringify({ ts: Date.now(), query, results })) } catch {}
  }

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function publish(query, results) {
    saveLast(query, results)
    try {
      if (typeof onUpdate === "function") onUpdate({ query, results })
    } catch {}
  }

  async function doSearch(q) {
    setLoading(true); setError("")
    try {
      const cached = loadCache(q)
      if (cached) { publish(q, cached); return }

      const url = `${SEARCH_API}?q=${encodeURIComponent(q)}&limit=${SEARCH_LIMIT}`
      const res = await fetch(url, { mode: "cors" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()
      const results = {
        currencies: Array.isArray(payload.currencies) ? payload.currencies : [],
        exchanges: Array.isArray(payload.exchanges) ? payload.exchanges : [],
        icos: Array.isArray(payload.icos) ? payload.icos : [],
        people: Array.isArray(payload.people) ? payload.people : [],
        tags: Array.isArray(payload.tags) ? payload.tags : [],
      }
      saveCache(q, results)
      publish(q, results)
    } catch (e) {
      setError(e.message || "Couldn’t load results. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 3) { setError("Please type at least 3 characters."); return }
    doSearch(q)
  }

  return (
    <div className="space-y-2">
      <form onSubmit={onSubmit} className="flex gap-3 items-center">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" aria-hidden>
            🔍
          </span>
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 bg-white dark:bg-transparent shadow-sm focus:outline-none"
            placeholder="Enter ticker, name, or contract (min 3 chars)…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); if (error) setError("") }}
            aria-label="Search term"
          />
        </div>
        <button
          className="px-4 py-2 rounded-lg text-white disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ backgroundColor: PRIMARY }}
          type="submit"
          disabled={loading || query.trim().length < 3}
          title={query.trim().length < 3 ? "Type at least 3 characters" : ""}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>
      {error && <div role="alert" className="text-red-600 text-sm">{error}</div>}
    </div>
  )
}
