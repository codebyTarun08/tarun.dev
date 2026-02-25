
'use client';

import * as React from "react"
import { X, Download, ZoomIn, ZoomOut, QrCode, FileText, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react"
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [zoom, setZoom] = React.useState(100)
  const [showQR, setShowQR] = React.useState(false)
  const [resumeUrl, setResumeUrl] = React.useState("/resume.pdf") // Fallback
  const [origin, setOrigin] = React.useState('https://tarun.dev')
  const qrRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  React.useEffect(() => {
    async function fetchResumeUrl() {
      try {
        const docRef = doc(db, 'portfolioConfig', 'resume');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().resumeUrl) {
          setResumeUrl(docSnap.data().resumeUrl);
        }
      } catch (err) {
        console.error('Failed to fetch resume URL:', err);
      }
    }
    if (isOpen) {
      fetchResumeUrl();
    }
  }, [isOpen]);

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = resumeUrl
    link.target = "_blank"
    link.download = "Tarun_Kumar_Fullstack_AI_Resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("resume-qr-canvas") as HTMLCanvasElement
    if (canvas) {
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = "Tarun_Portfolio_QR.png"
      link.href = url
      link.click()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 border-none bg-background/80 backdrop-blur-2xl overflow-hidden rounded-3xl shadow-2xl">
        <DialogTitle className="sr-only">Professional Resume Viewer</DialogTitle>
        
        <div className="absolute top-0 left-0 right-0 h-16 bg-card/50 backdrop-blur-md border-b border-border/50 flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Tarun_Kumar_Resume.pdf</h2>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Fullstack & AI Engineer</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-secondary/50 rounded-full px-3 py-1 border border-border mr-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-xs font-mono w-12 text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <Button variant="secondary" size="sm" className="rounded-full gap-2 hidden sm:flex" onClick={() => setShowQR(!showQR)}>
              <QrCode className="w-4 h-4" />
              QR Link
            </Button>
            
            <Button size="sm" className="rounded-full gap-2 bg-primary hover:bg-primary/90" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="h-full pt-16 flex justify-center bg-muted/30 overflow-auto scrollbar-hide">
          <div 
            className="p-8 transition-all duration-300 origin-top"
            style={{ width: `${zoom}%`, maxWidth: '1000px' }}
          >
            <div className="w-full aspect-[1/1.414] bg-white rounded-lg shadow-2xl overflow-hidden border border-border/50">
              <iframe 
                src={`${resumeUrl}#toolbar=0`} 
                className="w-full h-full border-none"
                title="Resume PDF"
              />
            </div>
          </div>
        </div>

        {showQR && (
          <div className="absolute top-20 right-6 w-72 bg-card border border-border shadow-2xl rounded-3xl p-6 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg">Share Profile</h3>
                <p className="text-xs text-muted-foreground">Scan to visit portfolio</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 rounded-full" onClick={() => setShowQR(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center mb-6 shadow-inner">
              <div className="hidden">
                <QRCodeCanvas 
                  id="resume-qr-canvas"
                  value={origin}
                  size={200}
                  level="H"
                />
              </div>
              <QRCodeSVG 
                value={origin}
                size={160}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Linked to Portfolio
              </div>
              <Button className="w-full rounded-xl gap-2 h-10" onClick={downloadQRCode}>
                <Download className="w-4 h-4" />
                Save QR as PNG
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
