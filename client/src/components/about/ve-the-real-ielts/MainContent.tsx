'use client';

import { splitSections } from '@/hooks/splitSections';
import Image from 'next/image';

type section2 = {
  heading: string;
  description: string;
};

type Props = {
  section2: section2;
  images2: string[]; 
}


export default function MainContent({ section2, images2 }: Props ) {
  const bulletPoints = splitSections(section2?.description || "");

  const mainImg = images2[0] || "/images/default-image.webp";

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Fixed Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-50 mb-6">
            Về The Real IELTS
          </h2>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src={mainImg}
                  alt="Về The Real IELTS"
                  className="rounded-2xl shadow-2xl w-full"
                  width="716"
                  height="429"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-8">
              {/* Heading */}
              <div className="hidden lg:block">
                <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                  {section2.heading}
                </h2>
              </div>
              <div className="lg:hidden">
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                  {section2.heading}
                </h2>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-6">
                {bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-4">
                    <span className="flex-shrink-0 w-6 h-6 border-2 border-secondary-50 rounded-md flex items-center justify-center mt-1">
                      <svg
                        className="h-7 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
