import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'

const API_URL = '/api'
const NAMESPACE = 'https://social-insper.com/'

export default function Avaliacoes() {
  const { getAccessTokenSilently } = useAuth0()
  const [avaliacoes, setAvaliacoes] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({ emailAvaliado: '', comentarios: '', nota: '' })

  // 1) Ao abrir a tela: pega o crachá, descobre se é ADMIN e carrega a lista
  useEffect(() => {
    const iniciar = async () => {
      const token = await getAccessTokenSilently()
      const payload = JSON.parse(atob(token.split('.')[1]))
      const roles = payload[`${NAMESPACE}roles`] || []
      setIsAdmin(roles.includes('ADMIN'))
      carregar()
    }
    iniciar().catch((e) => setErro(e.message))
  }, [])

  // 2) GET /avaliacoes (ADMIN e USER)
  const carregar = async () => {
    try {
      setErro('')
      const token = await getAccessTokenSilently()
      const resp = await fetch(`${API_URL}/avaliacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!resp.ok) throw new Error(`Erro ${resp.status} ao listar`)
      setAvaliacoes(await resp.json())
    } catch (e) {
      setErro(e.message)
    }
  }

  // 3) POST /avaliacoes (só ADMIN)
  const cadastrar = async (e) => {
    e.preventDefault()
    try {
      setErro('')
      const token = await getAccessTokenSilently()
      const resp = await fetch(`${API_URL}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, nota: Number(form.nota) }),
      })
      if (!resp.ok) throw new Error(`Erro ${resp.status} ao cadastrar`)
      setForm({ emailAvaliado: '', comentarios: '', nota: '' })
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <h1>Avaliações</h1>

      {isAdmin && (
        <form onSubmit={cadastrar} style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
          <h2>Nova avaliação</h2>
          <input
            type="email"
            placeholder="Email do avaliado"
            value={form.emailAvaliado}
            onChange={(e) => setForm({ ...form, emailAvaliado: e.target.value })}
            required
          />
          <textarea
            placeholder="Comentários"
            value={form.comentarios}
            onChange={(e) => setForm({ ...form, comentarios: e.target.value })}
          />
          <input
            type="number"
            min="0"
            max="10"
            placeholder="Nota (0 a 10)"
            value={form.nota}
            onChange={(e) => setForm({ ...form, nota: e.target.value })}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
      )}

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Avaliador</th>
            <th>Avaliado</th>
            <th>Nota</th>
            <th>Comentários</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {avaliacoes.map((a) => (
            <tr key={a.id}>
              <td>{a.emailAvaliador}</td>
              <td>{a.emailAvaliado}</td>
              <td>{a.nota}</td>
              <td>{a.comentarios}</td>
              <td>{new Date(a.dataAvaliacao).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}