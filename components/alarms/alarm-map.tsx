'use client'
import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

export default function AlarmMap() {
    const map1Container = useRef();
    // on component mount create the map and set the map refrences to the state
    useEffect(() => {
        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const map = new Map({
            target: "map-container",
            layers: [osmLayer],
            view: new View({
                center: [2220244.6089087133, 8435829.42412169],
                zoom: 15,
            }),
        });

        return () => map.setTarget(null!);

    }, []);

    return (
        <>
            <div className="min-w-6xl h-96" id="map-container" />
        </>
    );
};