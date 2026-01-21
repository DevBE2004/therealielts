import CollapsibleBase from "@/components/ui/collapsible/collapsible-custom";
import { FormInput } from "@/components/ui/FormInput";
import SectionForm from "./section/section-form";

const FormCustomPage = () => {
  return (
    <div className="space-y-4">
      <CollapsibleBase
        title={"Thông tin chung"}
        description={
          <div className="">
            <FormInput
              name="title"
              label="Tên page"
              type="text"
              placeholder="Nhập tên page"
              isIcon={false}
            />
            <FormInput
              name="slug"
              label="Slug"
              type="text"
              placeholder="VD: /ten-page"
              isIcon={false}
            />
          </div>
        }
      />

      <CollapsibleBase
        title={"Cấu hình section"}
        description={<SectionForm />}
      />
    </div>
  );
};

export default FormCustomPage;
