'use client'
import { useState } from "react"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { z } from "zod"
import ReactJson from 'react-json-view'
import { zodResolver } from "@hookform/resolvers/zod"
import qs from 'qs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import CollectionDefine from "@/components/shared/collection-define";

const COLLECTION = [
  {
    label: 'User',
    value: 'user',
  },
  {
    label: 'Profile',
    value: 'profile',
  },
  {
    label: 'Post',
    value: 'post',
  },
  {
    label: 'Comment',
    value: 'comment',
  },
  {
    label: 'Category',
    value: 'category',
  },
  {
    label: 'PostCategory',
    value: 'postCategory',
  },
]


const schema = z.object({
  collection: z.string().nonempty('Collection is required'),
  query: z.string().nonempty('Query is required'),
})

export default function Home() {
  const [data, setData] = useState<Record<string, any> | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      collection: 'user',
      query: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsLoading(true)
      const parse = qs.parse(values.query)
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection: values.collection,
          query: parse,
        }),
      })
      const data = await res.json()
      setData(data)
      setIsLoading(false)
    } catch {
      setIsLoading(false)
      setData(null)
    }
  }

  return (
    <Dialog>
      <div className='flex flex-col gap-4 p-4'>
        <h1 className="text-2xl font-bold">Prisma Query Builder</h1>
        <p className="text-gray-600">
          This app lets you create queries for your database models.
          Select a collection and enter your query to get results.
          You can view the available collections <DialogTrigger><p className='text-[22px] italic font-bold underline text-blue-500 cursor-pointer'>here.</p></DialogTrigger>
        </p>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center">
              <div className="flex justify-center items-center gap-2">
                <FormField
                  control={form.control}
                  name="collection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a collection..." />
                          </SelectTrigger>
                          <SelectContent>
                            {COLLECTION.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Query</FormLabel>
                      <FormControl>
                        <Input className="w-[1024px]" placeholder="Enter your search query..." {...field} />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />

              </div>
              <Button type="submit" className="w-[100px] cursor-pointer" disabled={isLoading}>
                {isLoading && (
                  <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 animate-spin -translate-x-1/2 -translate-y-1/2" />
                )}
                {isLoading ? "In progress...." : "Send"}
              </Button>
            </form>
          </Form>
        </div>
        <div className='flex gap-2 items-stretch'>
          <div
            className='flex-1 p-2 flex flex-col'
            style={{
              borderStyle: 'double',
              borderWidth: '3px',
              borderColor: 'black',
            }}
          >
            <label className='mb-2'>Query</label>
            <div className='flex-1 overflow-auto'>
              <ReactJson src={data && data?.builder ? data.builder : {}} />
            </div>
          </div>
          <div
            className='flex-1 p-2 flex flex-col'
            style={{
              borderStyle: 'double',
              borderWidth: '3px',
              borderColor: 'black',
            }}
          >
            <label className='mb-2'>Result</label>
            <div className='flex-1 overflow-auto'>
              <ReactJson src={data && data?.data ? data.data : {}} />
            </div>
          </div>
        </div>
      </div>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-hidden">
        <CollectionDefine />
      </DialogContent>
    </Dialog>
  );
}
