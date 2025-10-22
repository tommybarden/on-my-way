'use client'

import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react";

export default function MapLink(props: { geo?: string; className?: string }) {
    const { geo, className } = props

    if (!geo || geo.trim() === '' || geo.trim() === '0') {
        return null
    }

    const formattedGeo = geo.trim().replace(/\s+/, ',')
    const mapUrl = `https://www.google.com/maps?q=${formattedGeo}`

    const openMap = () => {
        window.open(mapUrl, '_blank', 'noopener,noreferrer')
    }

    return (
        <div className={className + ' p-4'}>
            <div className="flex w-full flex-col gap-5">
                <Button onClick={openMap} type="button" variant={"outline"} size={"lg"} className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <p className="text-xl">Visa på karta</p>
                </Button>
            </div>
        </div>

    )
}
