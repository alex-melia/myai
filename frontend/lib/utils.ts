import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFileSize(bytes: string) {
  let bytesNum = Number(bytes)
  const kilobytes = bytesNum / 1024
  const megabytes = kilobytes / 1024
  const gigabytes = megabytes / 1024

  if (gigabytes >= 1) {
    return `${gigabytes.toFixed(3)} GB`
  } else if (megabytes >= 1) {
    return `${megabytes.toFixed(3)} MB`
  } else {
    return `${kilobytes.toFixed(3)} KB`
  }
}
