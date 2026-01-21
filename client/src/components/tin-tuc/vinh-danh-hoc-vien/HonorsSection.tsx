'use client';

import { Honor } from '@/types';
import Image from 'next/image';
import { Award } from 'lucide-react';
import { splitSections } from '@/hooks/splitSections';

interface HonorsSectionProps {
  honors?: Honor[];
  loading?: boolean;
}

export default function HonorsSection({ honors, loading }: HonorsSectionProps) {
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-100 to-white">
        <div className="mx-auto px-4 text-center">
          <p className="text-xl text-gray-700">Đang tải...</p>
        </div>
      </section>
    );
  }

  if (!honors?.length) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-100 to-white">
        <div className="mx-auto px-4 text-center">
          <p className="text-xl text-gray-600">Chưa có dữ liệu thành tích</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 bg-gradient-to-br from-gray-100 to-white"
      aria-labelledby="honors-title"
    >
      <div className="container mx-auto px-6 xl:px-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h2
            id="honors-title"
            className="text-3xl lg:text-4xl font-bold text-sky-800 mb-3"
          >
            THÀNH TÍCH & VINH DANH
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Những thành tích và vinh danh của The Real IELTS - minh chứng cho chất lượng đào tạo
          </p>
        </header>

        {/* List Honors */}
        <div className="grid gap-8 sm:gap-6 md:gap-10 lg:gap-12 sm:grid-cols-2">
          {honors.map((honor) => {
            const {
              id,
              name = 'Chưa rõ tên',
              achievement = '',
              photo,
              category = 'Thành tích',
              awardDate,
            } = honor;

            const year = awardDate ? new Date(awardDate).getFullYear() : '';
            const achievementList = splitSections(achievement);

            return (
              <article
                key={id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col lg:flex-row"
              >
                {/* Left - photo */}
                <div className="w-full lg:w-2/5 relative aspect-[4/3] lg:aspect-auto lg:h-auto">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={name}
                      fill
                      className="object-cover lg:object-contain object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold">
                      {name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Right - info */}
                <div className="w-full lg:w-3/5 p-5 md:p-6 flex flex-col justify-start">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {name}
                  </h3>

                  <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-4">
                    {category}
                  </span>

                  <ul className="space-y-2 text-gray-700 text-sm">
                    {achievementList.length > 0 ? (
                      achievementList.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Award className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">
                        Chưa có thành tích
                      </li>
                    )}
                  </ul>

                  {year && (
                    <p className="text-gray-500 text-xs mt-4">Năm: {year}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
