import React from "react"

export default function PrivacyPolicyPage() {
  return (
    <div className="container flex flex-col gap-12 items-center p-24">
      <h3 className="text-3xl text-blue-500 font-light">Privacy Policy</h3>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">Privacy Policy for MyAI.bio</h3>
          <p>Last Updated: 29th September 2024</p>
          <p>
            This Privacy Policy outlines how MyAI.bio (&quot;we&quot;,
            &quot;us&quot;, or &quot;our&quot;) collects, uses, and protects
            your personal data when you use our service. By accessing or using
            MyAI.bio, you agree to the collection and use of information in
            accordance with this policy.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">1. Information We Collect</h3>

          <div className="flex flex-col">
            <p className="my-4">
              We collect several types of information to provide and improve our
              service.
            </p>
            <p className="font-semibold my-4">1.1 Personal Information</p>
            <p className="my-4">
              When you sign up for MyAI.bio, we may collect personal
              information, such as:
            </p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Username</li>
              <li>Profile details, including images</li>
              <li>Interests or preferences</li>
            </ul>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold my-4">1.2 Chatbot Interactions</p>
            <p className="my-4">
              The primary function of MyAI.bio is to enable the creation of an
              AI chatbot that interacts on behalf of the user. These
              interactions are stored and used to personalize user experiences.
              The AI-generated conversations and chatbot inputs are also
              considered part of your personal data.
            </p>
          </div>

          <div className="flex flex-col">
            <p className="font-semibold my-4">1.3 Usage Data</p>
            <p className="my-4">
              We may collect information about how you access and use the
              service, including:
            </p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device and operating system</li>
              <li>Time and date of visit</li>
              <li>Pages viewed and actions taken</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            2. How We Use Your Information
          </h3>
          <div className="flex flex-col">
            <p className="my-4">
              We use the data we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>To provide and maintain the Service.</li>
              <li>
                To personalize your experience, including AI chatbot
                interactions.
              </li>
              <li>To improve our Service through user behavior analysis.</li>
              <li>To manage user accounts and customer support.</li>
              <li>
                To communicate updates, offers, or other information relevant to
                the Service.
              </li>
              <li>
                To comply with legal obligations or respond to lawful requests.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">3. How Your Data Is Stored</h3>
          <p>
            Your personal data, including chatbot conversations, is stored in
            Pinecone, a secure vector database. By using our service, you agree
            to the storage and processing of your data in Pinecone. We take
            reasonable precautions to safeguard your data, but no method of
            transmission or storage is completely secure.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            4. Data Sharing and Third-Party Services
          </h3>
          <p className="my-4">
            We may share your data with third-party service providers that help
            us operate and manage MyAI.bio, such as payment processors, hosting
            services, and analytics providers. These third-party services will
            only have access to data necessary to perform their functions and
            are contractually obligated to protect your information.
          </p>
          <p className="my-4">
            We do not sell or rent your personal information to third parties
            for marketing purposes.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">5. GDPR Compliance</h3>
          <p>
            If you are located in the European Economic Area (EEA), MyAI.bio is
            committed to complying with the General Data Protection Regulation
            (GDPR). Under GDPR, you have the following rights:
          </p>
          <ul className="list-disc list-inside my-2 space-y-2">
            <li>
              Right to Access: You can request a copy of your personal data held
              by us.
            </li>
            <li>
              Right to Rectification: You can request corrections to your data
              if it is inaccurate or incomplete.
            </li>
            <li>
              Right to Erasure: You can request the deletion of your personal
              data under certain conditions.
            </li>
            <li>
              Right to Restriction of Processing: You can request that we limit
              how we use your personal data.
            </li>
            <li>
              Right to Data Portability: You can request that we transfer your
              data to another organization.
            </li>
            <li>
              Right to Object: You can object to the processing of your personal
              data in certain circumstances.
            </li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">6. Cookies</h3>
          <p>
            We use cookies and similar tracking technologies to enhance your
            experience on MyAI.bio. Cookies are small text files that are stored
            on your device when you visit the website. You can control or delete
            cookies through your browser settings, but this may affect your use
            of certain features on the platform.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            7. Account Suspension and Termination
          </h3>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate our Terms and Conditions or this Privacy Policy. Upon
            termination, your personal data may be deleted, subject to legal
            retention requirements.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">8. Data Security</h3>
          <p>
            We take reasonable measures to protect your data from unauthorized
            access, alteration, or destruction. However, no method of data
            transmission or storage is entirely secure. By using our service,
            you acknowledge the risks associated with data transmission over the
            internet.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            9. Changes to this Privacy Policy
          </h3>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page, and the &quot;Last Updated&quot; date
            will be modified. You are advised to review this policy periodically
            to stay informed about how we protect your information.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">10. Contact Us</h3>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            wish to exercise your rights under GDPR, please contact us at:
          </p>
          <ul className="list-disc list-inside my-2 space-y-2">
            <li>Email: alexmelia41@gmail.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
