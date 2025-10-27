import React, { useState, useCallback } from 'react';
import type { Testimony, User, DreamFormData, AdminContact, Prophet, InsightFormData, ProphecyRequest, MarriageCompatibilityFormData } from './types';
import { interpretDream, generateInsight, checkMarriageCompatibility } from './services/geminiService';
import { useLocalStorage } from './hooks';
import { INITIAL_TESTIMONIES, INITIAL_PROPHETS } from './data/mockData';
import { ADMIN_PASSWORD as INITIAL_ADMIN_PASSWORD } from './constants';

import { LoadingSpinner } from './components/LoadingSpinner';
import { PasswordModal } from './components/PasswordModal';
import { AdminPanel } from './components/AdminPanel';
import { ConfirmationModal } from './components/ConfirmationModal';
import { TestimonyModal } from './components/TestimonyModal';
import { TestimonyArchive } from './components/TestimonyArchive';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { DreamInterpretationForm } from './components/DreamInterpretationForm';
import { ProphetCard } from './components/ProphetCard';
import { InsightForm } from './components/InsightForm';
import { ProphetPortal } from './components/ProphetPortal';
import { ServiceSelection } from './components/ServiceSelection';
import { DreamResult } from './components/DreamResult';
import { AuthModal } from './components/AuthModal';
import { MarriageCompatibilityForm } from './components/MarriageCompatibilityForm';
import { MarriageCompatibilityResult } from './components/MarriageCompatibilityResult';


type Screen = 'HOME' | 'ADMIN_LOGIN' | 'ADMIN_PANEL' | 'TESTIMONY_ARCHIVE' | 'DREAM_FORM' | 'INSIGHT_FORM' | 'INSIGHT_CONFIRMATION' | 'PROPHET_PORTAL' | 'SERVICE_SELECTION' | 'DREAM_RESULT' | 'MARRIAGE_FORM' | 'MARRIAGE_RESULT';

const INITIAL_ADMIN_CONTACT: AdminContact = {
    whatsapp: '+1000000000',
    email: 'admin@insights.ai'
};

