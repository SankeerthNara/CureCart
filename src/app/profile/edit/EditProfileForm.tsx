'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/app/actions/profile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function EditProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(user.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    if (imagePreview) {
      formData.set('image', imagePreview);
    }
    
    const result = await updateProfile(formData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/profile');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 flex items-center justify-center">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400 text-sm">No Image</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="imageUpload" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-full transition-colors">
            Change Photo
          </label>
          <input 
            id="imageUpload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange}
          />
          {imagePreview && imagePreview !== user.image && (
            <button 
              type="button" 
              onClick={() => setImagePreview(user.image || null)}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-full transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
        <Input 
          id="name" 
          name="name" 
          defaultValue={user.name || ''} 
          placeholder="e.g. John Doe"
          className="rounded-xl border-gray-300"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
        <Input 
          id="phone" 
          name="phone" 
          defaultValue={user.phone || ''} 
          placeholder="e.g. +91 9876543210"
          className="rounded-xl border-gray-300"
        />
      </div>

      <div className="space-y-2 pt-4 border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Shipping Address</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Street Address</label>
            <Input 
              id="address" 
              name="address" 
              defaultValue={user.address || ''} 
              placeholder="123 Main St, Apt 4B"
              className="rounded-xl border-gray-300"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-700">City</label>
              <Input 
                id="city" 
                name="city" 
                defaultValue={user.city || ''} 
                className="rounded-xl border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-gray-700">State</label>
              <Input 
                id="state" 
                name="state" 
                defaultValue={user.state || ''} 
                className="rounded-xl border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP / Postal Code</label>
            <Input 
              id="zipCode" 
              name="zipCode" 
              defaultValue={user.zipCode || ''} 
              className="rounded-xl border-gray-300"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => router.push('/profile')}
          className="rounded-xl w-full"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="rounded-xl w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
