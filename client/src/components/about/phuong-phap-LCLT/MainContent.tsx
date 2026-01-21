"use client"

import ContentSection from './ContentSection'

interface MainContentProps {
  activeTab: string
  data: {
    [key: string]: {
      title: string
      description: string;
      sections: { image: string; description: string; reverse?: boolean }[]
    }
  }
}

export default function MainContent({ activeTab, data }: MainContentProps) {
  const tabData = data[activeTab]
  if (!tabData) return null

  return (
    <div className='animate-fadeIn max-w-7xl mx-auto px-4 py-16'>
      <div className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-800 mb-6'>{tabData.title}</h2>
        <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
          {tabData.description}
        </p>
      </div>
      {tabData.sections.map((section, index) => (
        <ContentSection
          key={index}
          image={section.image}
          description={section.description}
          reverse={section.reverse}
        />
      ))}
    </div>
  )
}
