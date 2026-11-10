"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { usePipelineStore } from "@/store/pipeline";
import SiteHeader from "@/components/ui/SiteHeader";
import Stepper from "@/components/stepper/Stepper";
import Step1Upload from "@/components/steps/Step1Upload";
import Step2Configure from "@/components/steps/Step2Configure";
import Step3Chat from "@/components/steps/Step3Chat";

export default function PipelinePage() {
  const { currentStep, setStep } = usePipelineStore();

  return (
    <div className="flex flex-col min-h-dvh wash">
      <SiteHeader
        maxWidth="max-w-5xl"
        actions={
          <Link href="/pipelines" className="btn btn-ghost btn-sm max-sm:!px-0 max-sm:w-[38px]" aria-label="My pipelines">
            <LayoutGrid size={16} />
            <span className="hidden sm:inline">My pipelines</span>
          </Link>
        }
      />

      <div className="px-5 sm:px-8 pt-8 pb-6">
        <Stepper currentStep={currentStep} onStepClick={(s) => s < currentStep && setStep(s)} />
      </div>

      <main className="flex-1 px-5 sm:px-8 pb-12">
        <div key={currentStep} className="rise">
          {currentStep === 1 && <Step1Upload />}
          {currentStep === 2 && <Step2Configure />}
          {currentStep === 3 && <Step3Chat />}
        </div>
      </main>
    </div>
  );
}
