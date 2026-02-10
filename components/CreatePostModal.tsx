import React, { useState, useRef } from 'react';
import { Button } from './Button';
import { X, Image as ImageIcon, Sparkles, Globe, Lock } from 'lucide-react';
import { generateCaption } from '../services/geminiService';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (image: string, caption: string, isPublic: boolean) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onPost }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCaption = async () => {
    if (!selectedImage) return;
    setIsGenerating(true);
    try {
      const aiCaption = await generateCaption(selectedImage);
      setCaption(aiCaption);
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onPost(selectedImage, caption, isPublic);
      // Reset
      setSelectedImage(null);
      setCaption('');
      setIsPublic(true);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-[600px]">
        
        {/* Header - Mobile Only */}
        <div className="md:hidden flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">New Post</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 relative">
          {!selectedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center cursor-pointer p-8 text-center hover:scale-105 transition-transform duration-200"
            >
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <ImageIcon size={40} />
              </div>
              <p className="font-bold text-lg mb-2">Drag photos here</p>
              <Button size="sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                Select from computer
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          ) : (
            <div className="relative w-full h-full bg-black flex items-center justify-center">
               <img src={selectedImage} alt="Preview" className="max-w-full max-h-full object-contain" />
               <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 left-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 backdrop-blur-sm"
                >
                  <X size={20} />
                </button>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 flex flex-col bg-white">
           <div className="hidden md:flex justify-between items-center p-4 border-b">
             <h3 className="font-bold text-lg">New Post</h3>
             <button onClick={onClose} className="hover:text-red-500"><X size={24} /></button>
           </div>

           <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-2">
                    <img src="https://picsum.photos/50" className="w-8 h-8 rounded-full bg-gray-200" alt="Avatar" />
                    <span className="font-semibold text-sm text-gray-500">Writing caption...</span>
                 </div>
                 <button 
                   onClick={handleGenerateCaption}
                   disabled={isGenerating || !selectedImage}
                   className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-2 py-1 rounded-full"
                 >
                   <Sparkles size={12} className="mr-1" />
                   {isGenerating ? 'Magic...' : 'AI Caption'}
                 </button>
              </div>

              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full h-32 resize-none text-sm outline-none placeholder-gray-400 mb-4"
              />
              
              <div className="border-t border-gray-100 pt-4 mt-auto space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Audience</span>
                    <span className="text-xs text-gray-500">{isPublic ? 'Everyone can see this on Rupl' : 'Only followers can see this'}</span>
                  </div>
                  <button 
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${isPublic ? 'bg-black' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out flex items-center justify-center ${isPublic ? 'translate-x-6' : 'translate-x-0'}`}>
                       {isPublic ? <Globe size={10} className="text-black" /> : <Lock size={10} className="text-gray-400" />}
                    </div>
                  </button>
                </div>
                
                <Button 
                   onClick={handleSubmit} 
                   className="w-full py-3" 
                   disabled={!selectedImage}
                >
                  Share
                </Button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};