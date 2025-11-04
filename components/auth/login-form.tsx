'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormMessage, FormLabel, FormItem } from '@/components/ui/form'
import { CardWrapper } from './card-wrapper'
import { loginSchemas } from '@/schemas'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { login } from '@/actions/login'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
const LoginForm = () => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const form = useForm<z.infer<typeof loginSchemas>>({
    resolver: zodResolver(loginSchemas),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()

  const onsubmit = async (values: z.infer<typeof loginSchemas>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      // login(values).then((data) => {
      //   setError(data.error)
      //   setSuccess(data.success)
      //   setTimeout(() => {
      //     router.refresh() // ép fetch lại session
      //     router.push('/dashboard') // hoặc redirect page
      //   }, 1500)
      // })
      signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      }).then((res) => {
        if (res?.error) {
          console.log('Login failed', res.error)
        } else {
          window.location.href = '/'
        }
      })
    })
  }

  return (
    <CardWrapper headerLabel="Welcome back!" backButtonLabel="Don't have an account?" backButtonHref="/auth/register">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="john.doe@example.com" type="email" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
export default LoginForm
