
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using humniz, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these terms, you should 
              not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              humniz is an AI-powered text humanization service that transforms AI-generated 
              content into natural, human-like writing. Our service includes web-based tools, 
              API access, and related features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use certain features of our service, you must create an account. You are 
              responsible for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="mb-4">You agree not to use the service to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Generate harmful, offensive, or inappropriate content</li>
              <li>Attempt to reverse engineer or compromise our systems</li>
              <li>Use the service for academic dishonesty or plagiarism</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>
            <p className="mb-4">
              You retain ownership of the content you submit to our service. By using our service, 
              you grant us a limited license to process your content solely for the purpose of 
              providing the humanization service.
            </p>
            <p className="mb-4">
              Our service, including all software, algorithms, and related intellectual property, 
              remains our exclusive property.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
            <p className="mb-4">
              Paid subscriptions are billed in advance on a monthly basis. You may cancel your 
              subscription at any time. Refunds are provided according to our refund policy.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Subscription fees are non-refundable except as required by law</li>
              <li>We reserve the right to change pricing with 30 days notice</li>
              <li>Credits do not roll over between billing periods</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
            <p className="mb-4">
              We strive to maintain high service availability but do not guarantee uninterrupted 
              access. We may temporarily suspend service for maintenance, updates, or other 
              operational reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, humniz shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
            <p className="mb-4">
              The service is provided "as is" and "as available" without warranties of any kind, 
              either express or implied. We do not warrant that the service will be error-free, 
              secure, or continuously available.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account and access to the service immediately, 
              without prior notice, for any breach of these terms or for any other reason at 
              our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these terms at any time. We will provide notice of 
              material changes via email or through the service. Continued use of the service 
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-4">
              These terms shall be governed by and construed in accordance with the laws of 
              [Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none">
              <li>Email: legal@humniz.io</li>
              <li>Address: humniz Legal Team</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
