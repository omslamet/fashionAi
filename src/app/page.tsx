"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleGeneratePrompt } from "@/app/actions";
import { Logo } from "@/components/icons";

const formSchema = z.object({
  productDescription: z.string().min(2, {
    message: "Product description must be at least 2 characters.",
  }),
  style: z.enum(["Ghost Mannequin", "Female Model", "Male Model"]),
  additionalDetails: z.string().optional(),
});

export default function Home() {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
      style: "Female Model",
      additionalDetails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedPrompt("");

    try {
      const result = await handleGeneratePrompt(values);
      if (result.prompt) {
        setGeneratedPrompt(result.prompt);
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard!",
    })
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Logo className="h-12 w-12 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight">
              FashionPromptAI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Generate AI prompts for your fashion product photography.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Your Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., White t-shirt with a graphic print" {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe the fashion item you want to photograph.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ghost Mannequin">Ghost Mannequin</SelectItem>
                          <SelectItem value="Female Model">Female Model</SelectItem>
                          <SelectItem value="Male Model">Male Model</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the desired photography style.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Dynamic pose, soft studio lighting, minimalist concrete background"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Add extra details like pose, lighting, or background.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Generating..." : "Generate Prompt"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">AI is crafting your prompt...</p>
          </div>
        )}

        {generatedPrompt && (
          <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Generated Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md relative group">
                <p className="text-muted-foreground leading-relaxed">{generatedPrompt}</p>
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleCopy}>
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
