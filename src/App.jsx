
import { useEffect, useMemo, useRef, useState } from 'react'
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
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react'
import './App.css'

const STORAGE_KEY = 'mi-notes-data'

const initialNotes = [
  {
    id: 1,
    title: 'Bienvenido a Mi Notes',
    content:
      'Esta es mi primera nota.\n\nAquí puedo escribir mis ideas, proyectos y pensamientos.',
    tags: ['inicio'],
    pinned: true,
    favorite: false,
    deleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 2,
    title: 'Ideas para Heartz',
    content:
      'Crear contenido audiovisual con storytelling y propósito.',
    tags: ['heartz', 'ideas'],
    pinned: false,
    favorite: true,
    deleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 3,
    title: 'Me vs Me',
    content:
      'Una animación sobre las batallas internas, el miedo y la identidad.',
    tags: ['animation', 'youtube'],
    pinned: false,
    favorite: false,
    deleted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return initialNotes
    }

    const parsed = JSON.parse(saved)

    if (!Array.isArray(parsed)) {
      return initialNotes
    }

    return parsed
  } catch {
    return initialNotes
  }
}

function App() {
  const [notes, setNotes] = useState(loadNotes)
  const [selectedId, setSelectedId] = useState(1)
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileView, setMobileView] = useState('editor')
  const [activeSection, setActiveSection] = useState('all')
  const [tagMenuOpen, setTagMenuOpen] = useState(false)

  const [selectedTags, setSelectedTags] = useState([])
  const [excludedTags, setExcludedTags] = useState([])
const fileInputRef = useRef(null)

  /*
   * GUARDADO AUTOMÁTICO
   */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    )
  }, [notes])

  /*
   * NOTAS
   */

  const activeNotes = useMemo(
    () =>
      notes.filter(
        (note) => !note.deleted
      ),
    [notes]
  )

  const deletedNotes = useMemo(
    () =>
      notes.filter(
        (note) => note.deleted
      ),
    [notes]
  )

  /*
   * ETIQUETAS
   */

  const allTags = useMemo(() => {
    const tags = activeNotes.flatMap(
      (note) => note.tags || []
    )

    return [...new Set(tags)].sort()
  }, [activeNotes])

  /*
   * NOTA SELECCIONADA
   */

  const selectedNote = notes.find(
    (note) => note.id === selectedId
  )

  /*
   * FILTROS
   */

  const filteredNotes = useMemo(() => {
    let result = notes

    if (activeSection === 'trash') {
      result = result.filter(
        (note) => note.deleted
      )
    } else {
      result = result.filter(
        (note) => !note.deleted
      )
    }

    if (activeSection === 'favorites') {
      result = result.filter(
        (note) => note.favorite
      )
    }

    if (activeSection === 'pinned') {
      result = result.filter(
        (note) => note.pinned
      )
    }

    // FILTRO MÚLTIPLE DE ETIQUETAS
    if (selectedTags.length > 0) {
      result = result.filter((note) =>
        selectedTags.every((tag) =>
          note.tags?.includes(tag)
        )
      )
    }

    // ANTI-SELECCIÓN
    if (excludedTags.length > 0) {
      result = result.filter((note) =>
        excludedTags.every(
          (tag) =>
            !note.tags?.includes(tag)
        )
      )
    }

    if (search.trim()) {
      const query = search.toLowerCase()

      result = result.filter((note) =>
        `${note.title} ${note.content
          } ${note.tags?.join(' ') || ''
          }`
          .toLowerCase()
          .includes(query)
      )
    }






    return result
  }, [
    notes,
    activeSection,
    search,
    selectedTags,
    excludedTags,
  ])
function toggleTag(tag) {
  setSelectedTags((current) => {
    if (current.includes(tag)) {
      return current.filter(
        (item) => item !== tag
      )
    }

    return [...current, tag]
  })

  setExcludedTags((current) =>
    current.filter(
      (item) => item !== tag
    )
  )
}

