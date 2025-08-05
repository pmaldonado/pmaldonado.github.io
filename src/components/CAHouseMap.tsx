import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import * as topojson from 'topojson-client'
import districtsData from '../data/ca-districts.json'

// TopoJSON data will be loaded dynamically

interface District {
  district: number
  name: string
  party: 'D' | 'R'
  tenure: string
  districtWikipedia: string
  representativeWikipedia: string
}

const CAHouseMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    // Update document title
    document.title = 'CA Congressional Districts'
    
    if (!mapRef.current || leafletMapRef.current) return

    // Initialize the map
    const map = L.map(mapRef.current, {
      center: [36.7783, -119.4179], // Center of California
      zoom: window.innerWidth < 640 ? 8 : 6, // More zoomed in on mobile
      minZoom: 5,
      maxZoom: 12
    })

    leafletMapRef.current = map

    // Add base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Create a lookup for district data
    const districtLookup = new Map<number, District>()
    districtsData.forEach((dataItem) => {
      // The 'party' property from the JSON data is inferred as 'string',
      // but the District interface expects it to be 'D' or 'R'.
      // We assert the type here, assuming the data will always contain 'D' or 'R'.
      const district: District = {
        district: dataItem.district,
        name: dataItem.name,
        party: dataItem.party as 'D' | 'R', // Type assertion to match the District interface
        tenure: dataItem.tenure,
        districtWikipedia: dataItem.districtWikipedia,
        representativeWikipedia: dataItem.representativeWikipedia,
      }
      districtLookup.set(district.district, district)
    })

    // Color function based on party
    const getColor = (party: string) => {
      switch (party) {
        case 'D': return '#3b82f6' // Blue for Democrats
        case 'R': return '#ef4444' // Red for Republicans
        default: return '#6b7280' // Gray for others
      }
    }

    // Style function for districts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style = (feature: any) => {
      const districtNum = parseInt(feature.properties.DISTRICT)
      const district = districtLookup.get(districtNum)
      const party = district?.party || 'Unknown'
      
      return {
        fillColor: getColor(party),
        weight: 1,
        opacity: 1,
        color: '#ffffff',
        fillOpacity: 0.7
      }
    }

    // Highlight feature on hover
    const highlightFeature = (e: L.LeafletMouseEvent) => {
      const layer = e.target
      layer.setStyle({
        weight: 3,
        color: '#ffffff',
        fillOpacity: 0.9
      })
      layer.bringToFront()
    }

    // Reset highlight
    let geoJsonLayer: L.GeoJSON

    const resetHighlight = (e: L.LeafletMouseEvent) => {
      geoJsonLayer.resetStyle(e.target)
    }

    // Click handler for districts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onEachFeature = (feature: any, layer: L.Layer) => {
      const districtNum = parseInt(feature.properties.DISTRICT)
      const district = districtLookup.get(districtNum)
      
      if (district) {
        const popupContent = `
          <div class="min-w-[280px]">
            <h3 class="text-lg font-bold">
              <a href="${district.districtWikipedia}" target="_blank" rel="noopener noreferrer" 
                 class="text-blue-600 hover:text-blue-800 hover:underline">
                California's ${district.district}${getOrdinalSuffix(district.district)} Congressional District
              </a>
            </h3>
            <div">
              <p>
                <strong>Representative:</strong> 
                <a href="${district.representativeWikipedia}" target="_blank" rel="noopener noreferrer"
                   class="text-blue-600 hover:text-blue-800 hover:underline">
                  ${district.name}
                </a>
              </p>
              <p>
                <strong>Party:</strong> 
                <span class="inline-block px-2 py-1 rounded text-white text-sm ml-1" 
                      style="background-color: ${getColor(district.party)}">
                  ${district.party === 'D' ? 'Democrat' : district.party === 'R' ? 'Republican' : district.party}
                </span>
              </p>
              <p><strong>In office:</strong> ${district.tenure}</p>
            </div>
          </div>
        `
        
        layer.bindPopup(popupContent)
      }

      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
      })
    }

    // Load TopoJSON data dynamically and render map
    const loadMapData = async () => {
      try {
        const response = await fetch('/ca-districts-topo.json')
        const caDistrictsTopoJSON = await response.json()

        // Convert TopoJSON to GeoJSON
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const geojsonData = topojson.feature(caDistrictsTopoJSON as any, caDistrictsTopoJSON.objects["CD_Final 2021-12-20"] as any)
        
        // Add GeoJSON layer
        geoJsonLayer = L.geoJSON(geojsonData, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(map)

        // Fit bounds to California
        map.fitBounds(geoJsonLayer.getBounds())
        
        // Set higher zoom on mobile after fitBounds
        if (window.innerWidth < 640) {
          map.setZoom(8)
        }
      } catch (error) {
        console.error('Failed to load map data:', error)
      }
    }

    loadMapData()

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [])

  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (num: number) => {
    const j = num % 10
    const k = num % 100
    if (j === 1 && k !== 11) return 'st'
    if (j === 2 && k !== 12) return 'nd'
    if (j === 3 && k !== 13) return 'rd'
    return 'th'
  }

  return (
    <div className="h-screen overflow-hidden sm:min-h-screen sm:overflow-auto text-gray-900 font-sans" 
         style={{
          backgroundColor: "#e3b97f", //'#e3b97f',
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
          // backgroundImage: `url(${cardboardTexture})`,
          backgroundRepeat: "repeat"
         }}>
      <main className="h-full py-4 sm:py-8 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full sm:h-auto flex flex-col">
          {/* Header */}
          <div className="max-w-3xl mb-4 sm:mb-8 p-2 sm:p-4 transform rotate-[0.3deg] flex-shrink-0"
               style={{
                 background: 'url("https://www.transparenttextures.com/patterns/lined-paper.png") repeat, #ffffff',
                 backgroundSize: 'auto',
                 boxShadow: '4px 4px 0px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)'
               }}>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 text-gray-800">
              California Congressional Districts
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 mb-1 sm:mb-2 max-w-3xl">
              Interactive map showing California's 52 congressional districts and their representatives. 
              {/* Click on any district to see details about the representative, party affiliation, and tenure. */}
            </p>
          </div>

          {/* Map Container */}
          <div className="flex-1 sm:flex-none mb-4 sm:mb-8 p-2 sm:p-2 flex flex-col"
               style={{
                 background: 'url("https://www.transparenttextures.com/patterns/lined-paper.png") repeat, #ffffff',
                 backgroundSize: 'auto',
                 boxShadow: '6px 6px 0px rgba(0,0,0,0.3)'
               }}>
            <div 
              ref={mapRef} 
              className="w-full flex-1 sm:flex-none sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 sm:mb-8 justify-end flex-shrink-0">
            <div className="flex items-center gap-3 p-2 transform rotate-[-0.6deg]"
                 style={{
                   background: 'url("https://www.transparenttextures.com/patterns/lined-paper.png") repeat, #ffffff',
                   backgroundSize: 'auto',
                   boxShadow: '3px 3px 0px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)'
                 }}>
              <div className="w-5 h-5 bg-blue-400 shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Democrat</span>
            </div>
            <div className="flex items-center gap-3 p-2 transform rotate-[0.4deg]"
                 style={{
                   background: 'url("https://www.transparenttextures.com/patterns/lined-paper.png") repeat, #ffffff',
                   backgroundSize: 'auto',
                   boxShadow: '3px 3px 0px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)'
                 }}>
              <div className="w-5 h-5 bg-red-400 shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Republican</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default CAHouseMap