const App: React.FC = () => {
    const [screen, setScreen] = useState<Screen>('HOME');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    
    const [testimonies, setTestimonies] = useLocalStorage<Testimony[]>('testimonies', INITIAL_TESTIMONIES);
    const [adminPassword, setAdminPassword] = useLocalStorage<string>('adminPassword', INITIAL_ADMIN_PASSWORD);
    const [adminContact, setAdminContact] = useLocalStorage<AdminContact>('adminContact', INITIAL_ADMIN_CONTACT);
    const [logoUrl, setLogoUrl] = useLocalStorage<string>('logoUrl', 'https://i.ibb.co/6n29x0x/logo.png');
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    
    const [prophets, setProphets] = useLocalStorage<Prophet[]>('prophets', INITIAL_PROPHETS);
    const [prophecyRequests, setProphecyRequests] = useLocalStorage<ProphecyRequest[]>('prophecyRequests', []);
    const [selectedProphet, setSelectedProphet] = useState<Prophet | null>(null);
    const [portalProphet, setPortalProphet] = useState<Prophet | null>(null); // For admin to view a prophet's portal
    const [dreamResult, setDreamResult] = useState('');
    const [marriageResult, setMarriageResult] = useState('');
    
    const [testimonyToDelete, setTestimonyToDelete] = useState<Testimony | null>(null);
    const [prophetToDelete, setProphetToDelete] = useState<Prophet | null>(null);

    const [adminLoginError, setAdminLoginError] = useState('');
    const [isTestimonyModalOpen, setIsTestimonyModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message: string) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleBackToHome = () => {
        setScreen('HOME');
        setError('');
        setSelectedProphet(null);
    };
    
    const handleBackToServiceSelection = () => {
        setScreen('SERVICE_SELECTION');
    };

    // --- Prophet and Insight Flow ---
    const handleProphetSelect = (prophet: Prophet) => {
        if (prophet.username === 'Admin') {
            setScreen('ADMIN_LOGIN');
            setAdminLoginError('');
        } else {
            setSelectedProphet(prophet);
            setScreen('SERVICE_SELECTION');
        }
    };
    
    const handleInsightSubmit = useCallback(async (formData: InsightFormData) => {
        if (!selectedProphet) {
            setError('No prophet selected.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const aiResponse = await generateInsight(formData, selectedProphet);
            const newRequest: ProphecyRequest = {
                id: `req-${Date.now()}`,
                timestamp: new Date().toISOString(),
                requestType: 'insight',
                formData: formData,
                chatHistory: [{ role: 'model', content: aiResponse, author: 'AI Assistant' }],
                prophetId: selectedProphet.id
            };
            setProphecyRequests(prev => [newRequest, ...prev]);
            setScreen('INSIGHT_CONFIRMATION');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setScreen('INSIGHT_FORM');
            showToast(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedProphet, setProphecyRequests]);
    
    const handleProphetResponse = (requestId: string, responseText: string) => {
        setProphecyRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                return {
                    ...req,
                    chatHistory: [...req.chatHistory, { role: 'model', content: responseText, author: 'prophet' }]
                };
            }
            return req;
        }));
        showToast("Counsel has been added to the consultation.");
    };


    // --- Dream Interpretation Flow ---
    const handleDreamSubmit = useCallback(async (formData: DreamFormData) => {
        if (!selectedProphet) {
            setError('No prophet selected.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const aiResponse = await interpretDream(formData, selectedProphet);
            setDreamResult(aiResponse);
            setScreen('DREAM_RESULT');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setScreen('DREAM_FORM');
            showToast(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedProphet]);

    // --- Marriage Compatibility Flow ---
    const handleMarriageSubmit = useCallback(async (formData: MarriageCompatibilityFormData) => {
        if (!selectedProphet) {
            setError('No prophet selected.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const aiResponse = await checkMarriageCompatibility(formData, selectedProphet);
            setMarriageResult(aiResponse);
            setScreen('MARRIAGE_RESULT');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setScreen('MARRIAGE_FORM');
            showToast(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedProphet]);


    // --- Admin Flow ---
    const handleAdminLogin = (password: string) => {
        if (password === adminPassword) {
            setScreen('ADMIN_PANEL');
            setAdminLoginError('');
        } else {
            setAdminLoginError('Incorrect password. Please try again.');
        }
    };
    
    // --- Testimony Flow ---
    const handleSubmitTestimony = (name: string, text: string) => {
        const newTestimony: Testimony = { name, text, date: new Date().toISOString() };
        setTestimonies(prev => [newTestimony, ...prev]);
        setIsTestimonyModalOpen(false);
        showToast("Thank you for sharing your testimony!");
    };
    
    const handleUpdateTestimony = (originalDate: string, updatedTestimony: Omit<Testimony, 'date'>) => {
        setTestimonies(prev => prev.map(t => t.date === originalDate ? { ...updatedTestimony, date: originalDate } : t));
        showToast("Testimony updated.");
    };

    // --- User Auth Flow ---
    const handleLogin = (fullName: string, whatsapp: string) => {
        const user: User = { fullName, whatsapp };
        setCurrentUser(user);
        setIsAuthModalOpen(false);
        showToast(`Welcome, ${fullName.split(' ')[0]}!`);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        showToast('You have been logged out.');
    };

    // --- Admin Panel Actions ---
    const handleUpdateAdminContact = (newContact: AdminContact) => {
        setAdminContact(newContact);
        showToast("Admin contact information updated.");
    };

    const handleUpdatePassword = (newPassword: string) => {
        if(newPassword) {
            setAdminPassword(newPassword);
            showToast("Admin password updated successfully!");
        } else {
            showToast("Password cannot be empty.");
        }
    };
    
    const handleAddProphet = (newProphetData: Omit<Prophet, 'id'>) => {
        const newProphet: Prophet = { ...newProphetData, id: `prophet-${Date.now()}` };
        setProphets(prev => [...prev, newProphet]);
        showToast("New prophet has been added.");
    };

    const handleUpdateProphet = (updatedProphet: Prophet) => {
        setProphets(prev => prev.map(p => p.id === updatedProphet.id ? updatedProphet : p));
        showToast(`${updatedProphet.username}'s profile has been updated.`);
    };

    const handleDeleteProphet = (prophetId: string) => {
        const prophet = prophets.find(p => p.id === prophetId);
        if (prophet) {
            setProphetToDelete(prophet);
        }
    };
    
    const confirmDeleteProphet = () => {
        if(prophetToDelete) {
            setProphets(prophets.filter(p => p.id !== prophetToDelete.id));
            setProphetToDelete(null);
            showToast("Prophet profile deleted.");
        }
    };

    const handleViewProphetPortal = (prophet: Prophet) => {
        setPortalProphet(prophet);
        setScreen('PROPHET_PORTAL');
    };

    
    const renderContent = () => {
        switch (screen) {
            case 'ADMIN_LOGIN':
                return <PasswordModal isOpen={true} onClose={() => setScreen('HOME')} onSubmit={handleAdminLogin} error={adminLoginError} />;
            
            case 'ADMIN_PANEL':
                return (
                    <AdminPanel
                        testimonies={testimonies}
                        onDeleteTestimony={(date) => {
                             const t = testimonies.find(t => t.date === date);
                            if (t) setTestimonyToDelete(t);
                        }}
                        onUpdateTestimony={handleUpdateTestimony}
                        onBack={handleBackToHome}
                        logoUrl={logoUrl}
                        onLogoUpload={setLogoUrl}
                        adminContact={adminContact}
                        onUpdateAdminContact={handleUpdateAdminContact}
                        onUpdatePassword={handleUpdatePassword}
                        prophets={prophets}
                        onAddProphet={handleAddProphet}
                        onUpdateProphet={handleUpdateProphet}
                        onDeleteProphet={handleDeleteProphet}
                        onViewProphetPortal={handleViewProphetPortal}
                    />
                );

            case 'PROPHET_PORTAL':
                if (!portalProphet) return null; // Should not happen
                return (
                    <ProphetPortal
                        prophet={portalProphet}
                        requests={prophecyRequests.filter(r => r.prophetId === portalProphet.id)}
                        onBack={() => setScreen('ADMIN_PANEL')}
                        onProphetResponse={handleProphetResponse}
                    />
                );

            case 'DREAM_FORM':
                 if (!selectedProphet) return null; // Should not happen
                return <DreamInterpretationForm 
                    onSubmit={handleDreamSubmit}
                    isLoading={isLoading}
                    onBack={handleBackToServiceSelection}
                    logoUrl={logoUrl}
                    currentUser={currentUser}
                    prophet={selectedProphet}
                />;
            
            case 'DREAM_RESULT':
                if (!selectedProphet) return null; // Should not happen
                return <DreamResult
                    interpretation={dreamResult}
                    prophet={selectedProphet}
                    onBack={handleBackToHome}
                    logoUrl={logoUrl}
                />;

            case 'SERVICE_SELECTION':
                if (!selectedProphet) return null; // Should not happen
                return <ServiceSelection
                    prophet={selectedProphet}
                    onSelectInsight={() => setScreen('INSIGHT_FORM')}
                    onSelectDream={() => setScreen('DREAM_FORM')}
                    onSelectMarriage={() => setScreen('MARRIAGE_FORM')}
                    onBack={handleBackToHome}
                    logoUrl={logoUrl}
                />;

            case 'INSIGHT_FORM':
                if (!selectedProphet) return null; // Should not happen
                return <InsightForm
                    prophet={selectedProphet}
                    onSubmit={handleInsightSubmit}
                    isLoading={isLoading}
                    onBack={handleBackToServiceSelection}
                    logoUrl={logoUrl}
                    currentUser={currentUser}
                />;
            
            case 'INSIGHT_CONFIRMATION':
                return (
                    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-gray-800/60 rounded-2xl shadow-2xl border border-yellow-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center animate-fade-in">
                        <h2 className="text-2xl font-bold text-yellow-300 mb-4">Request Sent</h2>
                        <p className="text-gray-200 text-lg mb-6">
                           Thank you. Your request for insight has been sent to {selectedProphet?.username}. You will be contacted via WhatsApp with your prophecy once it is ready.
                        </p>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <button onClick={handleBackToHome} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-2 px-8 rounded-lg transition-colors">Return Home</button>
                    </div>
                );

            case 'MARRIAGE_FORM':
                if (!selectedProphet) return null;
                return <MarriageCompatibilityForm
                    prophet={selectedProphet}
                    onSubmit={handleMarriageSubmit}
                    isLoading={isLoading}
                    onBack={handleBackToServiceSelection}
                    logoUrl={logoUrl}
                    currentUser={currentUser}
                />;
            
            case 'MARRIAGE_RESULT':
                if (!selectedProphet) return null;
                return <MarriageCompatibilityResult
                    result={marriageResult}
                    prophet={selectedProphet}
                    onBack={handleBackToHome}
                    logoUrl={logoUrl}
                />;
                
            case 'TESTIMONY_ARCHIVE':
                return <TestimonyArchive testimonies={testimonies} onBack={handleBackToHome} />;

            case 'HOME':
            default:
                return (
                    <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-fade-in p-4">
                        <div className="w-full flex justify-end mb-4 -mt-4">
                            {currentUser ? (
                                <div className="flex items-center gap-4 bg-gray-900/20 p-2 rounded-lg">
                                    <span className="text-gray-300">Welcome, {currentUser.fullName.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="text-sm bg-red-600/80 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-lg transition-colors">Logout</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsAuthModalOpen(true)} className="text-sm bg-indigo-600/80 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Login / Register</button>
                            )}
                        </div>
                        {logoUrl && <img src={logoUrl} alt="Ministry Logo" className="w-28 h-28 md:w-36 md:h-36 object-contain mb-4 rounded-full bg-gray-900/20 p-2"/>}
                        <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 text-center leading-tight">
                            Yahweh Prophecy Ministry
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto text-center">
                           Welcome. Select a prophet below to seek divine counsel or request an interpretation of your dreams.
                        </p>
                        
                        <div className="mt-16 w-full">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-center text-yellow-300 mb-6">Select a Prophet to Begin</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                                   {prophets.map(prophet => (
                                       <ProphetCard key={prophet.id} prophet={prophet} onSelect={handleProphetSelect} logoUrl={logoUrl} />
                                   ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-16 flex flex-wrap gap-4 justify-center">
                            <button onClick={() => setIsTestimonyModalOpen(true)} className="bg-green-600/80 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Share a Testimony</button>
                            <button onClick={() => setScreen('TESTIMONY_ARCHIVE')} className="bg-purple-600/80 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">Read Testimonies</button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center relative">
            {isLoading && <LoadingSpinner message={
                screen === 'DREAM_FORM' ? "Interpreting your dream..." : 
                screen === 'INSIGHT_FORM' ? "Receiving divine wisdom..." : 
                screen === 'MARRIAGE_FORM' ? "Seeking insight on this union..." : "Loading..."
            }/>}
            <div className="w-full h-full flex items-center justify-center">
                 {renderContent()}
            </div>
            {testimonyToDelete && (
                 <ConfirmationModal
                    isOpen={true}
                    title="Delete Testimony?"
                    message={`Are you sure you want to delete the testimony from "${testimonyToDelete.name}"? This cannot be undone.`}
                    onConfirm={() => {
                        setTestimonies(ts => ts.filter(t => t.date !== testimonyToDelete.date));
                        setTestimonyToDelete(null);
                        showToast("Testimony deleted.");
                    }}
                    onCancel={() => setTestimonyToDelete(null)}
                />
            )}
             {prophetToDelete && (
                 <ConfirmationModal
                    isOpen={true}
                    title="Delete Prophet?"
                    message={`Are you sure you want to delete the profile for "${prophetToDelete.username}"? This cannot be undone.`}
                    onConfirm={confirmDeleteProphet}
                    onCancel={() => setProphetToDelete(null)}
                />
            )}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSubmit={handleLogin} />
            <TestimonyModal isOpen={isTestimonyModalOpen} onClose={() => setIsTestimonyModalOpen(false)} onSubmit={handleSubmitTestimony} />
            <Toast message={toast.message} show={toast.show} />
             {(screen === 'HOME' || screen === 'TESTIMONY_ARCHIVE') && <Footer quote="For the Spirit of prophecy is the testimony of Jesus." adminWhatsApp={adminContact.whatsapp} />}
        </div>
    );
};

export default App;
