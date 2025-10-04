"use client"

import useSWR from "swr"
import axios from "axios"

const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
    .then((res) => res.data)

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects", fetcher)

  return {
    projects: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
