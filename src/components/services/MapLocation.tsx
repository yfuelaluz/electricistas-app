'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/button';

interface MapLocationProps {
  address?: string;
  lat?: number;
  lng?: number;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
}

export const MapLocation: React.FC<MapLocationProps> = ({
  address,
  lat,
  lng,
  onLocationSelect,
}) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError('La geolocalización no está disponible en tu navegador');
      setLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        onLocationSelect?.(location);
        setLoading(false);
      },
      (err) => {
        setError('No se pudo obtener tu ubicación. Por favor, permite el acceso.');
        setLoading(false);
      }
    );
  };
  
  const openGoogleMaps = (destLat: number, destLng: number) => {
    if (userLocation) {
      // Abrir Google Maps con direcciones
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destLat},${destLng}`;
      window.open(url, '_blank');
    } else {
      // Solo mostrar la ubicación
      const url = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
      window.open(url, '_blank');
    }
  };
  
  const defaultLat = lat || -33.047;
  const defaultLng = lng || -71.627;
  
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-secondary-900">Ubicación</h3>
        <Button
          onClick={getCurrentLocation}
          disabled={loading}
          className="border px-3 py-1.5 text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {loading ? 'Cargando...' : 'Mi ubicación'}
        </Button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {/* Mapa integrado */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-primary-100">
        <iframe
          title="Mapa de ubicación"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${defaultLat},${defaultLng}&zoom=15`}
        />
      </div>
      
      {address && (
        <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-secondary-700 font-medium">{address}</p>
        </div>
      )}
      
      <Button
        variant="accent"
        className="w-full"
        onClick={() => openGoogleMaps(defaultLat, defaultLng)}
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        }
      >
        Cómo llegar
      </Button>
    </Card>
  );
};

export default MapLocation;
