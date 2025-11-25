import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:5000/api'

function App() {
  const [health, setHealth] = useState(null)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_URL}/health`)
      setHealth(response.data)
    } catch (error) {
      setHealth({ status: 'ERROR', message: 'Backend unreachable' })
    }
  }

  const loadBooks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_URL}/books`)
      setBooks(response.data.data || [])
    } catch (error) {
      console.error('Error loading books:', error)
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  const createSampleBooks = async () => {
    try {
      await axios.post(`${API_URL}/books/samples/create`)
      alert('Sample books created successfully!')
      loadBooks()
    } catch (error) {
      alert('Error creating sample books: ' + error.message)
    }
  }

  useEffect(() => {
    checkHealth()
    loadBooks()
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>📚 WebReader</h1>
        <p>Digital Library Platform</p>
      </header>

      <main className="main">
        {/* Health Status */}
        <section className="section">
          <h2>Backend Status</h2>
          <div className={`status ${health?.status === 'OK' ? 'success' : health ? 'error' : 'loading'}`}>
            {health ? (
              <>
                <p><strong>Status:</strong> {health.status}</p>
                <p><strong>Message:</strong> {health.message}</p>
                <p><strong>Time:</strong> {health.timestamp}</p>
              </>
            ) : (
              <p>Checking backend status...</p>
            )}
          </div>
          <button onClick={checkHealth} className="button">Refresh Status</button>
        </section>

        {/* Books Section */}
        <section className="section">
          <div className="section-header">
            <h2>Books Management</h2>
            <button onClick={createSampleBooks} className="button primary">
              Create Sample Books
            </button>
          </div>

          {loading ? (
            <p>Loading books...</p>
          ) : (
            <div className="books-grid">
              {books.map(book => (
                <div key={book.id} className="book-card">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Year:</strong> {book.year}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Pages:</strong> {book.page_count}</p>
                </div>
              ))}
              {books.length === 0 && (
                <p className="no-books">No books available. Create some sample books to get started.</p>
              )}
            </div>
          )}
          <button onClick={loadBooks} className="button">Refresh Books</button>
        </section>

        {/* API Endpoints */}
        <section className="section">
          <h2>API Endpoints</h2>
          <div className="endpoints">
            <div className="endpoint">
              <code>GET /api/health</code> - Health check
            </div>
            <div className="endpoint">
              <code>GET /api/books</code> - List books
            </div>
            <div className="endpoint">
              <code>POST /api/books/samples/create</code> - Create sample books
            </div>
            <div className="endpoint">
              <code>POST /api/auth/register</code> - User registration
            </div>
            <div className="endpoint">
              <code>POST /api/auth/login</code> - User login
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App