import "./globals.css";

export const metadata = {
  title: 'JobPilot - AI-Powered Resume Matching',
  description: 'Get instant relevance scores for job applications. Upload your resume and discover jobs that match your skills with AI-powered analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
