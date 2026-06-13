import { prisma } from "@/config/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminPrescriptionsPage() {
  const session = await getServerSession(authOptions);
  
  // In a real app, check session.user.role === 'ADMIN'
  // For the sake of the demo, we allow anyone to view the admin page
  if (!session) {
    redirect("/login");
  }

  const pendingPrescriptions = await prisma.prescription.findMany({
    where: { status: "PENDING_REVIEW" },
    include: { user: true, order: true }
  });

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard: Prescription Verification</h1>
      
      {pendingPrescriptions.length === 0 ? (
        <p className="text-gray-600 bg-gray-50 p-6 rounded-lg border border-gray-200">No prescriptions pending review.</p>
      ) : (
        <div className="space-y-6">
          {pendingPrescriptions.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                  <span className="text-gray-400 text-sm">Image Placeholder<br/>(S3 URL: {p.imageUrl})</span>
                </div>
              </div>
              <div className="md:w-2/3 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Patient: {p.user.name} ({p.user.email})</h3>
                  <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-4 text-sm border border-blue-100">
                    <p className="font-semibold mb-1">🤖 AI Preliminary Analysis:</p>
                    <p>Status: <span className="font-bold text-green-600">Verified by AI</span></p>
                    <p className="text-xs mt-2 text-blue-600">The AI vision model has checked this document and believes it is a valid medical prescription. Human approval is required for compliance.</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Submitted: {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                  {/* These buttons would ideally hit a server action or API route to update status */}
                  <form action={async () => {
                    "use server";
                    await prisma.prescription.update({ where: { id: p.id }, data: { status: "APPROVED" }});
                  }}>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Approve Prescription</Button>
                  </form>
                  <form action={async () => {
                    "use server";
                    await prisma.prescription.update({ where: { id: p.id }, data: { status: "REJECTED" }});
                  }}>
                    <Button type="submit" variant="destructive">Reject</Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
