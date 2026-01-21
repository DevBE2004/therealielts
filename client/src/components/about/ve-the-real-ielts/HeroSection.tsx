'use client';

type HeroData = {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  tag: string;
};

type Props = {
  section1: HeroData;
  images1: string[];
}

export default function HeroSection({section1, images1}: Props) {

  const backgroundImg = images1[0];
  const mainImg = images1[1];

  return (
    <section
      className="relative py-20 px-12 bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImg})` }}
    >
      {/* Overlay màu xanh mờ */}
      <div className="absolute inset-0 bg-blue-900/60"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Nội dung bên trái */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#6B3D97] to-[#D1228A] text-white rounded-full text-sm font-sans font-[600]">
              {section1.tag}
            </div>

            <h1 className="text-5xl lg:text-6xl font-sans font-[800] leading-tight text-white">
              {section1.title}
            </h1>

            <p className="text-lg text-white font-sans font-[500] leading-relaxed max-w-lg">
              <b>{section1.subtitle}</b>
              <br />
              {section1.description}
            </p>

            <a
              href="#dang-ky-tu-van"
              className="rounded-bl-none bg-gradient-to-r from-[#6B3D97] to-[#D1228A] text-white px-4 py-2 rounded-full font-sans font-[600] text-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              {section1.buttonText}
            </a>
          </div>

          {/* Ảnh bên phải */}
          <div className="relative top-[80px]">
            <div className="relative z-10">
              <img
                src={mainImg}
                alt={section1.title}
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
