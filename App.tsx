
import React, { useState } from 'react';
import { Search, Loader2, DollarSign, AlertCircle, BookOpen, ExternalLink } from 'lucide-react';
import { analyzeStockWithGemini } from './services/geminiService';
import { SearchState, StockAnalysis, ScenarioType } from './types';
import ScenarioCard from './components/ScenarioCard';
import StockChart from './components/StockChart';
import ValuationVerdict from './components/ValuationVerdict';
import DamodaranDeepDive from './components/DamodaranDeepDive';
import InvestmentThesis from './components/InvestmentThesis';

const App: React.FC = () => {
  const [ticker, setTicker] = useState('');
  const [searchState, setSearchState] = useState<SearchState>({
    loading: false,
    error: null,
    data: null,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setSearchState({ loading: true, error: null, data: null });
    
    try {
      const data = await analyzeStockWithGemini(ticker.toUpperCase());
      setSearchState({ loading: false, error: null, data });
    } catch (err: any) {
      setSearchState({ 
        loading: false, 
        error: err.message || "เกิดข้อผิดพลาดในการวิเคราะห์ข้อมูล", 
        data: null 
      });
    }
  };

  const getBaseCase = (data: StockAnalysis) => {
    return data.scenarios.find(s => s.type === ScenarioType.BASE) || data.scenarios[1];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-10 px-4 sm:px-6 lg:px-8 selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-2">
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            Damodaran Style Valuation
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            วิเคราะห์มูลค่าหุ้นสหรัฐฯ ด้วยวิธี DCF (Discounted Cash Flow) ผสานแนวคิด Narrative & Numbers ของ Aswath Damodaran
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            </div>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-2xl text-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xl"
              placeholder="ใส่ชื่อย่อหุ้น (เช่น AAPL, NVDA, GOOG)..."
              disabled={searchState.loading}
            />
            <button 
              type="submit"
              disabled={searchState.loading}
              className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {searchState.loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Analyzing... (กำลังวิเคราะห์)
                </>
              ) : (
                'วิเคราะห์'
              )}
            </button>
          </form>
          
          {!process.env.API_KEY && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Missing API Key in environment variables.</span>
            </div>
          )}
        </div>

        {/* Error State */}
        {searchState.error && (
          <div className="max-w-3xl mx-auto p-4 bg-red-900/20 border border-red-900/50 rounded-xl flex items-start gap-3 text-red-200 animate-in fade-in slide-in-from-bottom-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-400">เกิดข้อผิดพลาด (Error)</h3>
              <p className="text-slate-300">{searchState.error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {searchState.data && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Main Summary Card */}
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    {searchState.data.ticker} 
                    <span className="text-lg font-normal text-slate-400">{searchState.data.companyName}</span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                    <span>Market Price (ราคาตลาด): <span className="text-white font-mono">{searchState.data.currency} {searchState.data.currentPrice.toFixed(2)}</span></span>
                    <span className="hidden md:inline">•</span>
                    <span>Risk-Free (พันธบัตร 10Y): <span className="text-white font-mono">{searchState.data.riskFreeRate}%</span></span>
                    <span className="hidden md:inline">•</span>
                    <span>Beta (ความผันผวน): <span className="text-white font-mono">{searchState.data.beta}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">Last Updated (อัปเดตล่าสุด)</span>
                  <p className="text-slate-300">{searchState.data.lastUpdated}</p>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none mb-4">
                <p className="text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                  {searchState.data.analysisSummary}
                </p>
              </div>
            </div>

            {/* PART 1: DCF ANALYSIS */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 border-l-4 border-blue-500 pl-4 py-2 bg-gradient-to-r from-blue-900/10 to-transparent rounded-r-lg">
                <div>
                  <h2 className="text-2xl font-bold text-white">ส่วนที่ 1: การประเมินมูลค่า DCF (3 Scenarios)</h2>
                  <p className="text-slate-400 text-sm">วิเคราะห์มูลค่าหุ้นใน 3 กรณี (Worst, Base, Best) ตามสมมติฐานที่แตกต่างกัน เพื่อความแม่นยำในการลงทุน</p>
                </div>
              </div>

              {/* Valuation Verdict */}
              <ValuationVerdict 
                currentPrice={searchState.data.currentPrice} 
                baseScenario={getBaseCase(searchState.data)} 
                currency={searchState.data.currency}
              />

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {searchState.data.scenarios.map((scenario, index) => (
                  <ScenarioCard key={index} scenario={scenario} currency={searchState.data!.currency} />
                ))}
              </div>

              {/* Chart Section */}
              <StockChart data={searchState.data} />
            </section>

            {/* PART 2: DAMODARAN DEEP DIVE */}
            {searchState.data.deepDiveMetrics && (
              <section className="space-y-6">
                 <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-4 py-2 bg-gradient-to-r from-indigo-900/10 to-transparent rounded-r-lg mt-12">
                  <div>
                    <h2 className="text-2xl font-bold text-white">ส่วนที่ 2: วิเคราะห์เจาะลึกสไตล์ Damodaran</h2>
                    <p className="text-slate-400 text-sm">การเชื่อมโยง "เรื่องราว" (Story) เข้ากับ "ตัวเลข" (Numbers) และวิเคราะห์โครงสร้างมูลค่าเชิงลึก</p>
                  </div>
                </div>

                <DamodaranDeepDive 
                  metrics={searchState.data.deepDiveMetrics} 
                  baseWacc={getBaseCase(searchState.data).assumptions.wacc}
                  riskFreeRate={searchState.data.riskFreeRate}
                  beta={searchState.data.beta}
                />
              </section>
            )}

            {/* PART 3: INVESTMENT THESIS */}
            {searchState.data.investmentThesis && (
              <section className="space-y-6">
                 <div className="flex items-center gap-4 border-l-4 border-purple-500 pl-4 py-2 bg-gradient-to-r from-purple-900/10 to-transparent rounded-r-lg mt-12">
                  <div>
                    <h2 className="text-2xl font-bold text-white">ส่วนที่ 3: Investment Thesis</h2>
                    <p className="text-slate-400 text-sm">บทสรุปการลงทุนฉบับสมบูรณ์ (Decision, Valuation Suite, & Narrative)</p>
                  </div>
                </div>

                <InvestmentThesis 
                  thesis={searchState.data.investmentThesis} 
                  currency={searchState.data.currency}
                />
              </section>
            )}

            {/* Sources Section */}
            {searchState.data.sources && searchState.data.sources.length > 0 && (
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4" /> Sources (แหล่งข้อมูลอ้างอิง)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchState.data.sources.map((source, idx) => (
                    <a 
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-blue-400 hover:text-blue-300 hover:border-blue-700 transition-colors"
                    >
                      {source.title}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
