import React, { useEffect, useRef } from "react";

export const MapContainer = ({
  center = { lat: 28.7041, lng: 77.1025 },
  zoom = 15,
  markers = [],
  onMapLoad,
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstances = useRef([]);

  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) return;

    // Create map
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
    });

    onMapLoad?.(mapInstance.current);

    // Add markers
    if (markers.length > 0) {
      markers.forEach((marker) => {
        const markerInstance = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstance.current,
          title: marker.title,
          icon: marker.icon,
        });

        if (marker.onClick) {
          markerInstance.addListener("click", marker.onClick);
        }

        markerInstances.current.push(markerInstance);
      });
    }

    return () => {
      markerInstances.current.forEach((m) => m.setMap(null));
      markerInstances.current = [];
    };
  }, [center, zoom, markers, onMapLoad]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: "300px" }}
    />
  );
};
