import { Metadata } from 'next';
import { Sparkles, Languages, FileText } from 'lucide-react';
import AiSummarizerSection from '@/components/AiSummarizerSection';

export const metadata: Metadata = {
    title: 'ShortsSync | YouTube AI Video Summarizer & Transcript Extractor',
    description: 'Turn any YouTube video or Short into an AI-powered summary. Extract full transcripts in multiple languages instantly. Free, fast, and easy to use.',
    alternates: {
        canonical: 'https://ytshortsdl.net/ai-script-generator',
    }
};

export default function AiScriptGenerator() {
    return (
        <main>
            <AiSummarizerSection />
            <section className="py-16 sm:py-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-8 text-center ">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { step: "1", title: "Paste URL", desc: "Copy any YouTube video or Shorts link." },
                                { step: "2", title: "AI Analysis", desc: "Our system extracts and processes the transcript." },
                                { step: "3", title: "Get Summary", desc: "Download the text or read the key highlights." }
                            ].map((item, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">{item.step}</div>
                                    <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="bg-white mb-16">
                <div className="container mx-auto px-6">
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-slate-200/50">
                        <div className="grid md:grid-cols-2 gap-x-16 gap-y-10 items-center">
                            <div>
                                <h2 className="text-3xl font-bold font-poppins text-slate-900 mb-5">Why Use AI Video Summaries?</h2>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Save hours of watching time. Our AI analyzes transcripts to give you key takeaways
                                    and actionable insights from any YouTube video in seconds. Perfect for students,
                                    researchers, and busy creators.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                                <h3 className="font-display text-xl font-bold text-slate-800 mb-6">Capabilities:</h3>
                                <ul className="space-y-5 text-lg">
                                    <li className="flex items-start">
                                        <Sparkles className="text-red-500 mt-1.5 mr-3" size={20} />
                                        <div><strong className="text-slate-800">Smart Summarization:</strong> Understand the core message without watching the whole clip.</div>
                                    </li>
                                    <li className="flex items-start">
                                        <Languages className="text-red-500 mt-1.5 mr-3" size={20} />
                                        <div><strong className="text-slate-800">Multi-Language:</strong> Fetch transcripts in any language provided by the creator or auto-generated.</div>
                                    </li>
                                    <li className="flex items-start">
                                        <FileText className="text-red-500 mt-1.5 mr-3" size={20} />
                                        <div><strong className="text-slate-800">Timestamped Data:</strong> Navigate easily with precise time-codes for every sentence.</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
    )
}