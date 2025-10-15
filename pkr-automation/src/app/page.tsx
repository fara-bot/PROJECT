
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Automate Your PKR Workflow
          </h1>
          <p className="mt-2 text-gray-600">
            Stop manually duplicating tickets. Connect your boards in minutes and let automation handle the rest.
          </p>
        </div>
        <div className="pt-4">
          <Link href="/configure" className="block w-full px-4 py-2 font-bold text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Connect Your Boards
          </Link>
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
