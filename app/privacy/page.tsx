
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information you provide directly to us, such as when you create an account, 
              use our text humanization service, or contact us for support.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Account information (name, email address, password)</li>
              <li>Text content you submit for humanization</li>
              <li>Usage data and analytics</li>
              <li>Payment information (processed securely by third parties)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our text humanization services</li>
              <li>Process your requests and transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Text Content Privacy</h2>
            <p className="mb-4">
              Your text content is important to us. We process your text solely to provide 
              the humanization service and do not store your original or humanized content 
              after processing is complete.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third 
              parties except as described in this policy. We may share information in these situations:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>With service providers who assist in our operations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your account information for as long as your account is active or as 
              needed to provide services. Text content is not stored after processing completion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and associated data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
            <p className="mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and assist in our marketing efforts. You can control cookie preferences through 
              your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="list-none">
              <li>Email: privacy@humniz.io</li>
              <li>Address: humniz Privacy Team</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
