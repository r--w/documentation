"use client"
 
import { useMemo, useRef, useState } from "react"


export const CoverageChecker = ({ mcpUrl = "https://cpmcp.coinpaprika.workers.dev/json-rpc", onUpdate }) => {
  // ---- cache + comms (scoped INSIDE the component)
  const STORE_LAST   = "dp:coverage:last"     // { ts, query, results }
  const CACHE_PREFIX = "dp:coverage:query:"   // per-query cache
  const CACHE_TTL_MS = 5 * 60 * 1000          // 5 minutes
  const EVT_NAME     = "dp:coverage:update"
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

  // ---- normal state
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const initOnce = useRef(null)

  const HEADERS = useMemo(() => ({ "Content-Type": "application/json" }), [])

  // optional handshake
  async function initializeIfNeeded() {
    if (!initOnce.current) {
      initOnce.current = fetch(mcpUrl, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify({ jsonrpc: "2.0", id: "init", method: "initialize", params: {} }),
        mode: "cors",
      }).catch(() => null)
    }
    return initOnce.current
  }

  async function rpc(method, params, id = Date.now()) {
    await initializeIfNeeded()
    const res = await fetch(mcpUrl, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
      mode: "cors",
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    let json; try { json = JSON.parse(text) } catch { throw new Error("Invalid JSON-RPC response") }
    if (json?.error) throw new Error(json.error.message || "RPC error")
    return json
  }

  function parseToolsCall(rpcRes) {
    const c = rpcRes?.result?.content
    if (Array.isArray(c) && c[0]?.type === "text") {
      try { return JSON.parse(c[0].text) } catch {}
    }
    return null
  }

  // publish to all paths (store + DOM events)
  function publish(query, results) {
    // debug
    console.debug("[CoverageChecker] publish", { query, results })

    saveLast(query, results)

    // direct prop callback for colocated usage
    try {
      if (typeof onUpdate === "function") onUpdate({ query, results })
    } catch {}
  }

  async function doSearch(q) {
    setLoading(true); setError("")
    try {
      const cached = loadCache(q)
      if (cached) { publish(q, cached); return }

      const rpcRes = await rpc("tools/call", { name: "search", arguments: { q, limit: SEARCH_LIMIT } })
      const payload = parseToolsCall(rpcRes) || {}
      // payload should be an object like { currencies: [], exchanges: [], icos: [], people: [], tags: [] }
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
