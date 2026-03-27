import React, { useEffect } from "react";

export const RoutePolyline = ({
  path = [],
  map,
  strokeColor = "#000000",
  strokeWeight = 3,
}) => {
  const polylineRef = React.useRef(null);

  useEffect(() => {
    if (!window.google?.maps || !map || path.length < 2) return;

    // Clear existing polyline
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Create polyline
    polylineRef.current = new window.google.maps.Polyline({
      path: path.map((p) => ({ lat: p.lat, lng: p.lng })),
      geodesic: true,
      strokeColor,
      strokeOpacity: 1.0,
      strokeWeight,
      map,
    });

    // Fit bounds
    if (path.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      path.forEach((p) => {
        bounds.extend({ lat: p.lat, lng: p.lng });
      });
      map.fitBounds(bounds);
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [path, map, strokeColor, strokeWeight]);

  return null; // Polyline is rendered on the map via Google Maps API
};
