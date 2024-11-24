import { createFileRoute } from '@tanstack/react-router'
import Ask from '@/pages/ask'

export const Route = createFileRoute('/ask')({
  component: Ask,
})