import React from 'react'
import { FaCheck } from 'react-icons/fa'

const WizardStepper = ({
  steps = [],
  currentStep = 0,
  onStepChange,
  className = '',
}) => {
  const progressPercent = Math.min(
    100,
    Math.max(0, ((currentStep + 0.5) / steps.length) * 100)
  )

  return (
    <div
      className={[
        'wizard-stepper relative overflow-hidden rounded-[24px] bg-white p-4 sm:p-5 border border-[#f0eae1] shadow-[0_6px_22px_rgba(180,160,140,0.06)] backdrop-blur-md transition-all duration-300',
        className,
      ].join(' ').trim()}
    >
      {/* Animated Background Progress Track */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#f1f5f9]">
        <div
          className="h-full bg-gradient-to-r from-[#dc2626] via-[#16a34a] to-[#2563eb] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="wizard-stepper__track grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative z-10">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isComplete = index < currentStep

          return (
            <button
              key={step.id || `step-${index}`}
              type="button"
              onClick={() => onStepChange && onStepChange(index)}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'wizard-stepper__step group relative flex items-center min-w-0 w-full gap-3.5 rounded-[18px] p-3 text-left transition-all duration-300 ease-out',
                isActive
                  ? 'wizard-stepper__step--active bg-gradient-to-r from-[#f0fdf4] to-[#f8fafc] border border-[#bbf7d0] shadow-sm scale-[1.01]'
                  : isComplete
                    ? 'wizard-stepper__step--complete bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                    : 'bg-[#fafafa] border border-[#f1f5f9] hover:bg-white hover:border-[#e2e8f0]',
              ].join(' ')}
            >
              {/* Step Index Badge / Checkmark Icon */}
              <span
                className={[
                  'wizard-stepper__index flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold leading-none transition-all duration-300 shadow-sm',
                  isComplete
                    ? 'bg-[#16a34a] text-white ring-4 ring-[#dcfce7] scale-100'
                    : isActive
                      ? 'bg-[#16a34a] text-white ring-4 ring-[#bbf7d0] animate-pulse scale-105'
                      : 'bg-white text-[#64748b] border border-[#e2e8f0] group-hover:border-[#cbd5e1]',
                ].join(' ')}
              >
                {isComplete ? (
                  <FaCheck className="text-[12px] animate-bounce-short" />
                ) : (
                  index + 1
                )}
              </span>

              {/* Step Content Labels */}
              <span className="wizard-stepper__content flex min-w-0 flex-col leading-snug">
                <span className="wizard-stepper__kicker block text-[10px] font-bold uppercase tracking-[0.16em] text-[#64748b]">
                  Step {index + 1}
                </span>
                <span
                  className={[
                    'wizard-stepper__label mt-0.5 block break-words text-[14px] font-extrabold leading-tight transition-colors duration-200',
                    isActive
                      ? 'text-[#15803d]'
                      : isComplete
                        ? 'text-[#0f172a]'
                        : 'text-[#475569]',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </span>

              {/* Active Step Indicator Pill */}
              {isActive ? (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#16a34a] shadow-[0_0_8px_#16a34a]" />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default WizardStepper
