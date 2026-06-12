import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/config/db";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Edit2 } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch full user to get latest address details
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/login");

  const fullAddress = [user.address, user.city, user.state, user.zipCode].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-32 w-full relative">
            <Link 
              href="/profile/edit"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
          <div className="px-8 pb-8 relative">
            <div className="absolute -top-12 left-8 border-4 border-white rounded-full bg-white overflow-hidden h-24 w-24">
              {user.image ? (
                user.image.startsWith('data:image') ? (
                  <img src={user.image} alt={user.name || "Profile"} className="w-full h-full object-cover" />
                ) : (
                  <Image src={user.image} alt={user.name || "Profile"} fill className="object-cover" />
                )
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                  {user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="pt-16">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || "CureCart User"}</h1>
              <p className="text-gray-500">{user.email}</p>
              
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                {user.role} ACCOUNT
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone Number</p>
                  <p className="text-sm text-gray-500">{user.phone || "Not provided"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Shipping Address</p>
                  <p className="text-sm text-gray-500">
                    {fullAddress || "No shipping address saved."}
                  </p>
                </div>
              </div>
            </div>

            {(!user.phone || !user.address) && (
              <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm border border-orange-100">
                <p>Complete your profile to enable seamless checkout.</p>
                <Link href="/profile/edit" className="font-semibold underline mt-1 block">Add Details &rarr;</Link>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Your Orders</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">View and track your previous medical orders.</p>
            <Link href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              View Order History &rarr;
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
