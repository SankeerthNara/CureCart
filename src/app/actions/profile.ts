'use server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { prisma } from "@/config/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return { error: "Not authenticated" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zipCode = formData.get("zipCode") as string;
  const image = formData.get("image") as string;

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        ...(image ? { image } : {})
      }
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Profile Update Error:", error);
    return { error: error.message || "Failed to update profile" };
  }
}
