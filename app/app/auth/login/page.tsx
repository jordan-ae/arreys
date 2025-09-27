import { LoginForm } from "~/components/login-form";

export default function Page() {
  return (
    <div className="flex bg-neutral-950 flex-col h-screen w-full items-center justify-between p-6 md:p-10">
      {/* Top: login form centered */}
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* Bottom footer */}
      <div className="text-center flex justify-between w-full space-x-4">
        <span className="text-gray-400">Need Help?</span>
        <span className="text-gray-400">2025 arrey</span>
        <span className="text-gray-400">Contact us</span>
      </div>
    </div>
  )
}

