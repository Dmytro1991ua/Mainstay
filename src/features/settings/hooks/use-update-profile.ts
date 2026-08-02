import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAuthStore } from "@/shared/stores/auth-store";
import { toast } from "@/shared/ui/toast";

import { updateProfile } from "../api/settings-api";
import { profileSchema, type ProfileFormValues } from "../validation";

export type { ProfileFormValues };

export const useUpdateProfile = () => {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      userName: user?.userName ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileFormValues) => updateProfile(user!.id, values),
    onSuccess: (updated) => {
      updateUser({ userName: updated.userName });
      form.reset({ userName: updated.userName });
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error("Failed to update profile", { description: getApiErrorMessage(error) });
    },
  });

  return {
    form,
    onSubmit: form.handleSubmit((values) => mutation.mutate(values)),
    isPending: mutation.isPending,
  };
};
