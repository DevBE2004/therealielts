"use client"

type HeroData = {
  title: string;
  subtitle: string;
};

type Props = {
  section1: HeroData;
  images1: string[];
}

export default function HeroSection({section1, images1}: Props) {
  
  const backgroundImage = images1?.[0] || "/images/default-image.webp"

  return (
    <div className="relative h-[500px] bg-cover bg-center"
      style={{backgroundImage: `url(${backgroundImage})`}}
    >
      <div className='absolute inset-0 bg-black/50'></div>
      <div className='relative z-10 flex items-center justify-center h-full'>
        <div className='text-center text-white'>
          <h1 className='text-5xl md:text-6xl font-bold mb-4'>{section1?.title || "PHƯƠNG PHÁP HỌC LCLT"}</h1>
          <p className='text-xl md:text-2xl max-w-3xl mx-auto px-4'>
            {section1?.subtitle || "Khám phá phương pháp học IELTS hiệu quả được phát triển độc quyền bởi The Real IELTS"}
          </p>
        </div>
      </div>
    </div>
  )
}
