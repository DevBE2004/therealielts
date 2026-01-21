'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Partner } from '@/types/partner';

interface PartnerSectionProps {
  partners: Partner[];
}

export default function PartnerSection({ partners }: PartnerSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    partners.length > 0 ? partners[0].category : ''
  );
  
  const categories = useMemo(() => {
    return Array.from(new Set(partners.map(partner => partner.category)));
  }, [partners]);
  
  // Sử dụng useMemo để lọc partners theo category
  const filteredPartners = useMemo(() => {
    if (!activeCategory) return partners;
    return partners.filter(partner => partner.category === activeCategory);
  }, [partners, activeCategory]);
  
  // Ánh xạ tên category hiển thị
  const categoryDisplayNames: Record<string, string> = {
    'doi-tac-chien-luoc': 'Đối tác chiến lược',
    'doi-tac-cong-nghe': 'Đối tác công nghệ',
    'doi-tac-giao-duc': 'Đối tác giáo dục',
    'doi-tac-truyen-thong': 'Đối tác truyền thông',
    'doi-tac-tai-chinh': 'Đối tác tài chính',
  };

  // Nếu không có partners, không render gì
  if (partners.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ĐỐI TÁC CỦA THE REAL IELTS
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            The Real IELTS tự hào đã và đang là đối tác của các công ty và các tập đoàn lớn trên toàn cầu 
            cũng như ở Việt Nam với sứ mệnh trở thành hệ thống GD&DT chuyên luyện thi IELTS tốt nhất 
            cho hơn 90 triệu người Việt.
          </p>
        </div>

        {/* Phân cách */}
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-12"></div>

        {/* Menu categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryDisplayNames[category] || category}
            </button>
          ))}
        </div>

        {/* Phân cách */}
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-12"></div>

        {/* Danh sách đối tác */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredPartners.map(partner => (
            <div 
              key={partner.id} 
              className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-full h-32 relative mb-4 flex items-center justify-center">
                <Image
                  src={partner.images?.[0]}
                  alt={partner.name}
                  height={180}
                  width={180}
                  className="object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Thông báo khi không có đối tác */}
        {filteredPartners.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có đối tác nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </section>
  );
}