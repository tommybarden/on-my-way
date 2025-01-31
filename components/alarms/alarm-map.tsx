'use client'
import {useEffect, useRef} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Icon, Style} from 'ol/style';
import {XYZ} from "ol/source";

export default function AlarmMap() {
    const map1Container = useRef();

    useEffect(() => {
        const center = [2220244.6089087133, 8435829.42412169];
        // ol.proj.fromLonLat([12.550343, 55.665957])

        const apiKey = "24d8f276-3b42-4630-b218-4d0619e8fb1f";

        // const osmLayer = new TileLayer({
        //     source: new OSM(),
        // });
        //
        // const taustakartta = new TileLayer({
        //     source: new XYZ({
        //         attributions: '&copy; <a target="_blank" href="https://www.maanmittauslaitos.fi/sv/kartor-och-geodata/expertanvandare/terrangdata-och-anskaffning-av-dem">LMV</a>',
        //         url: 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/taustakartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=' + apiKey,
        //     }),
        //     opacity: 0.9,
        //     preload: 0,
        // })

        const maastokartta = new TileLayer({
            source: new XYZ({
                attributions: '&copy; <a target="_blank" href="https://www.maanmittauslaitos.fi/sv/kartor-och-geodata/expertanvandare/terrangdata-och-anskaffning-av-dem">LMV</a>',
                url: 'https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/maastokartta/default/WGS84_Pseudo-Mercator/{z}/{y}/{x}.png?api-key=' + apiKey,
            }),
            opacity: 0.8,
        })

        const marker = new Feature({
            geometry: new Point(center),
        });

        marker.setStyle(new Style({
            image: new Icon({
                anchor: [0.5, 1],
                src: '/marker.png',
            }),
        }));

        const vectorLayer = new VectorLayer({
            source: new VectorSource({
                features: [marker],
            }),
        });

        const map = new Map({
            target: "map-container",
            layers: [maastokartta, vectorLayer],
            view: new View({
                center,
                zoom: 15,
            }),
        });

        return () => map.setTarget(null!);

    }, []);

    return <div className="min-w-6xl h-[50rem] bg-white" id="map-container"/>;
};
