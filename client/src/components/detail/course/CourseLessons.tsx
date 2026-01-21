// components/CourseLessons.tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { splitSections } from "@/hooks/splitSections";
import { Lesson } from "@/types/lesson";

type PaheProps = {
  lessons: Lesson[];
};

export default function CourseLessons({ lessons }: PaheProps) {
  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Nội dung chương trình học <span className="text-blue-600">{lessons.length}</span> buổi
      </h2>

      {lessons.length === 0 ? (
        <p className="text-lg text-gray-600">Chưa có nội dung buổi học.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {lessons.map((lesson, idx) => (
            <AccordionItem key={lesson.id ?? idx} value={`lesson-${idx}`}>
              <AccordionTrigger className="text-lg font-sans font-[600] text-gray-900">
                {lesson.title}
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {lesson.description && <p className="text-base font-sans font-[500] text-gray-700">{lesson.description}</p>}

                {lesson.details ? (
                  <ul className="list-disc pl-6 text-base text-gray-800 space-y-2">
                    {splitSections(lesson.details).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-base text-gray-500">Chưa có chi tiết.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}
