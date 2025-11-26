import { useMemo, useState } from 'react'
import Station1 from './Station_1'
import Station2 from './Station_2'
import Station3 from './Station_3'

const tabConfig = [
  { id: 'station1', label: 'Station 1', component: Station1 },
  { id: 'station2', label: 'Station 2', component: Station2 },
  { id: 'station3', label: 'Station 3', component: Station3 }
]

function Navbar() {
  const [activeTab, setActiveTab] = useState(tabConfig[0].id)
  const ActiveComponent = useMemo(() => {
    return tabConfig.find((tab) => tab.id === activeTab)?.component ?? (() => null)
  }, [activeTab])

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <div role="tablist" className="tabs tabs-boxed w-fit">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            className={`tab text-black ${tab.id === activeTab ? 'tab-active !font-bold' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-box border border-base-200 bg-base-100 p-6 bg-white shadow-md shadow-gray-300 border border-gray-300">
        <ActiveComponent />
      </div>
    </div>
  )
}

export default Navbar