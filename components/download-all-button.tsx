"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import html2canvas from "@/lib/html2canvas"
import JSZip from "jszip"

interface DownloadAllButtonProps {
  cities: string[]
}

export function DownloadAllButton({ cities }: DownloadAllButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDownloadAll = async () => {
    setIsDownloading(true)
    setProgress(0)

    try {
      const zip = new JSZip()
      const totalCities = cities.length
      let processedCities = 0

      // Process each city card
      for (const city of cities) {
        const cardElement = document.getElementById(`weather-card-${city}`)
        if (cardElement) {
          try {
            const canvas = await html2canvas(cardElement, {
              useCORS: true,
              allowTaint: true,
              backgroundColor: null,
              scale: 2, // Higher quality
              logging: false,
              onclone: (clonedDoc) => {
                // Find all images in the cloned document and mark them as crossOrigin anonymous
                const images = clonedDoc.getElementsByTagName("img")
                for (let i = 0; i < images.length; i++) {
                  images[i].crossOrigin = "anonymous"
                }
              },
            })

            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
              canvas.toBlob((blob) => {
                if (blob) resolve(blob)
                else resolve(new Blob([""], { type: "image/png" }))
              }, "image/png")
            })

            // Add to zip
            const date = new Date().toISOString().split("T")[0]
            zip.file(`${city}-weather-${date}.png`, blob)

            // Update progress
            processedCities++
            setProgress(Math.round((processedCities / totalCities) * 100))
          } catch (error) {
            console.error(`Error processing ${city}:`, error)
          }
        }
      }

      // Generate the zip file as a blob
      const zipBlob = await zip.generateAsync({ type: "blob" })

      // Use native browser download API
      const date = new Date().toISOString().split("T")[0]
      const fileName = `weather-cards-${date}.zip`

      // Create a URL for the blob
      const url = URL.createObjectURL(zipBlob)

      // Create a download link
      const link = document.createElement("a")
      link.href = url
      link.download = fileName

      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up by revoking the object URL
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading all cards:", error)
    } finally {
      setIsDownloading(false)
      setProgress(0)
    }
  }

  return (
    <Button
      onClick={handleDownloadAll}
      disabled={isDownloading}
      className="w-full glassmorphism-light text-gray-800 hover:text-gray-900 hover:bg-white/40 transition-all"
    >
      <Download className="h-5 w-5 mr-2" />
      {isDownloading ? (progress > 0 ? `Processing... ${progress}%` : "Processing...") : "Download All Weather Cards"}
    </Button>
  )
}
