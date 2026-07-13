
import { useState } from 'react'
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { logout, user } = useAuth()

  return (
    <main className="container min-vh-100 py-5">
      <header className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div className="text-start">
          <h1 className="h3 mb-1">FootCentral</h1>
          <p className="text-muted">Bem-vindo, {user?.name || user?.email}.</p>
        </div>

        <button className="btn btn-outline-secondary" type="button" onClick={logout}>
          Sair
        </button>
      </header>

      <section className="card border-0 shadow-sm text-start">
        <div className="card-body p-4">
          <h2 className="h5 mb-2">Dashboard</h2>
          <p className="text-muted mb-0">
            Login concluido. A proxima funcionalidade pode entrar aqui.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Dashboard
