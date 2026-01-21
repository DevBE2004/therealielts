import LadiView from "@/components/common/Ladiview";
import { CommentService } from "@/services/comment.service";
import { CourseService } from "@/services/course.service";
import { LadiPageService } from "@/services/ladipage.service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const page = async () => {
  const courses = await CourseService.getall();
  const comments = await CommentService.getAll();
  const ladiPage = await LadiPageService.getOne(z.any(), 1);
  const html = ladiPage.data?.content || null;
  // const decodedHtml = he.decode(html);
  // console.log("Decode HTML: ", decodedHtml)

  return (
    <>
      {html !== null ? (
        <iframe
          srcDoc={html}
          style={{ width: "100%", height: "100vh", border: "none" }}
        />
      ) : (
        <LadiView courses={courses} comments={comments} />
      )}
    </>
  );
};

export default page;
