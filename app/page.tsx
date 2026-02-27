import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect root to dashboard - Voice AI lives there
  redirect('/dashboard')
}
