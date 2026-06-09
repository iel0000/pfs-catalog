import { useState, useMemo, useEffect } from 'react';
import { useLibrary } from './hooks/useLibrary.js';
import { isUploading } from './utils/format.js';
import Topbar from './components/Topbar.jsx';
import GameTile from './components/GameTile.jsx';
import GameDetailsModal from './components/GameDetailsModal.jsx';
import Pagination from './components/Pagination.jsx';

const PAGE_SIZE = 10;

export default function App() {
  const { data, status, error } = useLibrary();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return data.packages;
    return data.packages.filter(p =>
      p.title.toLowerCase().includes(term) ||
      (p.titleId || '').toLowerCase().includes(term)
    );
  }, [data.packages, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => { setPage(1); }, [search]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.name || 'library').replace(/[^a-z0-9-_]+/gi, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const renderBody = () => {
    if (status === 'loading') {
      return <p className="empty">Loading catalog…</p>;
    }
    if (status === 'error') {
      return (
        <p className="empty">
          Failed to load library: {error}
          <br />
          <small>Make sure <code>public/library.json</code> exists.</small>
        </p>
      );
    }
    if (filtered.length === 0) {
      return (
        <p className="empty">
          {data.packages.length
            ? 'No packages match your search.'
            : 'Catalog is empty.'}
        </p>
      );
    }
    return (
      <>
        <section className={viewMode === 'grid' ? 'grid' : 'list'}>
          {pageItems.map((pkg, i) => (
            <GameTile
              key={(currentPage - 1) * PAGE_SIZE + i}
              pkg={pkg}
              onClick={() => { if (!isUploading(pkg)) setSelected(pkg); }}
            />
          ))}
        </section>
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={setPage}
        />
      </>
    );
  };

  return (
    <>
      <Topbar
        catalogName={data.name}
        packageCount={data.packages.length}
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onToggleView={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
        onExport={handleExport}
        canExport={status === 'ready'}
      />
      <main>{renderBody()}</main>
      {selected && (
        <GameDetailsModal pkg={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
