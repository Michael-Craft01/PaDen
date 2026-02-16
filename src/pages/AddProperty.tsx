import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Upload, X, ChevronRight, ChevronLeft, Check, Camera, Image as ImageIcon } from 'lucide-react';
import { clsx } from 'clsx';

export default function AddProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Form State
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    amenities: '',
  });

  // Check if in Edit Mode
  useEffect(() => {
    if (isEditing && user) {
      fetchPropertyDetails();
    }
  }, [id, user]);

  const fetchPropertyDetails = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          price: data.price.toString(),
          location: data.location,
          address: data.address || '',
          amenities: data.amenities ? data.amenities.join(', ') : '',
        });
        setExistingImages(data.images || []);
      }
    } catch (error: any) {
      console.error('Error details:', error);
      alert('Error loading property: ' + error.message);
      navigate('/properties');
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImages(existingImages.filter(url => url !== urlToRemove));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  interface StepIndicatorProps {
    step: number;
    current: number;
    label: string;
  }

  const StepIndicator = ({ step, current, label }: StepIndicatorProps) => {
    const isActive = current >= step;
    const isCurrent = current === step;

    return (
      <div className="flex flex-col items-center relative z-10">
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
          isActive ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/50" : "bg-zinc-800 border-zinc-700 text-zinc-500",
          isCurrent && "ring-4 ring-purple-500/20 scale-110"
        )}>
          {isActive ? <Check size={18} /> : step}
        </div>
        <span className={clsx(
          "absolute -bottom-6 text-xs font-medium whitespace-nowrap transition-colors",
          isActive ? "text-purple-400" : "text-zinc-600"
        )}>
          {label}
        </span>
      </div>
    )
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 1. Upload New Images
      const newImageUrls: string[] = [];
      for (const file of images) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw new Error(`Image Upload Error: ${uploadError.message}`);

        const { data } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        newImageUrls.push(data.publicUrl);
      }

      const finalImages = [...existingImages, ...newImageUrls];

      const propertyData = {
        owner_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        address: formData.address,
        images: finalImages,
        amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
        status: 'active',
      };

      if (isEditing) {
        const { error: updateError } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('properties')
          .insert([propertyData]);
        if (insertError) throw insertError;
      }

      navigate('/properties');
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">{isEditing ? 'Edit Property' : 'List New Property'}</h1>
          <p className="text-zinc-400 mt-1">Complete the steps below to {isEditing ? 'update your' : 'publish a new'} listing.</p>
        </div>

        {/* Progress Bar */}
        <div className="relative flex justify-between items-center mb-12 px-4">
          <div className="absolute left-0 top-5 w-full h-0.5 bg-zinc-800 -z-0"></div>
          <div
            className="absolute left-0 top-5 h-0.5 bg-purple-600 transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          ></div>

          <StepIndicator step={1} current={currentStep} label="Basic Details" />
          <StepIndicator step={2} current={currentStep} label="Location" />
          <StepIndicator step={3} current={currentStep} label="Amenities" />
          <StepIndicator step={4} current={currentStep} label="Photos" />
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
          <div className="p-8 flex-1">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Property Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-zinc-500"
                    placeholder="e.g. Modern Apartment in City Center"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-zinc-500 resize-none"
                    placeholder="Tell us about your property..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Monthly Rent ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-zinc-500"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-4">Location Details</h2>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">City / Area</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-zinc-500"
                    placeholder="e.g. Harare, Avondale"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Full Address (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder-zinc-500"
                    placeholder="e.g. 123 Samora Machel Ave"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-4">Features & Amenities</h2>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Amenities</label>
                  <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 mb-2">
                    <p className="text-xs text-zinc-500 mb-2">Separate items with commas</p>
                    <input
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 p-0"
                      placeholder="WiFi, Solar, Parking, Security..."
                      value={formData.amenities}
                      onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.amenities.split(',').filter(Boolean).map((amenity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs border border-purple-500/20">
                        {amenity.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold text-white mb-4">Property Gallery</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Area */}
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700 border-dashed rounded-xl cursor-pointer hover:bg-zinc-800/50 hover:border-purple-500/50 bg-zinc-900 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex flex-col items-center justify-center z-10">
                      <div className="p-4 bg-zinc-800 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg">
                        <Camera className="w-8 h-8 text-purple-500" />
                      </div>
                      <p className="mb-2 text-sm text-zinc-300 font-medium">Click to upload photos</p>
                      <p className="text-xs text-zinc-500">JPG, PNG or WEBP</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                  </label>

                  {/* Carousel / Preview Grid */}
                  <div className="h-64 bg-zinc-900 rounded-xl border border-zinc-800 overflow-y-auto p-4 custom-scrollbar">
                    {(existingImages.length === 0 && images.length === 0) ? (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No images selected</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {existingImages.map((url, idx) => (
                          <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden group">
                            <img src={url} alt="existing" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1 right-1 bg-black/70 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X size={12} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1">Saved</div>
                          </div>
                        ))}
                        {images.map((file, idx) => (
                          <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden group border border-purple-500/30">
                            <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-black/70 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X size={12} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-purple-900/80 text-white text-[10px] px-2 py-1">New</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-6 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={clsx(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors",
                currentStep === 1 ? "text-zinc-600 cursor-not-allowed" : "text-zinc-300 hover:text-white hover:bg-zinc-800"
              )}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/30 font-medium group"
              >
                Next Step <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-lg shadow-green-900/30 font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>{isEditing ? 'Update Property' : 'Publish Listing'} <Check size={16} /></>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
