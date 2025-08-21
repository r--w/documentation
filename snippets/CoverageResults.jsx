"use client"

import { useEffect, useState } from "react"

const STORE_LAST = "dp:coverage:last"

export function CoverageResults({ externalData }) {
  const [results, setResults] = useState(null)
  const [lastQuery, setLastQuery] = useState("")
  // primary color from docs.json
  const PRIMARY = "#16A34A"

  // local helpers in component scope
  const fmtNum = (n) =>
    (n === null || n === undefined || Number.isNaN(n))
      ? "—"
      : Number(n).toLocaleString(undefined, { maximumFractionDigits: 6 })

  const trunc = (a = "") => (
    a && a.length > 20 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a || "—"
  )

  // init from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_LAST)
      if (raw) {
        const { query, results } = JSON.parse(raw)
        if (results && typeof results === "object") {
          setResults({
            currencies: Array.isArray(results.currencies) ? results.currencies : [],
            exchanges: Array.isArray(results.exchanges) ? results.exchanges : [],
            icos: Array.isArray(results.icos) ? results.icos : [],
            people: Array.isArray(results.people) ? results.people : [],
            tags: Array.isArray(results.tags) ? results.tags : [],
          })
          setLastQuery(query || "")
        }
      }
    } catch {}
  }, [])

  // direct prop updates
  useEffect(() => {
    if (externalData && externalData.results && typeof externalData.results === "object") {
      const r = externalData.results
      setResults({
        currencies: Array.isArray(r.currencies) ? r.currencies : [],
        exchanges: Array.isArray(r.exchanges) ? r.exchanges : [],
        icos: Array.isArray(r.icos) ? r.icos : [],
        people: Array.isArray(r.people) ? r.people : [],
        tags: Array.isArray(r.tags) ? r.tags : [],
      })
      setLastQuery(externalData.query || "")
    }
  }, [externalData])

  if (results === null) return null

  const totalCount = (
    (results.currencies?.length || 0) +
    (results.exchanges?.length || 0) +
    (results.icos?.length || 0) +
    (results.people?.length || 0) +
    (results.tags?.length || 0)
  )

  return (
    <div className="space-y-2">
      {lastQuery && (
        <div className="text-sm opacity-70">
          Results for: <span className="font-medium">{lastQuery}</span>
        </div>
      )}

      {totalCount === 0 ? (
        <div>No results.</div>
      ) : (
        <div className="space-y-6">
          {results.currencies?.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <div className="font-medium mb-2">Currencies ({results.currencies.length})</div>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4">ID</th>
                    <th className="text-left py-2 pr-4">Symbol</th>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Rank</th>
                    <th className="text-left py-2 pr-4">Type</th>
                    <th className="text-left py-2 pr-4">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {results.currencies.map((c, i) => (
                    <tr key={`${c.id}:${i}`}>
                      <td className="py-2 pr-4"><span className="font-mono text-xs">{c.id || "—"}</span></td>
                      <td className="py-2 pr-4">{c.symbol || "—"}</td>
                      <td className="py-2 pr-4">{c.name || "—"}</td>
                      <td className="py-2 pr-4">{fmtNum(c.rank)}</td>
                      <td className="py-2 pr-4">{c.type || "—"}</td>
                      <td className="py-2 pr-4">{c.is_active === true ? "Yes" : c.is_active === false ? "No" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.exchanges?.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <div className="font-medium mb-2">Exchanges ({results.exchanges.length})</div>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4">ID</th>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {results.exchanges.map((ex, i) => (
                    <tr key={`${ex.id}:${i}`}>
                      <td className="py-2 pr-4"><span className="font-mono text-xs">{ex.id || "—"}</span></td>
                      <td className="py-2 pr-4">{ex.name || "—"}</td>
                      <td className="py-2 pr-4">{fmtNum(ex.rank)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.icos?.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <div className="font-medium mb-2">ICOs ({results.icos.length})</div>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4">ID</th>
                    <th className="text-left py-2 pr-4">Symbol</th>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">New</th>
                  </tr>
                </thead>
                <tbody>
                  {results.icos.map((ico, i) => (
                    <tr key={`${ico.id}:${i}`}>
                      <td className="py-2 pr-4"><span className="font-mono text-xs">{ico.id || "—"}</span></td>
                      <td className="py-2 pr-4">{ico.symbol || "—"}</td>
                      <td className="py-2 pr-4">{ico.name || "—"}</td>
                      <td className="py-2 pr-4">{ico.is_new === true ? "Yes" : ico.is_new === false ? "No" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.people?.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <div className="font-medium mb-2">People ({results.people.length})</div>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4">ID</th>
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Teams</th>
                  </tr>
                </thead>
                <tbody>
                  {results.people.map((p, i) => (
                    <tr key={`${p.id}:${i}`}>
                      <td className="py-2 pr-4"><span className="font-mono text-xs">{p.id || "—"}</span></td>
                      <td className="py-2 pr-4">{p.name || "—"}</td>
                      <td className="py-2 pr-4">{fmtNum(p.teams_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {results.tags?.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <div className="font-medium mb-2">Tags ({results.tags.length})</div>
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4">ID</th>
                    <th className="text-left py-2 pr-4">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {results.tags.map((t, i) => (
                    <tr key={`${t.id || t.name || i}:${i}`}>
                      <td className="py-2 pr-4"><span className="font-mono text-xs">{t.id || "—"}</span></td>
                      <td className="py-2 pr-4">{t.name || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
