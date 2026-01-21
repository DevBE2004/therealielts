'use client'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Bookmark,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Eye,
  GraduationCap,
  Headphones,
  Heart,
  Mic,
  PenTool,
  Play,
  Shield,
  Star,
  Target,
  Users,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function LadiView({ comments, courses }: any) {
  const [activeTab, setActiveTab] = useState('ielts')
  const [isSticky, setIsSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsSticky(window.scrollY > headerRef.current.offsetHeight)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      })
    }
  }

  // Lọc các khóa học theo tab đang active
  const filteredCourses =
    courses?.data?.filter((course: any) => {
      const title = course.title.toLowerCase()
      if (activeTab === 'ielts') return title.includes('ielts')
      if (activeTab === 'toeic') return title.includes('toeic')
      return title.includes('giao tiếp') || title.includes('communication')
    }) || []

  return (
    <div className='min-h-screen bg-white text-gray-800 font-sans'>
      {/* Hero Banner */}
      <section className='relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 md:py-24'>
        <div className='container mx-auto px-4 flex flex-col md:flex-row items-center'>
          <div className='md:w-1/2 mb-10 md:mb-0'>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>
              Lộ trình học IELTS <span className='text-yellow-300'>cá nhân hóa</span>
            </h1>
            <p className='text-xl mb-8'>
              Khám phá lộ trình học tập được thiết kế riêng cho trình độ và mục tiêu của bạn
            </p>
            <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4'>
              <button className='bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg flex items-center justify-center'>
                Kiểm tra đầu vào miễn phí <ChevronDown className='ml-2' />
              </button>
              <button className='bg-transparent border-2 border-white hover:bg-blue-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center'>
                <Play className='mr-2' /> Xem video giới thiệu
              </button>
            </div>
          </div>
          <div className='md:w-1/2 flex justify-center'>
            <div className='relative'>
              <div className='absolute -top-6 -left-6 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
              <div className='absolute -bottom-6 -right-6 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000'></div>
              <div className='relative bg-white rounded-2xl shadow-2xl p-6 text-gray-800 w-full max-w-md'>
                <h3 className='text-2xl font-bold mb-4 text-center'>Đăng ký kiểm tra đầu vào</h3>
                <form className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Họ và tên</label>
                    <input
                      type='text'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Số điện thoại</label>
                    <input
                      type='tel'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium mb-1'>Email</label>
                    <input
                      type='email'
                      className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                  <button
                    type='submit'
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg'
                  >
                    Đăng ký ngay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>The Real IELTS - Đối tác tin cậy của bạn</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Với phương pháp giảng dạy hiện đại và đội ngũ giáo viên giàu kinh nghiệm, chúng tôi đã
              giúp hàng ngàn học viên đạt được mục tiêu IELTS
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {[
              { icon: <GraduationCap className='w-12 h-12' />, value: '1000+', label: 'Học viên' },
              { icon: <Award className='w-12 h-12' />, value: '95%', label: 'Hài lòng' },
              { icon: <Target className='w-12 h-12' />, value: '7.0+', label: 'Điểm trung bình' },
              { icon: <Bookmark className='w-12 h-12' />, value: '5+', label: 'Năm kinh nghiệm' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white p-6 rounded-xl shadow-md text-center'
              >
                <div className='text-blue-600 flex justify-center mb-4'>{stat.icon}</div>
                <div className='text-3xl font-bold text-blue-800 mb-2'>{stat.value}</div>
                <div className='text-gray-600'>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className='py-16' id='courses'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Chương trình học đa dạng</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Lựa chọn khóa học phù hợp với nhu cầu và mục tiêu của bạn
            </p>
          </div>

          <div className='flex justify-center mb-10'>
            <div className='inline-flex bg-gray-100 p-1 rounded-lg'>
              {['ielts', 'toeic', 'tiếng anh giao tiếp'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-md font-medium capitalize ${
                    activeTab === tab ? 'bg-white shadow-md' : 'text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            >
              {filteredCourses.map((course: any) => (
                <div
                  key={course.id}
                  className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'
                >
                  <div className='h-48 bg-gradient-to-r from-blue-500 to-blue-700 relative overflow-hidden'>
                    <div className='absolute top-4 left-4 bg-yellow-400 text-blue-900 font-bold px-3 py-1 rounded-md'>
                      {course.title.toUpperCase()}
                    </div>
                  </div>
                  <div className='p-6'>
                    <h3 className='text-xl font-bold mb-2'>{course.title}</h3>
                    <p className='text-gray-600 mb-4 line-clamp-3'>{course.description}</p>

                    <div className='flex items-center text-sm text-gray-500 mb-4'>
                      <Clock className='w-4 h-4 mr-1' />
                      <span className='mr-4'>{Math.round(course.totalHours)} giờ học</span>
                      <Calendar className='w-4 h-4 mr-1' />
                      <span>{course.duration}</span>
                    </div>

                    <div className='flex justify-between items-center mb-4'>
                      <div className='text-2xl font-bold text-blue-700'>
                        Mục tiêu: {course.target}
                      </div>
                      <div className='flex items-center'>
                        <Star className='w-4 h-4 text-yellow-400 fill-current' />
                        <span className='ml-1 font-medium'>4.9</span>
                      </div>
                    </div>

                    <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center'>
                      Đăng ký ngay <ArrowRight className='ml-2 w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Test Sections */}
      <section className='py-16 bg-blue-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Cấu trúc bài kiểm tra đầu vào</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Bài kiểm tra toàn diện 4 kỹ năng giúp đánh giá chính xác trình độ hiện tại của bạn
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {[
              {
                icon: <Headphones className='w-10 h-10' />,
                title: 'Listening',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: <Eye className='w-10 h-10' />,
                title: 'Reading',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: <PenTool className='w-10 h-10' />,
                title: 'Writing',
                color: 'bg-purple-100 text-purple-600',
              },
              {
                icon: <Mic className='w-10 h-10' />,
                title: 'Speaking',
                color: 'bg-red-100 text-red-600',
              },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300'
              >
                <div
                  className={`${skill.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  {skill.icon}
                </div>
                <h3 className='text-xl font-bold mb-2'>{skill.title}</h3>
                <p className='text-gray-600'>
                  Đánh giá toàn diện kỹ năng {skill.title.toLowerCase()} của bạn
                </p>
                <button className='mt-4 text-blue-600 font-medium flex items-center justify-center mx-auto'>
                  Xem chi tiết <ArrowRight className='ml-1 w-4 h-4' />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Tại sao chọn The Real IELTS?</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Những lý do hàng ngàn học viên tin tưởng lựa chọn chúng tôi
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: <Shield className='w-12 h-12' />,
                title: 'Giáo viên chất lượng',
                desc: 'Đội ngũ giáo viên giàu kinh nghiệm, chuyên môn cao và tận tâm',
              },
              {
                icon: <Heart className='w-12 h-12' />,
                title: 'Lộ trình cá nhân hóa',
                desc: 'Lộ trình học được thiết kế riêng theo năng lực và mục tiêu của từng học viên',
              },
              {
                icon: <BookOpen className='w-12 h-12' />,
                title: 'Tài liệu độc quyền',
                desc: 'Hệ thống tài liệu và đề thi được biên soạn công phu, cập nhật liên tục',
              },
              {
                icon: <Users className='w-12 h-12' />,
                title: 'Lớp học nhỏ',
                desc: 'Sĩ số lớp học giới hạn, đảm bảo chất lượng tương tác và hỗ trợ',
              },
              {
                icon: <Target className='w-12 h-12' />,
                title: 'Cam kết đầu ra',
                desc: 'Cam kết bằng văn bản về kết quả học tập và điểm số mục tiêu',
              },
              {
                icon: <Clock className='w-12 h-12' />,
                title: 'Linh hoạt thời gian',
                desc: 'Học viên có thể linh hoạt sắp xếp lịch học phù hợp với thời gian biểu',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300'
              >
                <div className='text-blue-600 mb-4'>{item.icon}</div>
                <h3 className='text-xl font-bold mb-2'>{item.title}</h3>
                <p className='text-gray-600'>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className='py-16 bg-blue-50'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Học viên nói gì về chúng tôi?</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Những phản hồi chân thật từ học viên đã trải nghiệm khóa học
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {comments?.data?.slice(0, 6).map((comment: any) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className='bg-white p-6 rounded-xl shadow-md'
              >
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full mr-4 flex items-center justify-center'>
                    {comment.author?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className='font-bold'>{comment.author?.name || 'Người dùng'}</div>
                    <div className='text-gray-600 text-sm'>Học viên</div>
                  </div>
                </div>
                <div className='flex mb-3'>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className='w-5 h-5 text-yellow-400 fill-current' />
                  ))}
                </div>
                <p className='text-gray-600 line-clamp-4'>"{comment.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 bg-gradient-to-r from-blue-800 to-blue-600 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl font-bold mb-6'>Sẵn sàng chinh phục mục tiêu IELTS?</h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Đăng ký kiểm tra đầu vào miễn phí và nhận lộ trình học tập cá nhân hóa ngay hôm nay
          </p>
          <button className='bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg'>
            Đăng ký kiểm tra ngay
          </button>
        </div>
      </section>
    </div>
  )
}
