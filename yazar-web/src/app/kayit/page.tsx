import { Metadata } from "next"
import Link from "next/link"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "Yeni bir hesap oluşturun",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hesap Oluşturun
          </h1>
          <p className="text-sm text-muted-foreground">
            Yeni bir hesap oluşturarak kitaplara erişin
          </p>
        </div>
        <RegisterForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/giris"
            className="underline underline-offset-4 hover:text-primary"
          >
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  )
} 