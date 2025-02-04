import { createLazyFileRoute, Link } from '@tanstack/react-router'
import {
    PiAirplaneTiltBold,
    PiClipboardBold,
    PiGaugeBold,
    PiMapPinLineBold,
    PiNavigationArrowBold,
    PiNotePencilBold,
    PiSunDimBold,
    PiVideoCameraBold,
} from 'react-icons/pi'

export const Route = createLazyFileRoute('/app/uav/')({
  component: UAV,
})

function UAV() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Flugaufträge */}
        <Link
          to="/app/uav/flugaufträge"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiAirplaneTiltBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Flugaufträge
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Aktuelle Aufträge:
            </p>
            <ul className="pl-5 my-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>Lageerkundung Sektor A</li>
              <li>Wärmebildsuche Waldgebiet</li>
            </ul>
          </div>
        </Link>

        {/* Flugzonen & Position */}
        <Link
          to="/app/uav/flugzonen"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiMapPinLineBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Flugzonen & Position
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Aktuelle Position: 48.137154, 11.576124
              <br />
              Aktive Flugzone: Zone B (Freigegeben)
            </p>
          </div>
        </Link>

        {/* Flugrouten */}
        <Link
          to="/app/uav/routen"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiNavigationArrowBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Flugrouten
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Geplante Route: Automatische Geländeerkundung
              <br />
              Länge: 2.4 km | Dauer: ~15 min
            </p>
          </div>
        </Link>

        {/* Wetter */}
        <Link
          to="/app/uav/wetter"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiSunDimBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Wetter
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Temperatur: 18°C
              <br />
              Wind: 8 km/h aus NO
              <br />
              Sicht: Gut
            </p>
          </div>
        </Link>

        {/* Live-Stream */}
        <Link
          to="/app/uav/stream"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiVideoCameraBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Live-Stream
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Stream-Status: Bereit
              <br />
              Auflösung: 1080p
              <br />
              Latenz: 200ms
            </p>
          </div>
        </Link>

        {/* Telemetrie */}
        <Link
          to="/app/uav/telemetrie"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiGaugeBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Telemetrie
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Akku: 85%
              <br />
              Signal: Ausgezeichnet
              <br />
              GPS: 12 Satelliten
            </p>
          </div>
        </Link>

        {/* Flugprotokoll */}
        <Link
          to="/app/uav/protokoll"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiClipboardBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Flugprotokoll
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Letzte Flüge:
              <br />
              • Heute, 10:30 - Erkundung
              <br />• Gestern, 15:45 - Training
            </p>
          </div>
        </Link>

        {/* Flugbericht */}
        <Link
          to="/app/uav/bericht"
          className="block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full cursor-pointer 
                   hover:shadow-lg hover:scale-[1.02] hover:bg-gray-50 dark:hover:bg-gray-700 
                   transition-all duration-200"
        >
          <div className="p-4">
            <div className="flex items-center mb-3">
              <span className="text-gray-600 dark:text-gray-400">
                <PiNotePencilBold size={24} />
              </span>
              <h2 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">
                Flugbericht
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Letzter Bericht: #2024-001
              <br />
              Status: In Bearbeitung
              <br />
              Fotos: 24
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
