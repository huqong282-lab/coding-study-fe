import { useState } from 'react'

export function useFetch<TArgs extends unknown[], TResult>(request: (...args: TArgs) => Promise<TResult>) {
  const [data, setData] = useState<TResult | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function execute(...args: TArgs) {
    setIsLoading(true)
    setError('')

    try {
      const result = await request(...args)
      setData(result)
      return result
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : 'Request gagal'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  function reset() {
    setData(null)
    setError('')
    setIsLoading(false)
  }

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}
