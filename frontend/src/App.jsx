import { useAuth0 } from '@auth0/auth0-react'
import Avaliacoes from './Avaliacoes'

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } = useAuth0()

  if (isLoading) return <p>Carregando...</p>

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Sistema de Avaliações</h1>
        <button onClick={() => loginWithRedirect()}>Entrar</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Logado como <b>{user?.email}</b></span>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Sair
        </button>
      </div>
      <Avaliacoes />
    </div>
  )
}

export default App