import { FormProvider, useForm } from "react-hook-form";

export function DialogFormWrapper({
  methods,
  children,
}: {
  methods: any;
  children: React.ReactNode;
}) {
  return <FormProvider {...methods}>{children}</FormProvider>;
}
