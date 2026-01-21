import { Check, ShieldAlert } from "lucide-react";
import IeltsRegisterForm from "./IeltsRegisterForm";

type instructionStep = {
  instructionTitle: string;
  contentIstruction: string;
}
type section4 = {
  title: string;
  subTitle: string;
  note: string;
  step1: instructionStep;
  step2: instructionStep;
  step3: instructionStep;
};

type Props = {
  section4Record6: section4;
  page?: string;
}; 

export default function InstructionSection({section4Record6, page}: Props) {

    return (
        <section className="w-full bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          {/* Tiêu đề */}
          <div className="text-center">
            <h2 className="text-[#20376C] text-3xl sm:text-4xl font-semibold mb-4">
              {section4Record6?.title || "Hướng dẫn đăng ký thi IELTS tại Trung Tâm"}
            </h2>
            <div className="flex flex-col items-center justify-center gap-2 bg-[#F6EDF0] text-[#20376C] rounded-xl px-4 py-3 lg:px-6 xl:px-8 text-sm sm:text-base font-sans">
              <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0" />
              {section4Record6?.subTitle ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: section4Record6.subTitle,
                }}
              />
            ) : (
              <div className="p-10 text-center font-[700] text-gray-800 animate-pulse">
                Chưa cập nhật!
              </div>
            )}
            </div>
            <p className="mt-4 text-[#20376C] font-sans text-base sm:text-lg">
              {section4Record6?.note || "Hoặc nếu đã nắm chắc lịch thi, các thí sinh chỉ cần thực hiện các bước sau:"}
            </p>
          </div>

          {/* Bước 1 */}
          <div className="bg-[#ECF2FA] rounded-xl p-5 shadow-sm">
            <h3 className="text-[#20376C] text-xl sm:text-2xl font-semibold border-b border-gray-300 pb-2 mb-3">
              {section4Record6?.step1?.instructionTitle || "Bước 1"}
            </h3>
            <div className="flex font-sans text-sm sm:text-base">
              {section4Record6?.step1?.contentIstruction ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: section4Record6.step1.contentIstruction,
                }}
              />
            ) : (
              <div className="p-10 text-center font-[700] text-gray-800 animate-pulse">
                Chưa cập nhật!
              </div>
            )}
            </div>
          </div>

          {/* Bước 2 */}
          <div className="bg-[#E5E6E8] rounded-xl p-5 shadow-sm">
            <h3 className="text-[#20376C] text-xl sm:text-2xl font-semibold border-b border-gray-300 pb-2 mb-3">
              {section4Record6?.step2?.instructionTitle || "Bước 2"}
            </h3>
            <div className="flex font-sans text-sm sm:text-base">
              {section4Record6?.step2?.contentIstruction ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: section4Record6.step2.contentIstruction,
                }}
              />
            ) : (
              <div className="p-10 text-center font-[700] text-gray-800 animate-pulse">
                Chưa cập nhật!
              </div>
            )}
            </div>
          </div>

          {/* Form đăng ký */}
          {page !== undefined && page === "client" && (
            <div className="w-full mt-6">
            <IeltsRegisterForm />
          </div>
          )}

          <div className="bg-[#ECF2FA] rounded-xl p-5 shadow-sm">
            <h3 className="text-[#20376C] text-xl sm:text-2xl font-semibold border-b border-gray-300 pb-2 mb-3">
              {section4Record6?.step3?.instructionTitle || "Bước 3"}
            </h3>
            <div className="flex font-sans text-sm sm:text-base">
              {section4Record6?.step3?.contentIstruction ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: section4Record6.step3.contentIstruction,
                }}
              />
            ) : (
              <div className="p-10 text-center font-[700] text-gray-800 animate-pulse">
                Chưa cập nhật!
              </div>
            )}
            </div>
          </div>
        </div>
      </section>
    )
}