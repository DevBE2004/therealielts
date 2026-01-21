"use client";

import CTASection from "@/components/about/phuong-phap-LCLT/CTASection";
import HeroSection from "@/components/about/phuong-phap-LCLT/HeroSection";
import MainContent from "@/components/about/phuong-phap-LCLT/MainContent";
import TabNavigation from "@/components/about/phuong-phap-LCLT/TabsNavigation";
import ConsultationForm from "@/components/common/ConsultationForm";
import GoogleFormEmbed from "@/components/common/GoogleFormEmbed";
import { useEffect, useState } from "react";

interface ContentItem {
  description: string;
  imageIndex: number;
}

interface Item {
  title: string;
  subtitle: string;
  description: string;
  content: ContentItem[];
}

type section2 = {
  items: Item[];
};

type section1 = {
  title: string;
  subtitle: string;
}

type embedHtml = {
  embedHtml: string;
}

type Props = {
  section1: section1;
  images1: string[];
  section2: section2;
  images2: string[];
  section2Rc3:embedHtml; 
};

export default function PreviewLearningMethod({section1, images1, section2, images2, section2Rc3 }: Props) {

    const tabs = section2?.items?.map((item) => ({
    key: item.title,
    label: item.title,
  })) || [];

  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs, activeTab]);

  const data = section2.items.reduce((acc, item) => {
    acc[item.title] = {
      title: item.subtitle,
      description: item.description,
      sections: item.content.map((c) => ({
        image: images2[c.imageIndex] || "", // lấy ảnh từ images2 theo index
        description: c.description,
        reverse: false,
      })),
    };
    return acc;
  }, {} as Record<string, { title: string; description: string; sections: { image: string; description: string; reverse?: boolean }[] }>);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection section1={section1} images1={images1}/>
      {tabs.length > 0 && (
        <>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          {activeTab && <MainContent activeTab={activeTab} data={data} />}
        </>
      )}
      <GoogleFormEmbed section2={section2Rc3}/>
      <CTASection />
      <ConsultationForm />
    </div>

    // <div className='min-h-screen bg-white'>
    //   {/* Hero Section */}
    //   <div className="relative h-[500px] bg-[url('https://therealielts.vn/wp-content/uploads/2023/07/Ve-phuong-phap-hoc-min.jpg')] bg-cover bg-center">
    //     <div className='absolute inset-0 bg-black/50'></div>
    //     <div className='relative z-10 flex items-center justify-center h-full'>
    //       <div className='text-center text-white'>
    //         <h1 className='text-5xl md:text-6xl font-bold mb-4'>PHƯƠNG PHÁP HỌC LCLT</h1>
    //         <p className='text-xl md:text-2xl max-w-3xl mx-auto px-4'>
    //           Khám phá phương pháp học IELTS hiệu quả được phát triển độc quyền bởi The Real IELTS
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Navigation Tabs */}
    //   <div className='bg-white border-b border-gray-200 sticky top-0 z-20'>
    //     <div className='max-w-7xl mx-auto px-4'>
    //       <div className='flex space-x-8'>
    //         <button
    //           onClick={() => setActiveTab('learner')}
    //           className={`py-6 px-4 border-b-4 font-bold text-lg transition-all duration-300 ${
    //             activeTab === 'learner'
    //               ? 'border-blue-600 text-blue-600'
    //               : 'border-transparent text-gray-500 hover:text-gray-700'
    //           }`}
    //         >
    //           LEARNER CENTERED
    //         </button>
    //         <button
    //           onClick={() => setActiveTab('linguistic')}
    //           className={`py-6 px-4 border-b-4 font-bold text-lg transition-all duration-300 ${
    //             activeTab === 'linguistic'
    //               ? 'border-blue-600 text-blue-600'
    //               : 'border-transparent text-gray-500 hover:text-gray-700'
    //           }`}
    //         >
    //           LINGUISTIC THINKING
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Content */}
    //   <div className='max-w-7xl mx-auto px-4 py-16'>
    //     {/* Section 1: LEARNER CENTERED */}
    //     {activeTab === 'learner' && (
    //       <div className='animate-fadeIn'>
    //         <div className='text-center mb-16'>
    //           <h2 className='text-4xl font-bold text-gray-800 mb-6'>LẤY NGƯỜI HỌC LÀM TRỌNG TÂM</h2>
    //           <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
    //             Phương pháp học tập tập trung vào từng cá nhân học viên, tôn trọng sự khác biệt và
    //             xây dựng lộ trình học tập phù hợp với từng người.
    //           </p>
    //         </div>

    //         {/* First Image and Content */}
    //         <div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
    //           <div className='order-2 lg:order-1'>
    //             <img
    //               src='https://therealielts.vn/wp-content/uploads/2023/07/student-online-young-cute-girl-glasses-orange-sweater-studying-computer-excited-min.jpg'
    //               alt='Học viên học online'
    //               className='w-full h-[400px] object-cover rounded-2xl shadow-lg'
    //             />
    //           </div>
    //           <div className='order-1 lg:order-2'>
    //             <div className='space-y-6'>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     <strong>The Real IELTS</strong> hiểu rằng mỗi học viên đều là duy nhất với
    //                     kiến thức, kinh nghiệm sống, điểm mạnh và điểm yếu khác nhau, ảnh hưởng đến
    //                     cách học tập của họ.
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     <strong>The Real IELTS</strong> tôn trọng những khác biệt này và giáo viên
    //                     sẽ điều chỉnh nội dung và phương pháp giảng dạy dựa trên đặc điểm cá nhân
    //                     của từng học viên.
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Second Image and Content */}
    //         <div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
    //           <div>
    //             <img
    //               src='https://therealielts.vn/wp-content/uploads/2023/07/virtual-classroom-study-space-min.jpg'
    //               alt='Không gian học tập ảo'
    //               className='w-full h-[400px] object-cover rounded-2xl shadow-lg'
    //             />
    //           </div>
    //           <div>
    //             <div className='space-y-6'>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     Phương pháp <strong>&ldquo;Learner Centered&rdquo;</strong> khuyến khích
    //                     tính chủ động, tự tin và mong muốn vượt qua thách thức. Học viên sẽ cảm thấy
    //                     được công nhận và quan tâm, giáo viên sẽ khuyến khích họ phát triển điểm
    //                     mạnh và hướng dẫn vượt qua điểm yếu.
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     Học tập chủ động và tích cực trong môi trường lớp học nhiệt huyết là chìa
    //                     khóa để học viên phát triển tối đa khả năng tiếp thu và ứng dụng ngôn ngữ.
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Third Image and Content */}
    //         <div className='grid lg:grid-cols-2 gap-12 items-center'>
    //           <div className='order-2 lg:order-1'>
    //             <img
    //               src='https://therealielts.vn/wp-content/uploads/2023/07/muslim-businesswoman-using-laptop-talk-colleague-about-plan-by-video-call-brainstorm-online-meeting-while-remotely-work-from-home-living-room-min.jpg'
    //               alt='Học tập trực tuyến'
    //               className='w-full h-[400px] object-cover rounded-2xl shadow-lg'
    //             />
    //           </div>
    //           <div className='order-1 lg:order-2'>
    //             <div className='space-y-6'>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     Giảng viên <strong>The Real IELTS</strong> đóng vai trò là người hướng dẫn,
    //                     định hướng và cung cấp thông tin trong mỗi bài học, bao gồm:
    //                   </p>
    //                 </div>
    //               </div>
    //               <ul className='space-y-3 ml-10'>
    //                 <li className='flex items-start space-x-3'>
    //                   <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></span>
    //                   <span className='text-gray-700'>
    //                     Khuyến khích hợp tác thông qua các hoạt động nhóm
    //                   </span>
    //                 </li>
    //                 <li className='flex items-start space-x-3'>
    //                   <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></span>
    //                   <span className='text-gray-700'>
    //                     Giao tiếp thường xuyên với từng học viên
    //                   </span>
    //                 </li>
    //                 <li className='flex items-start space-x-3'>
    //                   <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></span>
    //                   <span className='text-gray-700'>
    //                     Cung cấp chủ đề và hướng dẫn cách tìm thông tin, phát triển ý tưởng
    //                   </span>
    //                 </li>
    //                 <li className='flex items-start space-x-3'>
    //                   <span className='w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0'></span>
    //                   <span className='text-gray-700'>Tổ chức các cuộc thi trong lớp</span>
    //                 </li>
    //               </ul>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {/* Section 2: LINGUISTIC THINKING */}
    //     {activeTab === 'linguistic' && (
    //       <div className='animate-fadeIn'>
    //         <div className='text-center mb-16'>
    //           <h2 className='text-4xl font-bold text-gray-800 mb-6'>XÂY DỰNG TƯ DUY NGÔN NGỮ</h2>
    //           <p className='text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed'>
    //             Phát triển khả năng tư duy trực tiếp bằng tiếng Anh, giúp học viên tiết kiệm thời
    //             gian và đạt hiệu quả học tập cao hơn gấp nhiều lần.
    //           </p>
    //         </div>

    //         {/* First Image and Content */}
    //         <div className='grid lg:grid-cols-2 gap-12 items-center mb-16'>
    //           <div className='order-2 lg:order-1'>
    //             <img
    //               src='https://therealielts.vn/wp-content/uploads/2023/07/left-right-brain-sides-min.jpg'
    //               alt='Tư duy não trái và phải'
    //               className='w-full h-[400px] object-cover rounded-2xl shadow-lg'
    //             />
    //           </div>
    //           <div className='order-1 lg:order-2'>
    //             <div className='space-y-6'>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     Tiếng Việt (họ ngôn ngữ Nam Á) và tiếng Anh (họ ngôn ngữ Tây German) có quy
    //                     trình tư duy cơ bản khác nhau, đặc biệt trong việc hình thành cụm danh từ và
    //                     câu hỏi.
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     <strong>&ldquo;Xây dựng tư duy ngôn ngữ&rdquo;</strong> là tư duy trực tiếp
    //                     bằng ngôn ngữ đang học. Người Việt thường dịch từ tiếng Việt sang tiếng Anh,
    //                     điều này không hiệu quả. Học cách tư duy bằng ngôn ngữ mục tiêu có thể tiết
    //                     kiệm ít nhất 4 lần thời gian so với phương pháp học truyền thống.
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Second Image and Content */}
    //         <div className='grid lg:grid-cols-2 gap-12 items-center'>
    //           <div>
    //             <img
    //               src='https://therealielts.vn/wp-content/uploads/2023/07/creative-analytical-thinking-concept-min.jpg'
    //               alt='Tư duy sáng tạo và phân tích'
    //               className='w-full h-[400px] object-cover rounded-2xl shadow-lg'
    //             />
    //           </div>
    //           <div>
    //             <div className='space-y-6'>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     Phương pháp <strong>The Real IELTS</strong> tập trung vào việc nắm vững sâu
    //                     thay vì học rộng, nông, nhằm xây dựng phản xạ tự nhiên. Chúng tôi tập trung
    //                     vào kiến thức và kỹ năng cốt lõi để học viên có thể thích ứng với các dạng
    //                     câu hỏi IELTS khác nhau bằng tư duy đã phát triển.
    //                   </p>
    //                 </div>
    //               </div>
    //               <div className='flex items-start space-x-4'>
    //                 <img
    //                   className='mt-1'
    //                   src='data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAACWUlEQVQ4jZWUTWsTURSGn0ymTSaJbZOmXShIKoSkNMWFWsFipVDc+I07xYLQP6ARXJTWTcCFbXTrD1DBj50FbWxTKxgUQhF0IYX6RYQmbQQT+5V2Rm6YScdJ2uA7i7l37nmfe7lzzrHdL2SpoRBwCegDugAFWAU+AbPAQ+Cz1VYLNgZcF2u1dtGlAXHghvmjZBr7gHdAtA4IfT2qx/usMPGeBHrqQKzq0X2SGTYOHNrNpWka4mnxtOHztFW+6b5x9DsLAF/qgSS7hNfl50MqxfrKCp19hymVSqBqRliHONlQXZBsZ6/Lz9vnk8SOneXOwCkW0h9pcfnNoUMC1m9x06g4aXA6UHXQPqWV6YkEd88NAks4vAdo8vrYVDfMzn4ZCBozVdvC6XYLHna5gaY9DppxMDXxkviZK6DlUHxhRmYeEQh1slxYRLJVEiIoRh5j5lGaWfr2k1tHLnJ7YBBJ00i9niV+Wge1hhiZeUyk+yD5YtYMKtvFyYp6hqPICktfM/yYS5RXb/aukVvIADkUf4jR5DMikS4yf3LYNJs1G4sCPW/Mfq3m6T7Ry/nYWJn/PTXF6uIc7vYwo9NPt0HiD1an9byAJY3Z1maJkrrB1eEoF2IxYA1Pe5jhV0+IdEdMoJoFkqzKM01VcbhcNMoK6RcJ/IH9BMNdLBez2ERK1QYJdRiFLor22nZ2qNhlGa/Syjolfhfy1su26p7wGzAR+b5eSe2gtF6jqrGdCpzUgf8jES98wv9PC8oDR/WirRTcDhLrIk7EC19Zu3Xay8DxGp32DfCgqtMCfwHQoNEIp4/fOQAAAABJRU5ErkJggg=='
    //                 />
    //                 <div>
    //                   <p className='text-gray-700 leading-relaxed'>
    //                     <strong>The Real IELTS</strong> hướng dẫn học viên hiểu bản chất của tiếng
    //                     Anh, nuôi dưỡng tư duy rõ ràng và linh hoạt. Cách tiếp cận này giúp học viên
    //                     ứng dụng kiến thức một cách trôi chảy và đồng đều ở cả 4 kỹ năng (nghe, nói,
    //                     đọc, viết), thay vì chỉ giỏi ở các kỹ năng thụ động như nghe và đọc.
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     )}

    //     {/* CTA Section */}
    //     <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white mt-20'>
    //       <h2 className='text-3xl font-bold mb-6'>Sẵn Sàng Bắt Đầu Hành Trình IELTS?</h2>
    //       <p className='text-xl mb-8 opacity-90'>
    //         Hãy để chúng tôi giúp bạn đạt được mục tiêu IELTS với phương pháp LCLT hiệu quả
    //       </p>
    //       <div className='flex flex-col sm:flex-row gap-4 justify-center'>
    //         <button className='bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300'>
    //           Đăng Ký Tư Vấn Miễn Phí
    //         </button>
    //         <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300'>
    //           Xem Lộ Trình Học
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   <style jsx>{`
    //     @keyframes fadeIn {
    //       from {
    //         opacity: 0;
    //         transform: translateY(20px);
    //       }
    //       to {
    //         opacity: 1;
    //         transform: translateY(0);
    //       }
    //     }
    //     .animate-fadeIn {
    //       animation: fadeIn 0.5s ease-out;
    //     }
    //   `}</style>
    //   <ConsultationForm />
    // </div>
  );
}
