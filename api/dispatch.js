// Vercel serverless function: POST { site, slug } -> GitHub repository_dispatch
export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'POST only' })
    const { site, slug } = req.body || {}

    const map = {
      chakrishar: 'vajradog/chakrishar-blog',
      /gamchung: 'vajradog/gamchung-blog',
      // gamchung: 'vajradog/gamchung-blog',
      // tibetancalligraphy: 'vajradog/tibetancalligraphy-blog',
    }

    const repo = map[site]
    if (!repo) return res.status(400).json({ ok:false, error:'Unknown site' })

    const r = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GH_PAT}`,
      },
      body: JSON.stringify({ event_type: 'sanity_publish', client_payload: { site, slug } }),
    })

    return res.status(r.status).json({ ok: r.ok })
  } catch (e) {
    return res.status(500).json({ ok:false, error: String(e) })
  }
}
