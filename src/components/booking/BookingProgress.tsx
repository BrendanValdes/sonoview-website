const STEPS = [
  { num: 1, label: "Your Details" },
  { num: 2, label: "Payment" },
  { num: 3, label: "Schedule" },
];

const BookingProgress = ({ currentStep }: { currentStep: number }) => (
  <div className="mb-8 sm:mb-14 w-full flex justify-center">
    <div className="grid grid-cols-3 items-start w-full max-w-xs sm:max-w-md">
      {STEPS.map((s, i) => (
        <div key={s.num} className="relative flex flex-col items-center gap-1.5">
          <div
            className={`relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-colors font-body ${
              currentStep >= s.num
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            {currentStep > s.num ? "✓" : s.num}
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-body whitespace-nowrap">
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={`absolute top-4 sm:top-5 left-[calc(50%+1rem)] sm:left-[calc(50%+1.25rem)] right-[calc(-50%+1rem)] sm:right-[calc(-50%+1.25rem)] h-0.5 rounded-full transition-colors ${
                currentStep > s.num ? "bg-primary" : "bg-secondary"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

export default BookingProgress;
