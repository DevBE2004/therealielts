"use client"

interface TabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  tabs: { key: string, label: string }[]
}

export default function TabNavigation({ activeTab, setActiveTab, tabs }: TabNavigationProps) {
  return (
    <div className='bg-white border-b border-gray-200 sticky top-0 z-20'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex space-x-8'>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-6 px-4 border-b-4 font-bold text-lg transition-all duration-300 ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
