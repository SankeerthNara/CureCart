import { MedicineService } from '@/services/medicine.service';
import { MedicineCard } from '@/components/medicine/MedicineCard';
import { SearchBar } from '@/components/medicine/SearchBar';

export const dynamic = 'force-dynamic'; // Ensure we fetch fresh data

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;
  const medicines = await MedicineService.searchMedicines(query);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 px-4 flex flex-col items-center justify-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center tracking-tight mb-4">
          Your AI-Powered Pharmacy
        </h1>
        <p className="text-lg text-gray-600 text-center max-w-2xl mb-10">
          Find any medicine, get automated interactions warnings, and have your prescriptions delivered right to your door.
        </p>
        <SearchBar />
      </section>

      {/* Catalog Section */}
      <section className="w-full max-w-7xl px-4 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Categories Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
            <ul className="space-y-3">
              {['All', 'Prescription Drugs', 'OTC Products', 'Protein Supplements', 'Hair Care', 'Skin Care'].map(category => (
                <li key={category}>
                  <a href={`/?q=${category === 'All' ? '' : category}`} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Medicines Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {query ? `Search results for "${query}"` : 'Popular Medicines'}
            </h2>
            <span className="text-gray-500 text-sm">{medicines.length} items found</span>
          </div>

        {medicines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900">No medicines found</h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              We couldn't find any exact matches for "{query}". 
              Don't worry, our AI will automatically scrape the internet to find it for you in the next phase!
            </p>
          </div>
        )}
        </div>
      </section>
      
    </main>
  );
}
