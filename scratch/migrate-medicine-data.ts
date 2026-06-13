import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Medicine Data Migration...");
  
  const medicines = await prisma.medicine.findMany();
  let updatedCount = 0;

  for (const medicine of medicines) {
    if (!medicine.description) continue;

    const desc = medicine.description;
    let needsUpdate = false;
    let newDesc = desc;
    let newManufacturer = medicine.manufacturer;
    let newPackaging = medicine.packaging;
    let newComposition = medicine.composition;

    // Extract Manufacturer
    const mMatch = desc.match(/Manufactured by (.*?)(?:\. Packaging:|\. Salt Composition:|$)/i);
    if (mMatch && !newManufacturer) {
      newManufacturer = mMatch[1].trim();
      needsUpdate = true;
    }

    // Extract Packaging
    const pMatch = desc.match(/Packaging: (.*?)(?:\. Salt Composition:|$)/i);
    if (pMatch && !newPackaging) {
      newPackaging = pMatch[1].trim();
      needsUpdate = true;
    }

    // Extract Salt Composition
    const sMatch = desc.match(/Salt Composition: (.*)$/i);
    if (sMatch && !newComposition) {
      newComposition = sMatch[1].trim();
      needsUpdate = true;
    }

    // Truncate Description
    // We want to remove the metadata part from the description
    const truncationIndex = desc.search(/Manufactured by|Packaging:|Salt Composition:/i);
    if (truncationIndex !== -1) {
      newDesc = desc.substring(0, truncationIndex).trim();
      needsUpdate = true;
    }

    if (needsUpdate) {
      await prisma.medicine.update({
        where: { id: medicine.id },
        data: {
          description: newDesc,
          manufacturer: newManufacturer,
          packaging: newPackaging,
          composition: newComposition,
        }
      });
      console.log(`✅ Migrated: ${medicine.name}`);
      updatedCount++;
    }
  }

  console.log(`Migration complete! Successfully optimized ${updatedCount} records.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
