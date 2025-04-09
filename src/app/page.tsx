"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { type AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Valid email is required."),
  assignment_description: z
    .string()
    .min(10, "Assignment description must be at least 10 characters."),
  github_repo_url: z.string().url("Valid GitHub repository URL is required."),
  candidate_level: z.string({
    errorMap: () => ({ message: "Candidate level is required." }),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface LevelsResponse {
  levels: string[];
}

interface ApiErrorResponse {
  errors?: string[];
  message?: string;
}

export default function Home() {
  const [levels, setLevels] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<LevelsResponse>(
          "https://tools.qa.ale.ai/api/tools/candidates/levels"
        );

        const validLevels = res.data.levels;

        setLevels(validLevels);
        setFetchError("");
      } catch (err) {
        console.error("Failed to fetch candidate levels:", err);
        setFetchError(
          "Failed to load candidate levels. Please refresh the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(
        "https://tools.qa.ale.ai/api/tools/candidates/assignments",
        data
      );
      router.push(
        `/thank-you?name=${encodeURIComponent(
          data.name
        )}&email=${encodeURIComponent(data.email)}&level=${encodeURIComponent(
          data.candidate_level
        )}`
      );
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.data?.errors) {
        alert(axiosError.response.data.errors.join("\n"));
      } else if (axiosError.response?.data?.message) {
        alert(axiosError.response.data.message);
      } else {
        alert("Submission failed. Please try again.");
      }
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Assignment Submission
      </h1>

      {fetchError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading form...</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border rounded-md p-4 sm:p-6 bg-card"
        >
          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
            <label
              htmlFor="name"
              className="text-sm font-medium mb-1 sm:mb-0 flex items-center sm:w-1/3"
            >
              Name <span className="pl-1 text-red-500">*</span>
            </label>
            <div className="sm:w-2/3">
              <Input id="name" placeholder="Vadym" {...register("name")} />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
            <label
              htmlFor="email"
              className="text-sm font-medium mb-1 sm:mb-0 flex items-center sm:w-1/3"
            >
              Email <span className="pl-1 text-red-500">*</span>
            </label>
            <div className="sm:w-2/3">
              <Input
                id="email"
                type="email"
                placeholder="vadym@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-start">
            <label
              htmlFor="assignment_description"
              className="text-sm font-medium items-center flex-row flex sm:w-1/3"
            >
              Assignment Description
              <span className="pl-1 text-red-500">*</span>
            </label>
            <div className="sm:w-2/3">
              <Textarea
                id="assignment_description"
                placeholder="Describe your assignment in detail..."
                className="h-24"
                {...register("assignment_description")}
              />
              {errors.assignment_description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assignment_description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
            <label
              htmlFor="github_repo_url"
              className="text-sm font-medium items-center flex-row flex sm:w-1/3"
            >
              GitHub Repository URL <span className="pl-1 text-red-500">*</span>
            </label>
            <div className="sm:w-2/3">
              <Input
                id="github_repo_url"
                placeholder="https://github.com/username/repo"
                {...register("github_repo_url")}
              />
              {errors.github_repo_url && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.github_repo_url.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-4 sm:items-center">
            <label
              htmlFor="candidate_level"
              className="text-sm font-medium items-center flex-row flex sm:w-1/3"
            >
              Candidate Level <span className="pl-1 text-red-500">*</span>
            </label>
            <div className="sm:w-2/3">
              <Select
                onValueChange={(val) => {
                  setValue("candidate_level", val);
                }}
              >
                <SelectTrigger id="candidate_level">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.candidate_level && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.candidate_level.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Assignment"
              )}
            </Button>
          </div>
        </form>
      )}
    </main>
  );
}
