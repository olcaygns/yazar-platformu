import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{' '}
            <Link
              href="/"
              className="font-medium underline underline-offset-4"
            >
              Yazar
            </Link>
            . The source code is available on{' '}
            <Link
              href="https://github.com/yourusername/yazar"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm font-medium underline underline-offset-4"
          >
            Gizlilik Politikası
          </Link>
          <Link
            href="/terms"
            className="text-sm font-medium underline underline-offset-4"
          >
            Kullanım Koşulları
          </Link>
        </div>
      </div>
    </footer>
  )
} 