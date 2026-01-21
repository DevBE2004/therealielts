"use client"

export default function CTASection() {
  return (
    <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white mt-20'>
      <h2 className='text-3xl font-bold mb-6'>Sẵn Sàng Bắt Đầu Hành Trình IELTS?</h2>
      <p className='text-xl mb-8 opacity-90'>
        Hãy để chúng tôi giúp bạn đạt được mục tiêu IELTS với phương pháp LCLT hiệu quả
      </p>
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <button className='bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300'>
          Đăng Ký Tư Vấn Miễn Phí
        </button>
        <button className='border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors duration-300'>
          Xem Lộ Trình Học
        </button>
      </div>
    </div>
  )
}
