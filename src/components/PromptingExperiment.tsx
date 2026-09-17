import React, { useState } from 'react';
import { EmailFormData, ComparisonResult } from '../types.js';
import { comparePrompts } from '../services/apiService.js';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  FileText,
  Layers,
} from 'lucide-react';

interface PromptingExperimentProps {
  formData: EmailFormData;
}

export const PromptingExperiment: React.FC<PromptingExperimentProps> = ({ formData }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunComparison = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await comparePrompts(formData);
      setComparison(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error running prompting experiment.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5" />
            Empirical Prompting Research
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Baseline vs. Few-Shot Prompting Experiment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Few-shot prompting provides the AI model with exemplars demonstrating precise tone,
            paragraph layout, salutations, and strict factual boundaries. Test how the model performs on your current input using both approaches.
          </p>
        </div>

        {/* Input Summary bar */}
        <div className="mt-4 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">Active Test Input:</span>
            <span>{formData.purpose}</span>
            <span className="text-slate-300">•</span>
            <span>To: {formData.recipient || 'Not specified'}</span>
            <span className="text-slate-300">•</span>
            <span>Tone: {formData.tone}</span>
          </div>

          <button
            type="button"
            id="run-experiment-btn"
            disabled={isRunning}
            onClick={handleRunComparison}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer ${
              isRunning ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Running Baseline &amp; Few-Shot Prompts...
              </>
            ) : (
              <>
                <Sliders className="w-3.5 h-3.5" />
                Run Prompting Experiment
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Comparison results */}
      {comparison && (
        <div className="space-y-6">
          {/* Side by side outputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Baseline Output */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Mode A: Baseline Output
                    </h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 font-medium">
                    Zero-Shot (Rules only)
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Subject Line
                  </span>
                  <div className="text-xs font-semibold text-slate-800 bg-slate-50 p-2 rounded-md border border-slate-200/70">
                    {comparison.baseline.subject}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Email Body
                  </span>
                  <div className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200/70 min-h-[160px]">
                    {comparison.baseline.body}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Tone: {comparison.baseline.tone_check}</span>
                <span>Grammar: {comparison.baseline.grammar_check}</span>
              </div>
            </div>

            {/* Few-Shot Output */}
            <div className="bg-white rounded-xl border-2 border-purple-200 shadow-xs p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                Recommended Approach
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                      Mode B: Few-Shot Output
                    </h3>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-sm bg-purple-50 text-purple-700 font-semibold border border-purple-200 mr-24">
                    3 Grounded Examples
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Subject Line
                  </span>
                  <div className="text-xs font-semibold text-purple-950 bg-purple-50/50 p-2 rounded-md border border-purple-100">
                    {comparison.fewShot.subject}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Email Body
                  </span>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed bg-purple-50/30 p-3 rounded-md border border-purple-100 min-h-[160px]">
                    {comparison.fewShot.body}
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Tone: {comparison.fewShot.tone_check}</span>
                <span>Grammar: {comparison.fewShot.grammar_check}</span>
              </div>
            </div>
          </div>

          {/* Simple Structured Evaluation Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Empirical Comparison Analysis
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Evaluation Metric</th>
                    <th className="py-2.5 px-3">Baseline (Zero-Shot)</th>
                    <th className="py-2.5 px-3">Few-Shot Prompting</th>
                    <th className="py-2.5 px-3">Scientific Observation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Structure Consistency</td>
                    <td className="py-3 px-3 text-slate-600">
                      {comparison.metrics.structureConsistency.baseline}
                    </td>
                    <td className="py-3 px-3 font-semibold text-purple-700">
                      {comparison.metrics.structureConsistency.fewShot}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {comparison.metrics.structureConsistency.observation}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Tone Consistency</td>
                    <td className="py-3 px-3 text-slate-600">
                      {comparison.metrics.toneConsistency.baseline}
                    </td>
                    <td className="py-3 px-3 font-semibold text-purple-700">
                      {comparison.metrics.toneConsistency.fewShot}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {comparison.metrics.toneConsistency.observation}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Completeness</td>
                    <td className="py-3 px-3 text-slate-600">
                      {comparison.metrics.completeness.baseline}
                    </td>
                    <td className="py-3 px-3 font-semibold text-purple-700">
                      {comparison.metrics.completeness.fewShot}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {comparison.metrics.completeness.observation}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900">Unsupported Claims</td>
                    <td className="py-3 px-3 text-slate-600">
                      {comparison.metrics.unsupportedClaims.baseline}
                    </td>
                    <td className="py-3 px-3 font-semibold text-purple-700">
                      {comparison.metrics.unsupportedClaims.fewShot}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {comparison.metrics.unsupportedClaims.observation}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Qualitative Observation */}
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 block mb-1">
                  Overall Synthesis &amp; Findings
                </span>
                <p className="text-xs sm:text-sm text-purple-950 font-medium leading-relaxed">
                  &quot;{comparison.metrics.overallObservations}&quot;
                </p>
                <p className="text-xs text-purple-800/80 mt-1">
                  Few-shot reference exemplars prime the model to conform strictly to formal corporate writing norms, reducing ambiguity and preventing the generation of generic placeholders.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
