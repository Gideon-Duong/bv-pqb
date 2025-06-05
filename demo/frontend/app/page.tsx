'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import queryString from 'query-string';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CollectionDefine from '@/components/shared/collection-define';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

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
];

const schema = z.object({
  collection: z.string().nonempty('Collection is required'),
  query: z.string().nonempty('Query is required'),
});

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      collection: 'user',
      query: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsLoading(true);
      const parsed = queryString.parse(values.query);
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collection: values.collection,
          query: parsed,
        }),
      });
      const data = await res.json();
      setData(data);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setData(null);
    }
  };

  return (
    <Dialog>
      <div className='flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>Prisma Query Builder</h1>
        <p className='text-gray-600'>
          This app lets you create queries for your database models. Select a collection and enter
          your query to get results. You can view the available collections{' '}
          <DialogTrigger>
            <p className='cursor-pointer text-[22px] font-bold text-blue-500 italic underline'>
              here.
            </p>
          </DialogTrigger>
        </p>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex flex-col items-center gap-4'
            >
              <div className='flex items-center justify-center gap-2'>
                <FormField
                  control={form.control}
                  name='collection'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Select a collection...' />
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
                  name='query'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Query</FormLabel>
                      <FormControl>
                        <Input
                          className='w-[1024px]'
                          placeholder='Enter your search query...'
                          {...field}
                        />
                      </FormControl>
                      {/* <FormMessage /> */}
                    </FormItem>
                  )}
                />
              </div>
              <Button type='submit' className='w-[100px] cursor-pointer' disabled={isLoading}>
                {isLoading && (
                  <Loader2 className='absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin' />
                )}
                {isLoading ? 'In progress....' : 'Send'}
              </Button>
            </form>
          </Form>
        </div>
        <div className='flex items-stretch gap-2'>
          <div
            className='flex flex-1 flex-col p-2'
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
            className='flex flex-1 flex-col p-2'
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
      <DialogContent className='scrollbar-hidden max-h-[90vh] overflow-y-auto'>
        <CollectionDefine />
      </DialogContent>
    </Dialog>
  );
}
