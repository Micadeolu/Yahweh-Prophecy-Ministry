import React, { useState, useEffect } from 'react';
import type { Prophet, InsightFormData, User } from '../types';
import { MONTHS } from '../constants';
interface InsightFormProps {
  prophet: Prophet;
  onSubmit: (formData: InsightFormData) => void;
  isLoading: boolean;
  onBack: () => void;
  logoUrl?: string;
currentUser?: User | null;
}

const InputField: React.FC<{ label: string; children: React.ReactNode;
subLabel?: string }> = ({ label, children, subLabel }) => (
    <div>
        <label className="block text-sm font-medium text-yellow-300 mb-1">{label}</label>
        {subLabel && <p className="text-xs text-gray-400 mb-1">{subLabel}</p>}
        {children}
    </div>
);
export const InsightForm: React.FC<InsightFormProps> = ({ prophet, onSubmit, isLoading, onBack, logoUrl, currentUser }) => {
  const [formData, setFormData] = useState<Omit<InsightFormData, 'language'>>({
    relationship: '',
    dobDay: '',
    dobMonth: 'October',
    dobYear: '',
    location: '',
    request: '',
    fullName: currentUser?.fullName || '',
    whatsapp: currentUser?.whatsapp || '',
  });
useEffect(() => {
    if (currentUser) {
        setFormData(prev => ({
            ...prev,
            fullName: currentUser.fullName,
            whatsapp: currentUser.whatsapp
        }));
    }
  }, [currentUser]);
const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
onSubmit(formData as InsightFormData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-gray-800/60 rounded-2xl shadow-2xl border border-yellow-500/30 backdrop-blur-md animate-fade-in">
      {logoUrl && (
        <img src={logoUrl} alt="Yahweh Prophecy Ministry Logo" className="mx-auto mb-4 w-20 h-20 object-contain" />
      )}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <img src={prophet.profilePicture} alt={prophet.username} className="w-16 h-16 rounded-full border-2 border-yellow-400 mr-4"/>
      
       <div>
                <h2 className="text-2xl font-bold text-yellow-400">Consult with {prophet.username}</h2>
                <p className="text-gray-300">Share your query with {prophet.title}</p>
            </div>
        </div>
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" 
viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name">
              
   <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g., Jane Doe" required readOnly={!!currentUser} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed"/>
            </InputField>
             <InputField label="Relationship to You">
                <input type="text" name="relationship" value={formData.relationship} onChange={handleChange} placeholder="e.g., my son, myself, my friend" required className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
          
   </InputField>
        </div>

        <div>
            <label className="block text-sm font-medium text-yellow-300 mb-1">Date of Birth</label>
            <div className="grid grid-cols-3 gap-3">
                <input type="number" name="dobDay" value={formData.dobDay} onChange={handleChange} placeholder="Day" required min="1" max="31" className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
             
    <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} required className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    {MONTHS.map(month => <option key={month} value={month}>{month}</option>)}
                </select>
                <input type="number" name="dobYear" value={formData.dobYear} onChange={handleChange} placeholder="Year" required min="1900" max={new Date().getFullYear()} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
      
       </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Location">
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ilahun Ijesa, Osun State, Nigeria" required className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"/>
            </InputField>
    
         <InputField label="WhatsApp Number (Optional)" subLabel="To receive the prophecy directly.">
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+1234567890" readOnly={!!currentUser} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-700/50 disabled:cursor-not-allowed"/>
            </InputField>
        </div>

        <InputField label="Your Request">
            <textarea name="request" value={formData.request} onChange={handleChange} placeholder="Describe the situation 
you seek insight on..." required rows={4} className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
        </InputField>

        <div className="mt-6 p-4 bg-gray-900/40 rounded-lg border border-gray-700">
            <h4 className="text-md font-semibold text-yellow-300 mb-2">Offer a Donation</h4>
            <p className="text-sm text-gray-400 mb-3">If you feel called to support {prophet.username}'s work, you may use the details below:</p>
            <ul className="space-y-1 text-gray-200 text-sm 
font-mono bg-gray-900/50 p-3 rounded-md">
                <li><span className="font-semibold text-gray-400">Bank:</span> {prophet.bankDetails.bankName}</li>
                <li><span className="font-semibold text-gray-400">Account:</span> {prophet.bankDetails.accountName}</li>
                <li><span className="font-semibold text-gray-400">Number:</span> {prophet.bankDetails.accountNumber}</li>
            </ul>
            {prophet.paymentLink && (
              
   <>
                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
                   
         <div className="flex-grow border-t border-gray-600"></div>
                    </div>
                    <a
                        href={prophet.paymentLink}
                        target="_blank"
    
                        rel="noopener noreferrer"
                        className="mt-1 block w-full text-center bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                   
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>
                        Donate via Secure Link
  
                   </a>
                </>
            )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          
className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center text-lg"
        >
          {isLoading ?
(
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 
7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Receiving divine wisdom...
            </>
          ) : 'Request Insight'}
        </button>
      </form>
    </div>
  );
};