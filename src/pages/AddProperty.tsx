import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { AISuggest } from '../components/AISuggest';
import {
  Upload,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Camera,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  FileText,
  Sparkles,
  Tag,
} from 'lucide-react';
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

  // Predefined amenity chips
  const suggestedAmenities = [
    'WiFi', 'Parking', 'Security', 'Solar Power', 'Borehole',
    'Garden', 'Pool', 'Gym', 'DSTV', 'Generator', 'Furnished',
    'Pet Friendly', 'Laundry', 'Air Conditioning', 'Balcony',
  ];

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

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities.split(',').map(a => a.trim()).filter(Boolean);
    if (current.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: current.filter(a => a !== amenity).join(', '),
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...current, amenity].join(', '),
      });
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { num: 1, label: 'Details', icon: FileText },
    { num: 2, label: 'Location', icon: MapPin },
    { num: 3, label: 'Amenities', icon: Tag },
    { num: 4, label: 'Photos', icon: Camera },
  ];

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
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isEditing ? 'Edit Property' : 'List New Property'}
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            {isEditing ? 'Update your listing details.' : 'AI-powered wizard to create the perfect listing.'}
          </p>
        </div>

        {/* ─── Progress Steps ─── */}
        <div className="relative flex justify-between items-center mb-10 px-2">
          {/* Track */}
          <div className="absolute left-0 top-5 w-full h-[2px] bg-zinc-800" />
          <div
            className="absolute left-0 top-5 h-[2px] bg-gradient-to-r from-purple-600 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;

            return (
              <div key={step.num} className="flex flex-col items-center relative z-10">
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 border",
                  isCompleted && "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-900/40",
                  isCurrent && "bg-purple-600/20 border-purple-500/50 text-purple-400 ring-4 ring-purple-500/10 scale-105",
                  !isCompleted && !isCurrent && "bg-zinc-900 border-zinc-700 text-zinc-500"
                )}>
                  {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={clsx(
                  "absolute -bottom-6 text-[11px] font-medium whitespace-nowrap transition-colors",
                  isCompleted || isCurrent ? "text-purple-400" : "text-zinc-600"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ─── Form Card ─── */}
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-xl overflow-hidden min-h-[420px] flex flex-col">
          <div className="p-6 sm:p-8 flex-1">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText size={18} className="text-purple-500" />
                    Basic Information
                  </h2>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-zinc-400">Property Title</label>
                    <AISuggest
                      field="title"
                      context={formData}
                      onAccept={(s) => setFormData({ ...formData, title: s })}
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 text-white placeholder-zinc-500 transition-all"
                    placeholder="e.g. Modern Apartment in City Center"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-zinc-400">Description</label>
                    <AISuggest
                      field="description"
                      context={formData}
                      onAccept={(s) => setFormData({ ...formData, description: s })}
                      label="✨ Write for me"
                    />
                  </div>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 text-white placeholder-zinc-500 resize-none transition-all"
                    placeholder="Describe your property — or let AI write it for you..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Monthly Rent ($)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="number"
                      className="w-full pl-9 pr-4 py-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 text-white placeholder-zinc-500 transition-all"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <MapPin size={18} className="text-purple-500" />
                    Location Details
                  </h2>
                  <AISuggest
                    field="location_tips"
                    context={formData}
                    onAccept={() => { }}
                    label="✨ Area Tips"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">City / Area</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 text-white placeholder-zinc-500 transition-all"
                      placeholder="e.g. Harare, Avondale"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Full Address (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:border-purple-500/50 text-white placeholder-zinc-500 transition-all"
                    placeholder="e.g. 123 Samora Machel Ave"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Amenities */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Tag size={18} className="text-purple-500" />
                    Features & Amenities
                  </h2>
                  <AISuggest
                    field="amenities"
                    context={formData}
                    onAccept={(s) => setFormData({ ...formData, amenities: s })}
                    label="✨ Suggest All"
                  />
                </div>

                {/* Quick Chip Selection */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-3">Quick Select</label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedAmenities.map((amenity) => {
                      const selected = formData.amenities.split(',').map(a => a.trim()).includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={clsx(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                            selected
                              ? "bg-purple-600/20 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-900/20"
                              : "bg-zinc-800/60 text-zinc-400 border-zinc-700/60 hover:bg-zinc-700/60 hover:text-zinc-300"
                          )}
                        >
                          {selected && <Check size={10} className="inline mr-1" />}
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Manual Input */}
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1.5">Custom Amenities</label>
                  <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/60">
                    <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider">Comma-separated</p>
                    <input
                      type="text"
                      className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-zinc-600 p-0 text-sm"
                      placeholder="Add more amenities..."
                      value={formData.amenities}
                      onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                    />
                  </div>
                </div>

                {/* Preview */}
                {formData.amenities && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-2">Preview</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.split(',').filter(Boolean).map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs border border-purple-500/20">
                          {amenity.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Photos */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Camera size={18} className="text-purple-500" />
                    Property Gallery
                  </h2>
                  <span className="text-[10px] font-medium text-zinc-500 bg-zinc-800/80 px-2 py-1 rounded-full">
                    {existingImages.length + images.length} photos
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Upload Area */}
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700/60 border-dashed rounded-2xl cursor-pointer hover:bg-zinc-800/30 hover:border-purple-500/40 bg-zinc-900/50 transition-all group relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col items-center justify-center z-10">
                      <div className="p-4 bg-zinc-800/80 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg border border-zinc-700/50">
                        <Camera className="w-8 h-8 text-purple-500" />
                      </div>
                      <p className="mb-1 text-sm text-zinc-300 font-medium">Click to upload</p>
                      <p className="text-xs text-zinc-500">JPG, PNG or WEBP</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
                  </label>

                  {/* Preview Grid */}
                  <div className="h-64 bg-zinc-900/50 rounded-2xl border border-zinc-800/60 overflow-y-auto p-3">
                    {(existingImages.length === 0 && images.length === 0) ? (
                      <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                        <ImageIcon size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No images selected</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        {existingImages.map((url, idx) => (
                          <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={url} alt="existing" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeExistingImage(url)}
                              className="absolute top-1.5 right-1.5 bg-black/70 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X size={10} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-0.5 font-medium">Saved</div>
                          </div>
                        ))}
                        {images.map((file, idx) => (
                          <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border border-purple-500/30">
                            <img src={URL.createObjectURL(file)} alt="new" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeImage(idx)}
                              className="absolute top-1.5 right-1.5 bg-black/70 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X size={10} />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-purple-900/80 text-white text-[9px] px-2 py-0.5 font-medium">New</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─── Footer Controls ─── */}
          <div className="p-5 sm:p-6 bg-zinc-900/80 border-t border-zinc-800/60 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                currentStep === 1
                  ? "text-zinc-700 cursor-not-allowed"
                  : "text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              )}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all shadow-lg shadow-purple-900/30 font-medium group"
              >
                Next <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/30 font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
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
