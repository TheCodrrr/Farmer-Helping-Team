import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Navigate,useNavigate } from "react-router-dom";
import { Link } from "lucide-react";


export default function Signup({ darkMode }) {
    const navigate = useNavigate();
    // State for form fields
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNo, setPhoneNumber] = useState("");
    const [year, setYear] = useState("");
    const [country, setCountry] = useState("");
    const [region, setRegion] = useState("");
    const [landSize, setLandSize] = useState("");
    const [soilType, setSoilType] = useState("");
    const [pastYield, setPastYield] = useState("");
    const [cropTypes, setCropTypes] = useState("");
    const [annualIncome, setAnnualIncome] = useState("");
    
    // Add user type state with default value "Farmer"
    const [userType, setUserType] = useState("Farmer");
    
    // Add states for bank-specific fields
    const [bankName, setBankName] = useState("");
    const [bankCredentials, setBankCredentials] = useState("");
    const [loansApproved, setLoansApproved] = useState("");
    
    // Step navigation
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    
    // Error handling
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    // Dark mode classes
    const bgClass = darkMode 
        ? "bg-gray-900 text-white"
        : "bg-white text-gray-800";
        
    const cardBgClass = darkMode 
        ? "bg-gray-800 shadow-xl" 
        : "bg-white shadow-xl";
        
    const labelClass = darkMode 
        ? "text-gray-300" 
        : "text-gray-700";
        
    const inputBgClass = darkMode 
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-green-500 focus:border-green-500" 
        : "bg-white border-gray-300 text-gray-900 focus:ring-green-500 focus:border-green-500";
        
    const iconClass = darkMode 
        ? "text-gray-400" 
        : "text-gray-500";
        
    const headerBgClass = darkMode 
        ? "bg-green-700" 
        : "bg-green-600";
        
    const buttonSecondaryClass = darkMode 
        ? "border-gray-600 text-gray-300 hover:bg-gray-700" 
        : "border-gray-300 text-gray-700 hover:bg-gray-50";
        
    const progressBgClass = darkMode 
        ? "bg-gray-700" 
        : "bg-gray-200";
        
    const stepInactiveClass = darkMode 
        ? "bg-gray-700 text-gray-400" 
        : "bg-gray-200 text-gray-600";
    
    const headingClass = darkMode
        ? "text-white"
        : "text-gray-800";
    
    const nextStep = () => {
        if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    };
    
    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSignup = async () => {
        if (userType === "Farmer" && password !== confirmPassword) {
            setErrors({...errors, password: "Passwords do not match"});
            return;
        }
        
        setIsLoading(true);
        
        let userData = {};
        
        if (userType === "Farmer") {
            userData = {
                name: username,
                password,
                email,
                phoneNo,
                year,
                country,
                region,
                landSize: parseFloat(landSize),
                soilType,
                pastYield: parseFloat(pastYield),
                cropTypes,
                annualIncome: parseInt(annualIncome),
                roles: ["ROLE_USER"], // Default role for new users
                userType: userType,
            };
        } else {
            // Bank/NBFCs user data - only the 3 specific fields
            userData = {
                
                bankName,
                bankCredentials,
                roles: ["ROLE_USER"]
            };
        }
        
        try {
            const response = await axios.post(userType === 'farmer' ? "http://localhost:8080/public/sign-up" : "http://localhost:8080/public/bsign-up", userData);
            alert("Account created successfully!");
            // console.log("hello world: " + JSON.stringify(response.data));
            navigate('/login');
        } catch (err) {
            setErrors({...errors, submit: "Signup failed. Please try again."});
        } finally {
            setIsLoading(false);
        }
    };

    const renderFormStep = () => {
        // Only show farmer form steps if userType is "Farmer"
        if (userType === "Farmer") {
            switch(currentStep) {
                case 1:
                    return (
                        <div className="space-y-4">
                            <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Basic Information</h2>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Username</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-user"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Choose a username"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Email</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-envelope"></i>
                                    </span>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Your email address"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Phone Number</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-phone"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={phoneNo}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Your phone number"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Password</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-lock"></i>
                                    </span>
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Create a strong password"
                                    />
                                </div>
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Confirm Password</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-lock"></i>
                                    </span>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                    
                case 2:
                    return (
                        <div className="space-y-4">
                            <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Farm Location</h2>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Country</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-globe"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Country"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Region</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-map-marker-alt"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Region/State/Province"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Year Established</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-calendar"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Year farm was established"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                    
                case 3:
                    return (
                        <div className="space-y-4">
                            <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Farm Details</h2>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Land Size (acres)</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-ruler-combined"></i>
                                    </span>
                                    <input 
                                        type="number" 
                                        step="0.1"
                                        value={landSize}
                                        onChange={(e) => setLandSize(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="Land size in acres"
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Soil Type</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-mountain"></i>
                                    </span>
                                    <select 
                                        value={soilType}
                                        onChange={(e) => setSoilType(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                    >
                                        <option value="">Select soil type</option>
                                        <option value="clay">Clay</option>
                                        <option value="sandy">Sandy</option>
                                        <option value="loam">Loam</option>
                                        <option value="silt">Silt</option>
                                        <option value="peaty">Peaty</option>
                                        <option value="chalky">Chalky</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Crop Types</label>
                                <div className="flex items-center">
                                    <span className={`absolute left-3 ${iconClass}`}>
                                        <i className="fas fa-seedling"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={cropTypes}
                                        onChange={(e) => setCropTypes(e.target.value)}
                                        className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                        placeholder="e.g. Corn, Wheat, Rice"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Past Yield (tons/acre)</label>
                                    <div className="flex items-center">
                                        <span className={`absolute left-3 ${iconClass}`}>
                                            <i className="fas fa-chart-line"></i>
                                        </span>
                                        <input 
                                            type="number" 
                                            step="0.1"
                                            value={pastYield}
                                            onChange={(e) => setPastYield(e.target.value)}
                                            className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                            placeholder="Average past yield"
                                        />
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Annual Income</label>
                                    <div className="flex items-center">
                                        <span className={`absolute left-3 ${iconClass}`}>
                                            <i className="fas fa-indian-rupee-sign"></i>
                                        </span>
                                        <input 
                                            type="number" 
                                            value={annualIncome}
                                            onChange={(e) => setAnnualIncome(e.target.value)}
                                            className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                            placeholder="Annual farm income"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                                </p>
                                {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
                            </div>
                        </div>
                    );
                    
                default:
                    return null;
            }
        } else {
            // For Bank/NBFCs, show only their specific fields
            return (
                <div className="space-y-6">
                    <h2 className={`text-2xl font-bold mb-6 ${headingClass}`}>Bank/NBFCs Information</h2>
                    
                    {/* Bank specific fields - only these 3 fields */}
                    <div className="relative">
                        <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Bank Name</label>
                        <div className="flex items-center">
                            <span className={`absolute left-3 ${iconClass}`}>
                                <i className="fas fa-university"></i>
                            </span>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                placeholder="Enter bank name"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Bank Credentials</label>
                        <div className="flex items-center">
                            <span className={`absolute left-3 ${iconClass}`}>
                                <i className="fas fa-id-card"></i>
                            </span>
                            <input
                                type="password"
                                value={bankCredentials}
                                onChange={(e) => setBankCredentials(e.target.value)}
                                className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                placeholder="Enter bank credentials"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label className={`text-sm font-medium mb-1 block ${labelClass}`}>Loans Approved</label>
                        <div className="flex items-center">
                            <span className={`absolute left-3 ${iconClass}`}>
                                <i className="fas fa-file-invoice-dollar"></i>
                            </span>
                            <input
                                type="number"
                                value={loansApproved}
                                onChange={(e) => setLoansApproved([e.target.value])}
                                className={`pl-10 pr-3 py-2 w-full border rounded-lg ${inputBgClass}`}
                                placeholder="Number of loans approved"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                        </p>
                        {errors.submit && <p className="text-red-500 text-sm mb-4">{errors.submit}</p>}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-green-50 to-green-100"} py-12 px-4 sm:px-6 lg:px-8`}>
            <div className={`max-w-md w-full rounded-xl overflow-hidden ${cardBgClass}`}>
                <div className={`${headerBgClass} py-4 px-6 ${userType === "Farmer" ? "" : "accent-blue-600"}`}>
                    <h1 className="text-2xl font-bold text-white text-center">
                        {userType === "Farmer" ? "Create Farmer Account" : "Create Bank/NBFC Account"}
                    </h1>
                </div>
                
                <div className="p-6">
                    {/* User Type Selection */}
                    <div className="mb-6">
                        <label className={`block ${labelClass} font-medium mb-2`}>You are a:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="Farmer"
                                    checked={userType === "Farmer"}
                                    onChange={() => setUserType("Farmer")}
                                    className="mr-2 accent-green-600"
                                />
                                <span className="text-black">Farmer</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="userType"
                                    value="Bank/NBFCs"
                                    checked={userType === "Bank"}
                                    onChange={() => setUserType("Bank")}
                                    className="mr-2 accent-blue-600"
                                />
                                <span className="text-black">Bank/NBFCs</span>
                            </label>
                        </div>
                    </div>

                    {/* Progress bar - only show for Farmer */}
                    {userType === "Farmer" && (
                        <div className="mb-8">
                            <div className="flex justify-between mb-1">
                                {[1, 2, 3].map(step => (
                                    <button 
                                        key={step}
                                        onClick={() => setCurrentStep(step)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300
                                            ${currentStep >= step ? 'bg-green-600 text-white' : stepInactiveClass}`}
                                    >
                                        {step}
                                    </button>
                                ))}
                            </div>
                            <div className={`h-2 ${progressBgClass} rounded-full`}>
                                <div 
                                    className="h-full bg-green-600 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                    
                    {/* Form content */}
                    <motion.div
                        key={userType === "Farmer" ? currentStep : "bank"}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderFormStep()}
                    </motion.div>
                    
                    {/* Navigation buttons - for Farmer */}
                    {userType === "Farmer" ? (
                        <div className="mt-8 flex justify-between">
                            <button
                                onClick={prevStep}
                                className={`px-4 py-2 rounded-lg border transition-colors
                                    ${buttonSecondaryClass}
                                    ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={currentStep === 1}
                            >
                                Previous
                            </button>
                            
                            {currentStep < totalSteps ? (
                                <button
                                    onClick={nextStep}
                                    className={`px-4 py-2 ${darkMode ? 'bg-green-700' : 'bg-green-600'} text-white rounded-lg shadow hover:${darkMode ? 'bg-green-800' : 'bg-green-700'} transition-colors cursor-pointer`}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    onClick={handleSignup}
                                    className={`px-4 py-2 ${darkMode ? 'bg-green-700' : 'bg-green-600'} text-white rounded-lg shadow hover:${darkMode ? 'bg-green-800' : 'bg-green-700'} transition-colors flex items-center`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : "Create Account"}
                                </button>
                            )}
                        </div>
                    ) : (
                        // Button for Bank/NBFCs
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleSignup}
                                className={`px-6 py-2 ${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-lg shadow hover:${darkMode ? 'bg-blue-800' : 'bg-blue-700'} transition-colors flex items-center`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : "Create Bank Account"}
                            </button>
                        </div>
                    )}
                    
                    {/* Login navigation button */}
                    <div className="mt-6 text-center">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                            Already have an account?
                        </p>
                        <motion.button
                            onClick={() => navigate('/login')}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2 rounded-lg border cursor-pointer ${
                                darkMode 
                                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                            } transition-colors w-full`}
                        >
                            Go to Login
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}