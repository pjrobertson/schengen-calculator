import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">About the Schengen Calculator</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          {/* What is the Schengen Calculator */}
          <section>
            <h2 className="text-lg font-semibold mb-2">What is the Schengen Calculator?</h2>
            <p className="text-gray-700 leading-relaxed">
              The Schengen Calculator is a free online tool designed to help travelers track their days spent in the Schengen Area and calculate how many days they have remaining under the 90/180-day rule. Whether you're planning a European vacation, working remotely across Europe, or making multiple visits, this Schengen visa day counter ensures you stay compliant with EU entry and exit requirements.
            </p>
          </section>

          {/* How to Calculate Schengen Visa Days */}
          <section>
            <h2 className="text-lg font-semibold mb-2">How to Calculate Schengen Visa Days</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              Calculating your remaining Schengen days can be complex because the 180-day period is a rolling window, not a fixed period. This Schengen day calculator automatically:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Tracks all your trips to the Schengen Area</li>
              <li>Calculates remaining days for any date using a rolling 180-day window</li>
              <li>Shows you exactly when you can re-enter if you've exceeded the limit</li>
              <li>Displays your trip history and total days spent in Schengen countries</li>
              <li>Auto saves your trips so you can return any time and continue where you left off</li>
            </ul>
          </section>

          {/* Who Needs to Track Schengen Days */}
          <section>
            <h2 className="text-lg font-semibold mb-2">Who Needs to Track Schengen Days?</h2>
            <p className="text-gray-700 leading-relaxed">
              This Schengen visa tracker is essential for anyone entering the Schengen Area under short-stay visa rules or visa-free travel. You need to track your Schengen days if you:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
              <li>Have a Schengen short-stay visa (Type C visa)</li>
              <li>Are from a visa-exempt country (like USA, Canada, UK, Australia, etc.)</li>
              <li>Make multiple trips to Europe throughout the year</li>
              <li>Work remotely while traveling in European countries</li>
              <li>Want to maximize your allowed time in the Schengen zone</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              Check the <a href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">European Commission Visa Policy page</a> to see if the 90/180 rule applies to you.
            </p>
          </section>

          {/* Understanding the 90/180 Day Rule */}
          <section>
            <h2 className="text-lg font-semibold mb-2">What is the Schengen 90/180 Day Rule?</h2>
            <p className="text-gray-700 leading-relaxed">
              The 90/180 rule means you can stay in the Schengen Area for up to <strong>90 days within any 180-day period</strong>. This is a rolling calculation, not a calendar period:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
              <li>The 180-day window continuously moves forward with each day</li>
              <li>Both entry and exit days count as days spent in the Schengen Area</li>
              <li>The rule applies to the entire Schengen zone, not individual countries</li>
              <li>Exceeding 90 days can result in fines, deportation, or future entry bans</li>
            </ul>
          </section>

          {/* What is the Schengen Area */}
          <section>
            <h2 className="text-lg font-semibold mb-2">What is the Schengen Area?</h2>
            <p className="text-gray-700 leading-relaxed mb-2">
              The Schengen Area is a zone of 29 European countries that have abolished passport and border controls at their mutual borders. This allows free movement between member states but requires tracking your total days across all Schengen countries.
            </p>
            <p className="text-gray-700 leading-relaxed mb-2">
              <strong>Current Schengen countries (29):</strong> Austria, Belgium, Bulgaria, Croatia, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden, and Switzerland.
            </p>
            <p className="text-gray-700 text-xs italic">
              Note: Ireland, Cyprus, and the United Kingdom are not part of the Schengen Area. Days spent in these countries do not count toward your 90/180 limit.
            </p>
          </section>

          {/* How to Use This Calculator */}
          <section>
            <h2 className="text-lg font-semibold mb-2">How to Use This Schengen Days Calculator</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-4">
              <li>Click "Add Trip" or select dates on the calendar to add your past and planned trips</li>
              <li>Enter your entry and exit dates for each visit to the Schengen Area</li>
              <li>View your remaining days on the calendar and in the status panel</li>
              <li>Check if you're compliant with the 90-day limit</li>
              <li>Plan future trips within your available days</li>
            </ol>
          </section>

          {/* About the Creator */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">About the Creator</h2>
            <p className="text-gray-700 leading-relaxed">
              This tool was created by{' '}
              <a
                href="https://patrick.is"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Paddy Robertson
              </a>
              {' '}to help travelers navigate the complexities of the Schengen 90/180 rule. I built this after experiencing the confusion of tracking my own trips across Europe, and I hope it makes your travel planning easier and stress-free.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Disclaimer</h2>
            <p className="text-gray-700 text-xs leading-relaxed">
              This Schengen calculator is provided for planning purposes only and does not constitute legal or immigration advice. While I strive for accuracy, this tool deals only with the standard 90/180-day rule. Individual circumstances may vary, and there may be exceptions or additional requirements based on your nationality, visa type, or specific situation. It is your responsibility to verify your eligibility, understand applicable immigration laws, and comply with all entry requirements. Always consult official sources or an immigration attorney for definitive guidance on your personal circumstances.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
