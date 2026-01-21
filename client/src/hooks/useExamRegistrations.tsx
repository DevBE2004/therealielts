// hooks/useExamRegistrations.ts
import { ExamRegistrationService } from "@/services/examRegistration.service"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useExamRegistrations() {
  return useQuery({
    queryKey: ["exam-registrations"],
    queryFn: () => ExamRegistrationService.list().then((res) => res.data),
  })
}

export function useExamRegistrationDetail(id: number) {
  return useQuery({
    queryKey: ["exam-registrations", id],
    queryFn: () => ExamRegistrationService.detail(id).then((res) => res.data),
    enabled: !!id,
  })
}

export function useCreateExamRegistration() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ExamRegistrationService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["exam-registrations"] }),
  })
}
