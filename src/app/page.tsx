"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Copy, Check, Upload, KeyRound } from "lucide-react";

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
import { handleGeneratePrompt, handleDescribeImage } from "@/app/actions";
import { Logo } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  productDescription: z.string().min(2, {
    message: "Deskripsi produk minimal harus 2 karakter.",
  }),
  style: z.enum(["Mokup", "Model Wanita", "Model Pria"]),
  modelType: z.enum(["Model Indonesia", "Model Bule"]),
  pose: z.enum(["Pose Berdiri Tegak", "Pose Berjalan", "Pose Duduk Santai", "Pose Dinamis", "Pose Close-up"]),
  photoSize: z.enum(["Square", "Portrait"]),
  additionalDetails: z.string().optional(),
});

export default function Home() {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDescribing, setIsDescribing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    const storedApiKey = localStorage.getItem("geminiApiKey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeySave = () => {
    localStorage.setItem("geminiApiKey", apiKey);
    setIsApiKeyDialogOpen(false);
    toast({
      title: "Sukses!",
      description: "API Key Anda telah disimpan di browser.",
    });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productDescription: "",
      style: "Model Wanita",
      modelType: "Model Indonesia",
      pose: "Pose Berdiri Tegak",
      photoSize: "Square",
      additionalDetails: "",
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setIsDescribing(true);
        form.setValue("productDescription", "");

        if (!apiKey) {
          toast({
            variant: "destructive",
            title: "Memakai API Key Cadangan",
            description: "Anda tidak memasukkan API Key, jadi aplikasi akan menggunakan kunci default yang tersedia.",
          });
        }
        
        try {
          const result = await handleDescribeImage({ photoDataUri: dataUri }, apiKey);
          if (result.description) {
            form.setValue("productDescription", result.description);
          } else if (result.error) {
            toast({
              variant: "destructive",
              title: "Kesalahan",
              description: result.error,
            });
          }
        } catch (error) {
           toast({
            variant: "destructive",
            title: "Terjadi kesalahan yang tidak terduga",
            description: "Gagal menghasilkan deskripsi.",
          });
        } finally {
          setIsDescribing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedPrompt("");

    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "Memakai API Key Cadangan",
        description: "Anda tidak memasukkan API Key, jadi aplikasi akan menggunakan kunci default yang tersedia.",
      });
    }

    try {
      const result = await handleGeneratePrompt(values, apiKey);
      if (result.prompt) {
        setGeneratedPrompt(result.prompt);
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Kesalahan",
          description: result.error,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Terjadi kesalahan yang tidak terduga",
        description: "Silakan coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    toast({
      title: "Disalin ke papan klip!",
    })
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
                <Logo className="h-12 w-12 text-primary" />
                <div className="text-left">
                    <h1 className="text-4xl sm:text-5xl font-headline font-bold tracking-tight">
                        FashionPromptAI
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Hasilkan prompt AI untuk fotografi produk fashion Anda.
                    </p>
                     <p className="text-sm text-muted-foreground mt-2">
                        Tools Seller, e- Course dan Konsultasi Jualan Online dengan Bantuan Ai, klik <a href="https://utas.me/omslamet" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">Utas om Slamet</a>
                    </p>
                </div>
            </div>

            <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
              <DialogTrigger asChild>
                 <Button variant="outline" size="icon" className="shrink-0">
                    <KeyRound />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Masukkan API Key Gemini Anda</DialogTitle>
                  <DialogDescription>
                    Jika Anda tidak memasukkan kunci API, aplikasi akan menggunakan kunci default yang tersedia. Kunci Anda akan disimpan dengan aman di browser Anda.
                  </DialogDescription>
                </DialogHeader>
                <Input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan API Key Anda di sini"
                />
                <DialogFooter>
                  <Button onClick={handleApiKeySave}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Buat Prompt Anda</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-2">
                  <FormLabel>Gambar Produk</FormLabel>
                  <FormControl>
                     <Input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload}
                    />
                  </FormControl>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isDescribing}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isDescribing ? "Menganalisis..." : "Unggah Gambar"}
                  </Button>
                   <FormDescription>
                    Unggah gambar untuk menghasilkan deskripsi secara otomatis.
                  </FormDescription>

                  {isDescribing && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      <p>AI sedang menganalisis gambar Anda...</p>
                    </div>
                  )}

                  {imagePreview && (
                    <div className="mt-4 border rounded-md p-2">
                      <Image src={imagePreview} alt="Pratinjau Produk" width={200} height={200} className="rounded-md mx-auto" />
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Produk</FormLabel>
                      <FormControl>
                        <Input placeholder="cth., Kaos putih dengan cetakan grafis" {...field} />
                      </FormControl>
                      <FormDescription>
                        Jelaskan item fashion yang ingin Anda foto.
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
                      <FormLabel>Gaya Keluaran</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih gaya" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Mokup">Mokup</SelectItem>
                          <SelectItem value="Model Wanita">Model Wanita</SelectItem>
                          <SelectItem value="Model Pria">Model Pria</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih gaya fotografi yang diinginkan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Model Indonesia">Model Indonesia</SelectItem>
                          <SelectItem value="Model Bule">Model Bule</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih etnis model yang diinginkan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pose Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih pose model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pose Berdiri Tegak">Pose Berdiri Tegak</SelectItem>
                          <SelectItem value="Pose Berjalan">Pose Berjalan</SelectItem>
                          <SelectItem value="Pose Duduk Santai">Pose Duduk Santai</SelectItem>
                          <SelectItem value="Pose Dinamis">Pose Dinamis</SelectItem>
                          <SelectItem value="Pose Close-up">Pose Close-up</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih pose yang diinginkan untuk model.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="photoSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ukuran Foto</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih ukuran foto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Square">Square</SelectItem>
                          <SelectItem value="Portrait">Portrait</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih rasio aspek untuk foto yang dihasilkan.
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
                      <FormLabel>Detail Tambahan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="cth., Pencahayaan studio yang lembut, latar belakang beton minimalis"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                       <FormDescription>
                        Tambahkan detail tambahan seperti pencahayaan, atau latar belakang.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading || isDescribing} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Membuat..." : "Buat Prompt"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center p-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">AI sedang menyusun prompt Anda...</p>
          </div>
        )}

        {generatedPrompt && (
          <Card className="mt-8 shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Prompt yang Dihasilkan</CardTitle>
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
