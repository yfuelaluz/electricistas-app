'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { TrabajoPortfolio } from '@/types/portfolio';

interface PortfolioManagerProps {
  profesionalId: string;
  plan?: string;
}

export default function PortfolioManager({ profesionalId, plan = 'basico' }: PortfolioManagerProps) {
  const [trabajos, setTrabajos] = useState<TrabajoPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<TrabajoPortfolio | null>(null);

  // Límites por plan
  const getLimitesFotos = () => {
    switch(plan?.toLowerCase()) {
      case 'basico':
      case 'starter':
        return 3;
      case 'profesional':
      case 'pro':
        return 10;
      case 'elite':
      case 'vip':
        return 999; // ilimitado
      default:
        return 3;
    }
  };

  const limiteFotos = getLimitesFotos();

  // Form state
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'instalacion' as const,
    imagenes: [] as string[],
    ubicacion: '',
    duracion: '',
    destacado: false,
  });

  useEffect(() => {
    cargarTrabajos();
  }, [profesionalId]);

  const cargarTrabajos = async () => {
    try {
      const response = await fetch(`/api/portfolio?profesionalId=${profesionalId}`);
      const data = await response.json();
      setTrabajos(data.trabajos || []);
    } catch (error) {
      console.error('Error al cargar portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editando ? '/api/portfolio' : '/api/portfolio';
      const method = editando ? 'PUT' : 'POST';
      
      const body = editando
        ? { id: editando.id, ...formData }
        : { profesionalId, ...formData };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Error al guardar');

      await cargarTrabajos();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar este trabajo del portfolio?')) return;

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      await cargarTrabajos();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEditar = (trabajo: TrabajoPortfolio) => {
    setEditando(trabajo);
    setFormData({
      titulo: trabajo.titulo,
      descripcion: trabajo.descripcion,
      categoria: trabajo.categoria as any,
      imagenes: trabajo.imagenes,
      ubicacion: trabajo.ubicacion || '',
      duracion: trabajo.duracion || '',
      destacado: trabajo.destacado || false,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditando(null);
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: 'instalacion',
      imagenes: [],
      ubicacion: '',
      duracion: '',
      destacado: false,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imagenesActuales = formData.imagenes.length;
    const nuevasImagenes = Array.from(files);
    const totalDespuesDeAgregar = imagenesActuales + nuevasImagenes.length;

    // Verificar límite
    if (totalDespuesDeAgregar > limiteFotos) {
      alert(`Tu plan ${plan} permite máximo ${limiteFotos} fotos por trabajo.\nActualmente tienes ${imagenesActuales} foto${imagenesActuales !== 1 ? 's' : ''}.\nPuedes agregar ${limiteFotos - imagenesActuales} más.`);
      return;
    }

    nuevasImagenes.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({
          ...prev,
          imagenes: [...prev.imagenes, base64]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const categorias = [
    { value: 'instalacion', label: 'Instalación' },
    { value: 'reparacion', label: 'Reparación' },
    { value: 'proyecto', label: 'Proyecto' },
    { value: 'iluminacion', label: 'Iluminación' },
    { value: 'solar', label: 'Panel Solar' },
    { value: 'automatizacion', label: 'Automatización' },
    { value: 'otro', label: 'Otro' },
  ];

  const fieldStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.08)',
    color: 'white',
    outline: 'none',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'white' }}>
            Mi Portfolio
          </h2>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Muestra tus mejores trabajos para atraer más clientes
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-semibold"
        >
          + Agregar Trabajo
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-cyan-400 border-b-cyan-400 border-l-transparent border-r-transparent"></div>
        </div>
      ) : trabajos.length === 0 ? (
        <div className="text-center py-20" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px' }}>
          <p className="text-lg font-semibold mb-2">No tienes trabajos en tu portfolio</p>
          <p style={{ color: '#94a3b8' }}>Comienza agregando tus mejores proyectos</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajos.map((trabajo) => (
            <div
              key={trabajo.id}
              className="p-4"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px'
              }}
            >
              {trabajo.imagenes && trabajo.imagenes.length > 0 && (
                <img
                  src={trabajo.imagenes[0]}
                  alt={trabajo.titulo}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold flex-1">{trabajo.titulo}</h3>
                {trabajo.destacado && (
                  <Badge variant="primary" size="sm">⭐ Destacado</Badge>
                )}
              </div>

              <Badge variant="success" size="sm" className="mb-3">
                {categorias.find(c => c.value === trabajo.categoria)?.label}
              </Badge>

              <p className="text-sm mb-4 line-clamp-3" style={{ color: '#cbd5e1' }}>
                {trabajo.descripcion}
              </p>

              {trabajo.ubicacion && (
                <p className="text-xs mb-2 flex items-center gap-1" style={{ color: '#94a3b8' }}>
                  <span>📍</span> {trabajo.ubicacion}
                </p>
              )}

              {trabajo.duracion && (
                <p className="text-xs mb-4 flex items-center gap-1" style={{ color: '#94a3b8' }}>
                  <span>⏱️</span> {trabajo.duracion}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-sm py-2"
                  onClick={() => handleEditar(trabajo)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 text-sm py-2"
                  onClick={() => handleEliminar(trabajo.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'white' }}>
              {editando ? 'Editar Trabajo' : 'Agregar Trabajo'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Título del trabajo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="ej: Instalación eléctrica residencial completa"
                  style={fieldStyle}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Categoría *
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                  style={fieldStyle}
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value} style={{ background: '#1e293b' }}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Descripción *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el trabajo realizado, técnicas utilizadas, resultados..."
                  style={{ ...fieldStyle, minHeight: '100px' }}
                />
              </div>

              {/* Upload de Imágenes */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                  Fotos del trabajo
                  <span className="ml-2 text-xs" style={{ color: '#94a3b8' }}>
                    ({formData.imagenes.length}/{limiteFotos} {limiteFotos === 999 ? '(ilimitadas)' : 'fotos'})
                  </span>
                </label>
                
                {/* Mensaje de límite de plan */}
                {limiteFotos < 999 && (
                  <div className="mb-3 p-3 rounded-lg" style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)' }}>
                    <p className="text-xs" style={{ color: '#22d3ee' }}>
                      📌 Tu plan <strong>{plan}</strong> permite hasta <strong>{limiteFotos} fotos</strong> por trabajo.
                      {limiteFotos === 3 && ' Actualiza a Pro para 10 fotos o Elite para ilimitadas.'}
                      {limiteFotos === 10 && ' Actualiza a Elite para fotos ilimitadas.'}
                    </p>
                  </div>
                )}
                
                {/* Botón para subir fotos */}
                <div className="mb-4">
                  <label
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${formData.imagenes.length >= limiteFotos ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      background: 'rgba(34, 211, 238, 0.1)',
                      border: '2px dashed rgba(34, 211, 238, 0.4)',
                      color: '#22d3ee'
                    }}
                  >
                    <span>📷</span>
                    <span>{formData.imagenes.length >= limiteFotos ? 'Límite alcanzado' : 'Seleccionar Fotos'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={formData.imagenes.length >= limiteFotos}
                    />
                  </label>
                  <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
                    Puedes seleccionar múltiples fotos (JPG, PNG, WebP)
                  </p>
                </div>

                {/* Vista previa de imágenes */}
                {formData.imagenes.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {formData.imagenes.map((img, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                        style={{ aspectRatio: '1/1' }}
                      >
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    placeholder="ej: Santiago, Las Condes"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#a5f3fc' }}>
                    Duración
                  </label>
                  <input
                    type="text"
                    value={formData.duracion}
                    onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                    placeholder="ej: 3 días, 1 semana"
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    className="w-5 h-5 rounded"
                  />
                  <span className="text-sm font-semibold" style={{ color: '#a5f3fc' }}>
                    Marcar como destacado (aparecerá primero en tu perfil)
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-cyan-400 text-slate-900 hover:bg-cyan-300 font-semibold"
                >
                  {editando ? 'Actualizar' : 'Agregar'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
