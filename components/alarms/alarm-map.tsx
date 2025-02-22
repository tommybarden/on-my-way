'use client'
import { useEffect } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { XYZ } from "ol/source";
import { fromLonLat } from "ol/proj";

export default function AlarmMap(props: { geo?: string; className?: string; }) {
    const { geo, className } = props;

    useEffect(() => {

        if (!geo) {
            console.error('NO GEO');
            return;
        }

        const lonlat = geo?.split(' ').reverse().map(e => parseFloat(e))
        const center = fromLonLat(lonlat ?? [12.550343, 55.665957]);//[2220244.6089087133, 8435829.42412169];

        const apiKey = process.env.NEXT_PUBLIC_MML_KEY;

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
                scale: 1.5
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
                zoom: 14,
            }),
        });

        return () => map.setTarget(null!);

    }, [geo]);

    // if (!geo) {
    //     return null;
    // }

    return <div className={className + ' w-full'} id="map-container" />;
};
