import { useState } from 'react'
import {
  Search,
  Plus,
  Pin,
  Star,
  Trash2,
  FileText,
  Tag,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import './App.css'

const initialNotes = [
  {
    id: 1,
    title: 'Bienvenido a Mi Notes',
    content:
      'Esta es mi primera nota.\n\nAquí puedo escribir mis ideas, proyectos y pensamientos.',
    tags: ['inicio'],
    pinned: true,
    favorite: false,
  },
  {
    id: 2,
    title: 'Ideas para Heartz',
    content:
      'Crear contenido audiovisual con storytelling y propósito.',
    tags: ['heartz', 'ideas'],
    pinned: false,
    favorite: true,
  },
  {
    id: 3,
    title: 'Me vs Me',
    content:
      'Una animación sobre las batallas internas, el miedo y la identidad.',
    tags: ['animation', 'youtube'],
    pinned: false,
    favorite: false,
  },
]

function App() {
  const [notes, setNotes] = useState(initialNotes)
  const [selectedId, setSelectedId] = useState(1)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileView, setMobileView] = useState('editor')

  const selectedNote = notes.find(
    (note) => note.id === selectedId
  )

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content} ${note.tags.join(' ')}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function createNote() {
    const newNote = {
      id: Date.now(),
      title: 'Nueva nota',
      content: '',
      tags: [],
      pinned: false,
      favorite: false,
    }

    setNotes((current) => [newNote, ...current])
    setSelectedId(newNote.id)
    setMobileView('editor')
    setSidebarOpen(false)
  }

  function updateNote(field, value) {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
              ...note,
              [field]: value,
            }
          : note
      )
    )
  }

  function toggleFavorite() {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
              ...note,
              favorite: !note.favorite,
            }
          : note
      )
    )
  }

  function togglePinned() {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
              ...note,
              pinned: !note.pinned,
            }
          : note
      )
    )
  }

  function deleteNote() {
    if (!selectedNote) return

    const remaining = notes.filter(
      (note) => note.id !== selectedId
    )

    setNotes(remaining)

    if (remaining.length > 0) {
      setSelectedId(remaining[0].id)
    } else {
      setSelectedId(null)
    }
  }

  function selectNote(id) {
    setSelectedId(id)
    setMobileView('editor')
    setSidebarOpen(false)
  }

  return (
    <div className="app">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`sidebar ${
          sidebarOpen ? 'sidebar-open' : ''
        }`}
      >

        <div className="sidebar-header">

          <div className="brand">
            <div className="brand-icon">
              M
            </div>

            <span>Mi Notes</span>
          </div>

          <button
            className="icon-button mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>

        <button
          className="new-note"
          onClick={createNote}
        >
          <Plus size={18} />
          Nueva nota
        </button>

        <nav className="navigation">

          <button className="nav-item active">
            <FileText size={18} />
            Todas las notas
            <span>{notes.length}</span>
          </button>

          <button className="nav-item">
            <Star size={18} />
            Favoritas
          </button>

          <button className="nav-item">
            <Pin size={18} />
            Fijadas
          </button>

          <button className="nav-item">
            <Tag size={18} />
            Etiquetas
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <Trash2 size={18} />
            Papelera
          </button>

          <button className="nav-item">
            <Settings size={18} />
            Configuración
          </button>

        </div>

      </aside>

      {/* =========================
          LISTA DE NOTAS
      ========================= */}

      <section
        className={`notes-panel ${
          mobileView === 'notes'
            ? 'mobile-notes-open'
            : ''
        }`}
      >

        <div className="notes-header">

          <div className="mobile-top-actions">

            <button
              className="icon-button mobile-menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

          </div>

          <div>
            <h1>Notas</h1>
            <p>{notes.length} notas</p>
          </div>

          <button
            className="icon-button"
            onClick={createNote}
          >
            <Plus size={21} />
          </button>

        </div>

        <div className="search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar notas..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        <div className="notes-list">

          {filteredNotes.map((note) => (

            <button
              key={note.id}
              className={`note-card ${
                selectedId === note.id
                  ? 'selected'
                  : ''
              }`}
              onClick={() => selectNote(note.id)}
            >

              <div className="note-card-top">

                <h2>{note.title}</h2>

                {note.pinned && (
                  <Pin size={14} />
                )}

              </div>

              <p>
                {note.content || 'Sin contenido'}
              </p>

              <div className="note-meta">

                {note.tags.map((tag) => (
                  <span key={tag}>
                    #{tag}
                  </span>
                ))}

              </div>

            </button>

          ))}

          {filteredNotes.length === 0 && (

            <div className="empty-editor">
              <Search size={32} />

              <h2>
                No encontramos notas
              </h2>

              <p>
                Prueba con otra búsqueda.
              </p>
            </div>

          )}

        </div>

      </section>

      {/* =========================
          EDITOR
      ========================= */}

      <main className="editor">

        {selectedNote ? (

          <>

            <header className="editor-header">

              <button
                className="mobile-back-notes"
                onClick={() =>
                  setMobileView('notes')
                }
              >
                ← Notas
              </button>

              <div className="editor-actions">

                <button
                  className={`icon-button ${
                    selectedNote.pinned
                      ? 'active-pin'
                      : ''
                  }`}
                  onClick={togglePinned}
                  title={
                    selectedNote.pinned
                      ? 'Desfijar'
                      : 'Fijar'
                  }
                >
                  <Pin size={19} />
                </button>

                <button
                  className={`icon-button ${
                    selectedNote.favorite
                      ? 'active-star'
                      : ''
                  }`}
                  onClick={toggleFavorite}
                  title={
                    selectedNote.favorite
                      ? 'Quitar de favoritos'
                      : 'Añadir a favoritos'
                  }
                >
                  <Star
                    size={19}
                    fill={
                      selectedNote.favorite
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>

                <button
                  className="icon-button danger"
                  onClick={deleteNote}
                  title="Eliminar"
                >
                  <Trash2 size={19} />
                </button>

              </div>

            </header>

            <div className="editor-content">

              <input
                className="title-input"
                value={selectedNote.title}
                onChange={(event) =>
                  updateNote(
                    'title',
                    event.target.value
                  )
                }
                placeholder="Título"
              />

              <div className="tag-editor">

                {selectedNote.tags.map((tag) => (
                  <span key={tag}>
                    #{tag}
                  </span>
                ))}

              </div>

              <textarea
                className="content-input"
                value={selectedNote.content}
                onChange={(event) =>
                  updateNote(
                    'content',
                    event.target.value
                  )
                }
                placeholder="Empieza a escribir..."
              />

            </div>

            <footer className="editor-footer">
              Guardado localmente
            </footer>

          </>

        ) : (

          <div className="empty-editor">

            <FileText size={42} />

            <h2>
              No hay notas
            </h2>

            <p>
              Crea una nueva para comenzar.
            </p>

            <button
              className="new-note"
              onClick={createNote}
            >
              <Plus size={18} />
              Nueva nota
            </button>

          </div>

        )}

      </main>

      {/* =========================
          SIDEBAR OVERLAY
      ========================= */}

      {sidebarOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

    </div>
  )
}

export default App