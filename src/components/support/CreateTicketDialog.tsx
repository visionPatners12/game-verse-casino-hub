
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useTickets } from "@/hooks/useTickets";
import { Loader2, TicketPlus } from "lucide-react";

const formSchema = z.object({
  category: z.enum(["Technical", "Billing", "Behavior", "Other"]),
  content: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export function CreateTicketDialog() {
  const [open, setOpen] = useState(false);
  const { createTicket } = useTickets();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "Technical",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createTicket.mutateAsync(values);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <TicketPlus className="mr-2 h-4 w-4" />
          Nouveau Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau ticket</DialogTitle>
          <DialogDescription>
            Décrivez votre problème, nous vous répondrons dans les plus brefs délais.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Technical">Technique</SelectItem>
                      <SelectItem value="Billing">Facturation</SelectItem>
                      <SelectItem value="Behavior">Comportement</SelectItem>
                      <SelectItem value="Other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre problème..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createTicket.isPending}>
              {createTicket.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Créer le ticket
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
