"use client"

import { FieldValues, FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodType } from "zod"

interface FormContainerProps<T> {
  schema: ZodType<T>
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => void
  children: React.ReactNode
}

export function FormContainer<T>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: FormContainerProps<T>) {
  const methods = useForm<any>({
    resolver: zodResolver(schema as any),
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {children}
      </form>
    </FormProvider>
  )
}
