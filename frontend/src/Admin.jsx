import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, ShieldCheck, FileCheck, Users, 
  User, MapPin, Calendar, Search, CreditCard, 
  ChevronDown, ChevronUp, BarChart2, Layers,
  Thermometer, Droplet, Leaf, Scale, PieChart, Filter,
  Shield, Calculator, Award, RefreshCw
} from 'lucide-react';

const Admin = ({ darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedLoan, setExpandedLoan] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [calculatingCredit, setCalculatingCredit] = useState({});
  const [revealedCreditScores, setRevealedCreditScores] = useState({});
  
  // Sample data for bank details and approved loans
  const bankDetails = {
    bankName: "Agricultural Development Bank",
    bankCredentials: "Central Bank Certified • License #AB-2023-78542",
    loansApproved: [
      {
        id: 1,
        amount: 250000,
        purpose: "Farm Equipment Purchase",
        approvedDate: "2023-10-15",
        farmer: {
          name: "Rajesh Patel",
          avatar: "/api/placeholder/150/150",
          year: 2025,
          country: "India",
          region: "Gujarat",
          landSize: 12.5,
          soilType: "Black Cotton Soil",
          pastYield: 1850,
          cropTypes: ["Wheat", "Cotton", "Chickpeas"],
          annualIncome: 580000,
          soilPH: 6.8,
          nitrogenLevel: "Medium (320 kg/ha)",
          organicMatterLevel: "High (3.2%)",
          landQualityScore: 8.4,
          pastRainfall: 850,
          avgTemperature: 28.5,
          creditScore: 72.20
        }
      },
      {
        id: 2,
        amount: 175000,
        purpose: "Crop Diversification",
        approvedDate: "2023-11-22",
        farmer: {
          name: "Meera Singh",
          avatar: "/api/placeholder/150/150",
          year: 2020,
          country: "India",
          region: "Punjab",
          landSize: 8.7,
          soilType: "Alluvial Soil",
          pastYield: 2100,
          cropTypes: ["Rice", "Potatoes", "Maize"],
          annualIncome: 620000,
          soilPH: 7.2,
          nitrogenLevel: "High (450 kg/ha)",
          organicMatterLevel: "Medium (2.1%)",
          landQualityScore: 8.8,
          pastRainfall: 920,
          avgTemperature: 25.2,
          creditScore: 63.53
        }
      },
      {
        id: 3,
        amount: 320000,
        purpose: "Irrigation System Upgrade",
        approvedDate: "2023-12-05",
        farmer: {
          name: "Arjun Reddy",
          avatar: "/api/placeholder/150/150",
          year: 2018,
          country: "India",
          region: "Telangana",
          landSize: 15.3,
          soilType: "Red Soil",
          pastYield: 1650,
          cropTypes: ["Rice", "Sugarcane", "Turmeric"],
          annualIncome: 720000,
          soilPH: 6.5,
          nitrogenLevel: "Low (210 kg/ha)",
          organicMatterLevel: "Medium (1.9%)",
          landQualityScore: 7.6,
          pastRainfall: 780,
          avgTemperature: 32.1,
          creditScore: 86.32
        }
      }
    ]
  };

  // Filter loans based on search query
  const filteredLoans = bankDetails.loansApproved.filter(loan => 
    loan.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loan.farmer.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle loan details view
  const toggleLoanDetails = (loanId) => {
    if (expandedLoan === loanId) {
      setExpandedLoan(null);
    } else {
      setExpandedLoan(loanId);
    }
  };

  // Function to simulate credit score calculation
  const calculateCreditScore = (loanId) => {
    setCalculatingCredit(prev => ({ ...prev, [loanId]: true }));
    
    // Simulate API call with timeout
    setTimeout(() => {
      const loan = bankDetails.loansApproved.find(l => l.id === loanId);
      setRevealedCreditScores(prev => ({ 
        ...prev, 
        [loanId]: loan.farmer.creditScore 
      }));
      setCalculatingCredit(prev => ({ ...prev, [loanId]: false }));
    }, 1500);
  };

  // Theme-based styling
  const bgClass = darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
  const headerClass = darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-gray-200';
  const accentTextClass = darkMode ? 'text-blue-400' : 'text-blue-600';
  const secondaryTextClass = darkMode ? 'text-slate-400' : 'text-gray-500';
  const highlightClass = darkMode ? 'bg-slate-700/50' : 'bg-gray-100';
  const tabActiveClass = darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white';
  const tabInactiveClass = darkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700/30' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';
  const buttonPrimaryClass = darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white';
  const buttonSecondaryClass = darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  const inputClass = darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const chartBarClass = darkMode ? 'from-blue-500 to-indigo-600' : 'from-blue-500 to-indigo-600';
  
  return (
    <div className={`min-h-screen ${bgClass} pt-16 pl-10`}>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Building className="mr-2" size={32} />
                Bank/NBFC Administration
              </h1>
              <p className={`mt-1 ${secondaryTextClass}`}>Manage loan approvals and farmer credit data</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search farmers or loans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border ${inputClass} w-full lg:w-64`}
                />
              </div>
              <button className={`px-4 py-2 rounded-lg ${buttonPrimaryClass} flex items-center gap-2`}>
                <Filter size={16} />
                <span>Filter</span>
              </button>
            </div>
          </motion.div>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`p-6 rounded-xl border shadow-sm flex-1 min-w-[300px] ${cardClass}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">{bankDetails.bankName}</h2>
                <p className={`${secondaryTextClass} mt-1 flex items-center`}>
                  <ShieldCheck size={16} className="mr-1" />
                  {bankDetails.bankCredentials}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 ${darkMode ? 'bg-green-900/30 text-green-400' : ''}`}>
                Active
              </span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`p-6 rounded-xl border shadow-sm flex-1 min-w-[220px] ${cardClass}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm uppercase font-semibold ${secondaryTextClass}`}>Total Loans</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-bold">{bankDetails.loansApproved.length}</span>
                  <span className={`ml-2 ${secondaryTextClass} text-sm`}>Approved</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                <FileCheck className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`p-6 rounded-xl border shadow-sm flex-1 min-w-[220px] ${cardClass}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm uppercase font-semibold ${secondaryTextClass}`}>Total Amount</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-bold">
                    ₹{bankDetails.loansApproved.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
                <CreditCard className={darkMode ? 'text-emerald-400' : 'text-emerald-600'} />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={`p-6 rounded-xl border shadow-sm flex-1 min-w-[220px] ${cardClass}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-sm uppercase font-semibold ${secondaryTextClass}`}>Farmers</h3>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-bold">{bankDetails.loansApproved.length}</span>
                  <span className={`ml-2 ${secondaryTextClass} text-sm`}>Active</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${darkMode ? 'bg-violet-900/30' : 'bg-violet-100'}`}>
                <Users className={darkMode ? 'text-violet-400' : 'text-violet-600'} />
              </div>
            </div>
          </motion.div>
        </div>

        <div className={`border rounded-xl shadow-sm overflow-hidden mb-8 ${cardClass}`}>
          <div className={`px-6 py-4 border-b ${headerClass}`}>
            <h2 className="text-xl font-semibold flex items-center">
              <FileCheck className="mr-2" size={20} />
              Approved Loans
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-slate-700">
            <AnimatePresence>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <React.Fragment key={loan.id}>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`p-6 transition duration-150 ${expandedLoan === loan.id ? highlightClass : ''}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full h-12 w-12 flex items-center justify-center ${
                            darkMode ? 'bg-gradient-to-br from-blue-700 to-blue-900' : 'bg-gradient-to-br from-blue-500 to-blue-700'
                          } text-white shadow-md`}>
                            <User size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{loan.farmer.name}</h3>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className={secondaryTextClass} />
                              <span className={secondaryTextClass}>{loan.farmer.region}, {loan.farmer.country}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <h4 className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Loan Amount</h4>
                            <p className="font-semibold">₹{loan.amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <h4 className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Purpose</h4>
                            <p className="font-semibold">{loan.purpose}</p>
                          </div>
                          <div>
                            <h4 className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Approved Date</h4>
                            <p className="font-semibold">{new Date(loan.approvedDate).toLocaleDateString('en-IN', { 
                              day: 'numeric', month: 'short', year: 'numeric' 
                            })}</p>
                          </div>
                          <div>
                            <h4 className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Credit Score</h4>
                            {revealedCreditScores[loan.id] ? (
                              <motion.p 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`font-semibold flex items-center ${
                                  revealedCreditScores[loan.id] > 70 ? 'text-green-600 dark:text-green-400' : 
                                  revealedCreditScores[loan.id] > 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                                  'text-red-600 dark:text-red-400'
                                }`}
                              >
                                <Award size={14} className="mr-1" />
                                {revealedCreditScores[loan.id]}
                              </motion.p>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => calculateCreditScore(loan.id)}
                                disabled={calculatingCredit[loan.id]}
                                className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                                  darkMode 
                                    ? 'bg-blue-900/40 text-blue-300 hover:bg-blue-800/60' 
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                              >
                                {calculatingCredit[loan.id] ? (
                                  <>
                                    <RefreshCw size={12} className="animate-spin" />
                                    <span>Calculating...</span>
                                  </>
                                ) : (
                                  <>
                                    <Calculator size={12} />
                                    <span>Generate Score</span>
                                  </>
                                )}
                              </motion.button>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => toggleLoanDetails(loan.id)}
                          className={`px-4 py-2 rounded-lg ml-auto ${buttonSecondaryClass} flex items-center gap-1`}
                        >
                          {expandedLoan === loan.id ? (
                            <>
                              <ChevronUp size={16} />
                              <span>Hide Details</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              <span>View Details</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <AnimatePresence>
                        {expandedLoan === loan.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 overflow-hidden"
                          >
                            <div className={`p-6 rounded-xl ${highlightClass} grid grid-cols-1 md:grid-cols-2 gap-8`}>
                              <motion.div 
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                  <User size={16} className="mr-2" />
                                  Farmer Details
                                </h3>
                                <div className="space-y-3">
                                  {/* Improved farmer details with better layout and styling */}
                                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/50' : 'bg-white'} shadow-sm border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Calendar size={14} className={`${accentTextClass}`} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Established</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.year}</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Layers size={14} className={`${accentTextClass}`} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Land Size</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.landSize} acres</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <BarChart2 size={14} className={`${accentTextClass}`} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Annual Income</span>
                                        </div>
                                        <p className="font-medium mt-1">₹{loan.farmer.annualIncome.toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <PieChart size={14} className={`${accentTextClass}`} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Past Yield</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.pastYield} kg/acre</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Leaf size={14} className={`${accentTextClass}`} />
                                      <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Crops</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {loan.farmer.cropTypes.map((crop, index) => (
                                        <span 
                                          key={index} 
                                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                                            darkMode 
                                              ? 'bg-gradient-to-br from-green-900/40 to-green-800/40 text-green-300 border border-green-800/50' 
                                              : 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 border border-green-200'
                                          }`}
                                        >
                                          {crop}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {/* Credit score card (only appears when revealed) */}
                                  {revealedCreditScores[loan.id] && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`p-4 rounded-lg ${
                                        revealedCreditScores[loan.id] > 70
                                          ? (darkMode ? 'bg-green-900/20 border-green-800/30' : 'bg-green-50 border-green-200')
                                          : revealedCreditScores[loan.id] > 60
                                            ? (darkMode ? 'bg-yellow-900/20 border-yellow-800/30' : 'bg-yellow-50 border-yellow-200')
                                            : (darkMode ? 'bg-red-900/20 border-red-800/30' : 'bg-red-50 border-red-200')
                                      } border shadow-sm`}
                                    >
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          <Shield size={18} className={
                                            revealedCreditScores[loan.id] > 70
                                              ? 'text-green-500'
                                              : revealedCreditScores[loan.id] > 60
                                                ? 'text-yellow-500'
                                                : 'text-red-500'
                                          } />
                                          <span className="font-medium">Credit Score</span>
                                        </div>
                                        <div className={`text-xl font-bold ${
                                          revealedCreditScores[loan.id] > 70
                                            ? 'text-green-600 dark:text-green-400'
                                            : revealedCreditScores[loan.id] > 60
                                              ? 'text-yellow-600 dark:text-yellow-400'
                                              : 'text-red-600 dark:text-red-400'
                                        }`}>
                                          {revealedCreditScores[loan.id]}
                                        </div>
                                      </div>
                                      <div className="mt-2">
                                        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                          <div 
                                            className={`h-full rounded-full ${
                                              revealedCreditScores[loan.id] > 70 
                                                ? 'bg-green-500'
                                                : revealedCreditScores[loan.id] > 60
                                                  ? 'bg-yellow-500'
                                                  : 'bg-red-500'
                                            }`}
                                            style={{width: `${revealedCreditScores[loan.id]}%`}}
                                          ></div>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-xs flex justify-between">
                                        <span className={secondaryTextClass}>Poor</span>
                                        <span className={secondaryTextClass}>Fair</span>
                                        <span className={secondaryTextClass}>Good</span>
                                        <span className={secondaryTextClass}>Excellent</span>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.div>
                              
                              <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                  <Leaf size={16} className="mr-2" />
                                  Land & Soil Analysis
                                </h3>
                                <div className="space-y-4">
                                  <div>
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="flex items-center gap-1">
                                        <Scale size={14} className={accentTextClass} />
                                        <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Land Quality Score</span>
                                      </span>
                                      <span className="font-semibold">{loan.farmer.landQualityScore}/10</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full bg-gradient-to-r ${chartBarClass}`}
                                        style={{width: `${loan.farmer.landQualityScore * 10}%`}}
                                      ></div>
                                    </div>
                                  </div>
                                  
                                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800/50' : 'bg-white'} shadow-sm border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Leaf size={14} className={accentTextClass} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Soil Type</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.soilType}</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Leaf size={14} className={accentTextClass} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Soil pH</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.soilPH}</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Droplet size={14} className={accentTextClass} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Past Rainfall</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.pastRainfall} mm/year</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Thermometer size={14} className={accentTextClass} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Avg. Temperature</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.avgTemperature}°C</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Leaf size={14} className={accentTextClass} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Nitrogen Level</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.nitrogenLevel}</p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <Leaf size={14} className={accentTextClass} />
                                          <span className={`text-xs uppercase font-medium ${secondaryTextClass}`}>Organic Matter</span>
                                        </div>
                                        <p className="font-medium mt-1">{loan.farmer.organicMatterLevel}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                            
                            <div className="flex justify-end mt-4 gap-2">
                              <button className={`px-4 py-2 rounded-lg ${buttonSecondaryClass}`}>
                                View Full Report
                              </button>
                              <button className={`px-4 py-2 rounded-lg ${buttonPrimaryClass}`}>
                                Download PDF
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </React.Fragment>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <p className={secondaryTextClass}>No loans matching your search criteria.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;