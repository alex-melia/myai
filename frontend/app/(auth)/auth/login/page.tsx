import LoginForm from "@/components/forms/LogIn"

export const runtime = "edge"

export default function LoginPage() {
  return (
    <div className="flex max-w-[600px] w-full flex-col items-center">
      <LoginForm />
    </div>
  )
}
