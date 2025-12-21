'use client';
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge';

interface Review {
  id: string;
  userName: string;
  userType: 'client' | 'professional';
  rating: number;
  comment: string;
  date: Date;
  verified: boolean;
}

interface RatingSystemProps {
  targetId: string;
  targetType: 'client' | 'professional';
  currentUserType: 'client' | 'professional';
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
  onSubmitReview?: (review: { rating: number; comment: string }) => void;
}

export const RatingSystem: React.FC<RatingSystemProps> = ({
  targetId,
  targetType,
  currentUserType,
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  onSubmitReview,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await onSubmitReview?.({ rating, comment });
      setRating(0);
      setComment('');
      setShowForm(false);
    } catch (error) {
      console.error('Error al enviar valoración:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const canReview = currentUserType !== targetType;
  
  return (
    <div className="space-y-6">
      {/* Resumen de valoraciones */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-secondary-900 mb-2">
              Valoraciones
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary-600">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-secondary-500">/5</span>
              </div>
              <div>
                <Rating value={averageRating} readonly size="lg" />
                <p className="text-sm text-secondary-600 mt-1">
                  {totalReviews} {totalReviews === 1 ? 'valoración' : 'valoraciones'}
                </p>
              </div>
            </div>
          </div>
          
          {canReview && !showForm && (
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Dejar valoración
            </Button>
          )}
        </div>
      </Card>
      
      {/* Formulario de valoración */}
      {showForm && (
        <Card className="animate-slide-down">
          <h4 className="text-xl font-bold text-secondary-900 mb-4">
            Comparte tu experiencia
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">
                Tu valoración
              </label>
              <Rating
                value={rating}
                onChange={setRating}
              />
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-semibold text-secondary-700 mb-2">
                Comentario
              </label>
              <textarea
                id="comment"
                rows={4}
                className="input-modern w-full"
                placeholder="Cuéntanos sobre tu experiencia..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={rating === 0 || submitting}
              >
                {submitting ? 'Enviando...' : 'Enviar valoración'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setRating(0);
                  setComment('');
                }}
                className="border"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Lista de valoraciones */}
      <div className="space-y-4">
        <h4 className="text-xl font-bold text-secondary-900">
          Opiniones de {targetType === 'professional' ? 'clientes' : 'profesionales'}
        </h4>
        
        {reviews.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-secondary-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-secondary-600">Aún no hay valoraciones</p>
            </div>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} hover>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {review.userName.charAt(0).toUpperCase()}
                </div>
                
                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-secondary-900">
                          {review.userName}
                        </h5>
                        {review.verified && (
                          <Badge variant="success" size="sm">
                            ✓ Verificado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-secondary-500">
                        {review.date.toLocaleDateString('es-CL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Rating value={review.rating} readonly />
                  </div>
                  
                  <p className="text-secondary-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RatingSystem;
