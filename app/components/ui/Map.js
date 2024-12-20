"use client";

import React, { useEffect, useState } from "react";
import UTMLatLng from "utm-latlng";
import { Loader } from "@googlemaps/js-api-loader";

export function Map({
  ida,
  vuelta,
  idaAddress,
  vueltaAddress,
  longName,
  shortName,
  type,
}) {
  const mapRef = React.useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [showIda, setShowIda] = useState(true);
  const [showVuelta, setShowVuelta] = useState(true);
  const idaLineRef = React.useRef(null);
  const vueltaLineRef = React.useRef(null);
  const idaMarkersRef = React.useRef([]);
  const vueltaMarkersRef = React.useRef([]);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
        version: "weekly",
      });

      const { Map, InfoWindow, Polyline } = await loader.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } =
        await google.maps.importLibrary("marker");

      const vhsPosition = { lat: 17.98689, lng: -92.93028 };
      const utm = new UTMLatLng();

      const mapOptions = {
        center: vhsPosition,
        zoom: 14,
        mapId: "MY_NEXTJS_MAPID",
      };

      const map = new Map(mapRef.current, mapOptions);
      setMapInstance(map);
      const infoWindow = new InfoWindow();
      const pathCoordinatesIda = [];
      const pathCoordinatesVuelta = [];

      // Agregar markers y rutas de ida
      idaMarkersRef.current = ida.map((element, index) => {
        const parser = new DOMParser();
        const pinSvgString =
          '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M10 5h7c2.761 0 5 3.134 5 7v5h-2" /><path d="M16 17h-8" /><path d="M16 5l1.5 7h4.5" /><path d="M9.5 10h7.5" /><path d="M12 5v5" /><path d="M5 9v11" /></svg>';
        const pinSvg = parser.parseFromString(
          pinSvgString,
          "image/svg+xml"
        ).documentElement;

        const contentString =
          "<div>" +
          `<h1 class="text-base uppercase font-bold"><b>${element.name}</b></h1>` +
          `<span class="text-xs font-light italic">${idaAddress}</span>` +
          `<p class="text-md">${element.road}</p>` +
          "</div>";

        const pin = new PinElement({
          glyph: pinSvg,
          glyphColor: "#ffffff",
          background: "#16537e",
          borderColor: "#2986cc",
        });

        const latLng = utm.convertUtmToLatLng(
          element.latitude,
          element.altitude,
          15,
          "N"
        );
        pathCoordinatesIda.push(latLng);

        const marker = new AdvancedMarkerElement({
          map: map,
          position: latLng,
          title: `Parada ${index + 1} - ${element.name}`,
          content: pin.element,
          gmpClickable: true,
        });

        marker.addListener("click", ({ domEvent, latLng }) => {
          const { target } = domEvent;
          infoWindow.close();
          infoWindow.setContent(contentString);
          infoWindow.setHeaderContent(`Parada ${index + 1}`);
          infoWindow.open(marker.map, marker);
        });

        return marker;
      });

      // Agregar markers y rutas de vuelta
      vueltaMarkersRef.current = vuelta.map((element, index) => {
        const parser = new DOMParser();
        const pinSvgString =
          '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M10 5h7c2.761 0 5 3.134 5 7v5h-2" /><path d="M16 17h-8" /><path d="M16 5l1.5 7h4.5" /><path d="M9.5 10h7.5" /><path d="M12 5v5" /><path d="M5 9v11" /></svg>';
        const pinSvg = parser.parseFromString(
          pinSvgString,
          "image/svg+xml"
        ).documentElement;

        const contentString =
          "<div>" +
          `<h1 class="text-base uppercase font-bold"><b>${element.name}</b></h1>` +
          `<span class="text-xs font-light italic">${vueltaAddress}</span>` +
          `<p class="text-md">${element.road}</p>` +
          "</div>";

        const pin = new PinElement({
          glyph: pinSvg,
          glyphColor: "#ffffff",
          background: "#990000",
          borderColor: "#cc0000",
        });

        const latLng = utm.convertUtmToLatLng(
          element.latitude,
          element.altitude,
          15,
          "N"
        );
        pathCoordinatesVuelta.push(latLng);

        const marker = new AdvancedMarkerElement({
          map: map,
          position: latLng,
          title: `Parada ${index + 1} - ${element.name}`,
          content: pin.element,
          gmpClickable: true,
        });

        marker.addListener("click", ({ domEvent, latLng }) => {
          const { target } = domEvent;
          infoWindow.close();
          infoWindow.setContent(contentString);
          infoWindow.setHeaderContent(`Parada ${index + 1}`);
          infoWindow.open(marker.map, marker);
        });

        return marker;
      });

      idaLineRef.current = new Polyline({
        path: pathCoordinatesIda,
        geodesic: true,
        strokeColor: "#16537e",
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

      vueltaLineRef.current = new Polyline({
        path: pathCoordinatesVuelta,
        geodesic: true,
        strokeColor: "#990000",
        strokeOpacity: 1.0,
        strokeWeight: 5,
      });

      if (showIda) idaLineRef.current.setMap(map);
      if (showVuelta) vueltaLineRef.current.setMap(map);
    };

    initMap();
  }, [ida, vuelta]);

  useEffect(() => {
    if (idaLineRef.current) {
      idaLineRef.current.setMap(showIda ? mapInstance : null);
    }
    idaMarkersRef.current.forEach((marker) =>
      marker.setMap(showIda ? mapInstance : null)
    );
  }, [showIda, mapInstance]);

  useEffect(() => {
    if (vueltaLineRef.current) {
      vueltaLineRef.current.setMap(showVuelta ? mapInstance : null);
    }
    vueltaMarkersRef.current.forEach((marker) =>
      marker.setMap(showVuelta ? mapInstance : null)
    );
  }, [showVuelta, mapInstance]);

  return (
    <section className="shadow">
      <div className="flex flex-col md:flex-row p-2 items-center justify-center md:justify-between w-full h-32 md:h-10 bg-black">
        <span className="text-white font-semibold md:text-balance text-sm md:ms-4 text-center md:text-left mb-2 md:mb-0">
          Ruta {type} {shortName}: {longName}
        </span>
        <div className="flex flex-wrap gap-2 md:me-4 items-center justify-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showIda}
              onChange={() => setShowIda(!showIda)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-white">
              Mostrar ruta de ida
            </span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showVuelta}
              onChange={() => setShowVuelta(!showVuelta)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-white">
              Mostrar ruta de vuelta
            </span>
          </label>
        </div>
      </div>
      <div style={{ height: "500px" }} ref={mapRef} />
    </section>
  );
}
