
"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Send, CheckCircle2, Loader2, MapPin, Mail, Phone } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
})

export function ContactSection() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsSubmitting(true)
    try {
      await addDoc(collection(db, "contacts"), {
        ...values,
        createdAt: serverTimestamp(),
      })
      setIsSuccess(true)
      form.reset()
      setTimeout(() => setIsSuccess(false), 5000)
    } catch (error) {
      console.error("Error submitting form", error)
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error sending your message. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-4">Contact</h2>
            <h3 className="text-4xl font-bold mb-6">Let&apos;s Build Something Incredible Together.</h3>
            <p className="text-lg text-muted-foreground mb-10">
              Whether you have a specific project in mind or just want to say hello, feel free to reach out. I am always open to discussing new ideas.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Location</h4>
                  <p className="text-muted-foreground">Pune, India</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Email</h4>
                  <p className="text-muted-foreground">tarun.dev@example.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border shadow-xl relative reveal">
            {isSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-3xl z-10 animate-in fade-in zoom-in duration-500 text-center px-6">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold mb-2">Message Sent!</h4>
                <p className="text-muted-foreground">Thank you for reaching out. I&apos;ll get back to you shortly.</p>
                <Button variant="outline" className="mt-8 rounded-full" onClick={() => setIsSuccess(false)}>
                  Send another message
                </Button>
              </div>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="rounded-xl bg-secondary/20 border-transparent focus:border-primary transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} className="rounded-xl bg-secondary/20 border-transparent focus:border-primary transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell me about your project..." 
                          className="min-h-[150px] rounded-xl bg-secondary/20 border-transparent focus:border-primary transition-all resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  )
}