function toggleExcludedTag(tag) {
  setExcludedTags((current) => {
    if (current.includes(tag)) {
      return current.filter(
        (item) => item !== tag
      )
    }

    return [...current, tag]
  })

  setSelectedTags((current) =>
    current.filter(
      (item) => item !== tag
    )
  )
}
  /*
   * CREAR NOTA
   */

  function createNote() {
    const now = Date.now()

    const newNote = {
      id: now,
      title: 'Nueva nota',
      content: '',
      tags: [],
      pinned: false,
      favorite: false,
      deleted: false,
      createdAt: now,
      updatedAt: now,
    }

    setNotes((current) => [
      newNote,
      ...current,
    ])

    setSelectedId(newNote.id)
    setActiveSection('all')
    setMobileView('editor')
    setSidebarOpen(false)
  }

  /*
   * ACTUALIZAR NOTA
   */

  function updateNote(
    field,
    value
  ) {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
            ...note,
            [field]: value,
            updatedAt: Date.now(),
          }
          : note
      )
    )
  }

  /*
   * FAVORITA
   */

  function toggleFavorite() {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
            ...note,
            favorite:
              !note.favorite,
            updatedAt:
              Date.now(),
          }
          : note
      )
    )
  }

  /*
   * FIJAR
   */

  function togglePinned() {
    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
            ...note,
            pinned:
              !note.pinned,
            updatedAt:
              Date.now(),
          }
          : note
      )
    )
  }

  /*
   * MOVER A PAPELERA
   */

  function deleteNote() {
    if (!selectedNote) return

    setNotes((current) =>
      current.map((note) =>
        note.id === selectedId
          ? {
            ...note,
            deleted: true,
            updatedAt:
              Date.now(),
          }
          : note
      )
    )

    const nextNote =
      activeNotes.find(
        (note) =>
          note.id !== selectedId
      )

    setSelectedId(
      nextNote?.id || null
    )
  }

  /*
   * RESTAURAR
   */

  function restoreNote(id) {
    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
            ...note,
            deleted: false,
            updatedAt:
              Date.now(),
          }
          : note
      )
    )

    setSelectedId(id)
    setActiveSection('all')
    setMobileView('editor')
  }

  /*
   * ELIMINAR DEFINITIVAMENTE
   */

  function permanentlyDelete(id) {
    setNotes((current) =>
      current.filter(
        (note) => note.id !== id
      )
    )

    if (selectedId === id) {
      setSelectedId(null)
    }
  }

  /*
   * SELECCIONAR NOTA
   */

  function selectNote(id) {
    setSelectedId(id)
    setMobileView('editor')
    setSidebarOpen(false)
  }

  /*
   * SELECCIONAR SECCIÓN
   */

  function selectSection(
    section
  ) {
    setActiveSection(section)
    setSidebarOpen(false)

    const firstNote =
      notes.find((note) => {
        if (section === 'trash') {
          return note.deleted
        }

        if (
          section === 'favorites'
        ) {
          return (
            !note.deleted &&
            note.favorite
          )
        }

        if (
          section === 'pinned'
        ) {
          return (
            !note.deleted &&
            note.pinned
          )
        }



        return !note.deleted
      })

    if (firstNote) {
      setSelectedId(
        firstNote.id
      )
    }

    if (
      window.innerWidth <= 700
    ) {
      setMobileView('notes')
    }
  }

  /*
   * BACKUP
   */

  function exportBackup() {
    const backup = {
      app: 'Mi Notes',
      version: 1,
      exportedAt:
        new Date().toISOString(),
      notes,
    }

    const blob = new Blob(
      [
        JSON.stringify(
          backup,
          null,
          2
        ),
      ],
      {
        type: 'application/json',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement(
        'a'
      )

    link.href = url

    link.download =
      `mi-notes-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`

    document.body.appendChild(
      link
    )

    link.click()

    document.body.removeChild(
      link
    )

    URL.revokeObjectURL(url)
  }

function importBackup(event) {
  const file = event.target.files?.[0]

  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    try {
      const backup = JSON.parse(reader.result)

      if (!Array.isArray(backup.notes)) {
        alert('El archivo no es un backup válido de Mi Notes.')
        return
      }

      setNotes(backup.notes)

      if (backup.notes.length > 0) {
        setSelectedId(backup.notes[0].id)
      }

      alert('Backup importado correctamente.')
    } catch {
      alert('No se pudo leer el backup.')
    }
  }

  reader.readAsText(file)

  event.target.value = ''
}


  /*
   * CONTADORES
   */

  const favoriteCount =
    activeNotes.filter(
      (note) =>
        note.favorite
    ).length

  const pinnedCount =
    activeNotes.filter(
      (note) =>
        note.pinned
    ).length

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${sidebarOpen
          ? 'sidebar-open'
          : ''
          }`}
      >

        <div className="sidebar-header">

          <div className="brand">

            <div className="brand-icon">
              M
            </div>

            <span>
              Mi Notes
            </span>

          </div>

          <button
            className="icon-button mobile-close"
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
          >
            <X size={20} />
          </button>

        </div>

        <button
          className="new-note"
          onClick={
            createNote
          }
        >
          <Plus size={18} />
          Nueva nota
        </button>

        <nav className="navigation">

          <button
            className={`nav-item ${activeSection ===
              'all'
              ? 'active'
              : ''
              }`}
            onClick={() =>
              selectSection(
                'all'
              )
            }
          >
            <FileText size={18} />
            Todas las notas
            <span>
              {activeNotes.length}
            </span>
          </button>

          <button
            className={`nav-item ${activeSection ===
              'favorites'
              ? 'active'
              : ''
              }`}
            onClick={() =>
              selectSection(
                'favorites'
              )
            }
          >
            <Star size={18} />
            Favoritas
            <span>
              {favoriteCount}
            </span>
          </button>

          <button
            className={`nav-item ${activeSection ===
              'pinned'
              ? 'active'
              : ''
              }`}
            onClick={() =>
              selectSection(
                'pinned'
              )
            }
          >
            <Pin size={18} />
            Fijadas
            <span>
              {pinnedCount}
            </span>
          </button>

          <div className="nav-section-title">
            Etiquetas
          </div>

          {allTags.map((tag) => {
            const isSelected =
              selectedTags.includes(tag)

            const isExcluded =
              excludedTags.includes(tag)

            return (
              <div
                key={tag}
                className={`tag-filter-row ${isSelected
                  ? 'selected'
                  : ''
                  } ${isExcluded
                    ? 'excluded'
                    : ''
                  }`}
              >

                <button
                  className="tag-filter-main"
                  onClick={() =>
                    toggleTag(tag)
                  }
                >
                  <Tag size={15} />

                  <span>
                    #{tag}
                  </span>
                </button>

                <button
                  className={`tag-eye ${isExcluded
                    ? 'eye-active'
                    : ''
                    }`}
                  onClick={() =>
                    toggleExcludedTag(
                      tag
                    )
                  }
                  title={
                    isExcluded
                      ? 'Incluir esta etiqueta'
                      : 'Excluir esta etiqueta'
                  }
                >
                  {isExcluded ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>

              </div>
            )
          })}

        </nav>

        <div className="sidebar-bottom">

          <button
            className={`nav-item ${activeSection ===
              'trash'
              ? 'active'
              : ''
              }`}
            onClick={() =>
              selectSection(
                'trash'
              )
            }
          >
            <Trash2 size={18} />
            Papelera
            <span>
              {deletedNotes.length}
            </span>
          </button>

      <input
  ref={fileInputRef}
  type="file"
  accept=".json,application/json"
  hidden
  onChange={importBackup}
/>

<button
  className="nav-item"
  onClick={() =>
    fileInputRef.current?.click()
  }
>
  <RotateCcw size={18} />
  Importar backup
</button>

<button
  className="nav-item"
  onClick={exportBackup}
>
  <Settings size={18} />
  Exportar backup
</button>

        </div>

      </aside>

      {/* LISTA */}

      <section
        className={`notes-panel ${mobileView ===
          'notes'
          ? 'mobile-notes-open'
          : ''
          }`}
      >

        <div className="notes-header">

          <div className="mobile-top-actions">

            <button
              className="icon-button mobile-menu"
              onClick={() =>
                setSidebarOpen(
                  true
                )
              }
            >
              <Menu size={21} />
            </button>

          </div>

          <div>

            <h1>

           {activeSection === 'favorites'
  ? 'Favoritas'
  : activeSection === 'pinned'
  ? 'Fijadas'
  : activeSection === 'trash'
  ? 'Papelera'
  : selectedTags.length > 0 || excludedTags.length > 0
  ? 'Etiquetas'
  : 'Notas'}

            </h1>

            <p>
              {
                filteredNotes.length
              }{' '}
              {filteredNotes.length ===
                1
                ? 'nota'
                : 'notas'}
            </p>

          </div>

          <button
            className="icon-button"
            onClick={
              createNote
            }
          >
            <Plus size={21} />
          </button>

        </div>

        <div className="search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar notas..."
            value={
              search
            }
            onChange={(
              event
            ) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>

        <div className="notes-list">

          {filteredNotes.map(
            (note) => (

              <div
                key={note.id}
                className={`note-card ${selectedId ===
                  note.id
                  ? 'selected'
                  : ''
                  }`}
              >

                <button
                  className="note-card-main"
                  onClick={() =>
                    selectNote(
                      note.id
                    )
                  }
                >

                  <div className="note-card-top">

                    <h2>
                      {
                        note.title
                      }
                    </h2>

                    {note.pinned && (
                      <Pin size={14} />
                    )}

                  </div>

                  <p>
                    {note.content ||
                      'Sin contenido'}
                  </p>

                  <div className="note-meta">

                    {note.tags?.map(
                      (tag) => (
                        <span
                          key={tag}
                        >
                          #{tag}
                        </span>
                      )
                    )}

                  </div>

                </button>

                {note.deleted && (

                  <div className="trash-actions">

                    <button
                      onClick={() =>
                        restoreNote(
                          note.id
                        )
                      }
                      title="Restaurar"
                    >
                      <RotateCcw
                        size={15}
                      />
                    </button>

                    <button
                      onClick={() =>
                        permanentlyDelete(
                          note.id
                        )
                      }
                      title="Eliminar definitivamente"
                    >
                      <Trash2
                        size={15}
                      />
                    </button>

                  </div>

                )}

              </div>

            )
          )}

          {filteredNotes.length ===
            0 && (

              <div className="empty-editor">

                <Search size={32} />

                <h2>
                  {activeSection ===
                    'trash'
                    ? 'Papelera vacía'
                    : 'No encontramos notas'}
                </h2>

                <p>
                  {activeSection ===
                    'trash'
                    ? 'Las notas eliminadas aparecerán aquí.'
                    : 'Prueba con otra búsqueda.'}
                </p>

              </div>

            )}

        </div>

      </section>

      {/* EDITOR */}

      <main className="editor">

        {selectedNote &&
          !selectedNote.deleted ? (

          <>

            <header className="editor-header">

              <button
                className="mobile-back-notes"
                onClick={() =>
                  setMobileView(
                    'notes'
                  )
                }
              >
                ← Notas
              </button>

              <div className="editor-actions">

                <button
                  className={`icon-button ${selectedNote.pinned
                    ? 'active-pin'
                    : ''
                    }`}
                  onClick={
                    togglePinned
                  }
                  title={
                    selectedNote.pinned
                      ? 'Desfijar'
                      : 'Fijar'
                  }
                >
                  <Pin size={19} />
                </button>

                <button
                  className={`icon-button ${selectedNote.favorite
                    ? 'active-star'
                    : ''
                    }`}
                  onClick={
                    toggleFavorite
                  }
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
                  onClick={
                    deleteNote
                  }
                  title="Mover a papelera"
                >
                  <Trash2 size={19} />
                </button>

              </div>

            </header>

            <div className="editor-content">

              <input
                className="title-input"
                value={
                  selectedNote.title
                }
                onChange={(
                  event
                ) =>
                  updateNote(
                    'title',
                    event.target
                      .value
                  )
                }
                placeholder="Título"
              />

              <div className="tag-editor">

                {selectedNote.tags?.map(
                  (tag) => (
                    <span
                      key={tag}
                      className="tag-chip"
                    >
                      #{tag}

                      <button
                        type="button"
                        onClick={() =>
                          updateNote(
                            'tags',
                            selectedNote.tags.filter(
                              (item) =>
                                item !== tag
                            )
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  )
                )}

                <div className="tag-picker">

                  <button
                    type="button"
                    className="add-tag-button"
                    onClick={() =>
                      setTagMenuOpen(
                        !tagMenuOpen
                      )
                    }
                  >
                    + Añadir etiqueta
                  </button>

                  {tagMenuOpen && (
                    <div className="tag-menu">

                      {allTags
                        .filter(
                          (tag) =>
                            !selectedNote.tags?.includes(
                              tag
                            )
                        )
                        .map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className="tag-menu-item"
                            onClick={() => {
                              updateNote(
                                'tags',
                                [
                                  ...(selectedNote.tags ||
                                    []),
                                  tag,
                                ]
                              )

                              setTagMenuOpen(false)
                            }}
                          >
                            #{tag}
                          </button>
                        ))}

                      <button
                        type="button"
                        className="tag-menu-new"
                        onClick={() => {

                          const tag =
                            window.prompt(
                              'Nueva etiqueta:'
                            )

                          if (!tag) return

                          const cleanTag =
                            tag
                              .trim()
                              .replace(
                                /^#/,
                                ''
                              )
                              .replace(
                                /\s+/g,
                                '-'
                              )
                              .toLowerCase()

                          if (!cleanTag)
                            return

                          if (
                            selectedNote.tags?.includes(
                              cleanTag
                            )
                          ) {
                            return
                          }

                          updateNote(
                            'tags',
                            [
                              ...(selectedNote.tags ||
                                []),
                              cleanTag,
                            ]
                          )

                          setTagMenuOpen(false)
                        }}
                      >
                        + Crear nueva etiqueta
                      </button>

                    </div>
                  )}

                </div>

              </div>

              <textarea
                className="content-input"
                value={
                  selectedNote.content
                }
                onChange={(
                  event
                ) =>
                  updateNote(
                    'content',
                    event.target
                      .value
                  )
                }
                placeholder="Empieza a escribir..."
              />

            </div>

            <footer className="editor-footer">
              Guardado automáticamente
            </footer>

          </>

        ) : (

          <div className="empty-editor">

            <FileText size={42} />

            <h2>
              {activeSection ===
                'trash'
                ? 'Nota en la papelera'
                : 'No hay notas'}
            </h2>

            <p>
              Selecciona una nota para editarla.
            </p>

          </div>

        )}

      </main>

      {/* OVERLAY */}

      {sidebarOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
        />

      )}

    </div>
  )
}

export default App

