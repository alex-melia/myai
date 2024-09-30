import Link from "next/link"
import React from "react"

export default function TCSPage() {
  return (
    <div className="container flex flex-col gap-12 items-center p-24">
      <h3 className="text-3xl text-blue-500 font-light">Terms & Conditions</h3>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">1. Introduction</h3>
          <p>
            MyAI.bio is a link-in-bio tool that features an AI chatbot acting as
            the user. This chatbot engages with visitors based on the
            information provided by the user. By using the Service, you agree to
            these Terms and Conditions and all applicable laws and regulations.
            Data submitted through the platform, including user interactions, is
            stored in Pinecone, a vector database service.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">2. User Responsibilities</h3>

          <div className="flex flex-col">
            <p>
              You, as the user, are responsible for ensuring that the data you
              submit, including AI-generated content, is accurate, legal, and
              complies with all applicable laws.
            </p>
            <p className="my-4">You agree not to:</p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>
                Upload, share, or generate illegal, defamatory, obscene, or
                inappropriate content.
              </li>
              <li>
                Engage in harmful or disruptive behavior that interferes with
                the platform or other users&quot; experiences.
              </li>
              <li>Misrepresent yourself or impersonate other individuals.</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            3. Data Storage and Security
          </h3>

          <div className="flex flex-col">
            <p>
              MyAI.bio stores user data, including personal information and
              chatbot interactions, in Pinecone, a secure vector database that
              uses cloud infrastructure. By using our service, you agree to the
              storage of your data in Pinecone.
            </p>
            <p className="my-4">
              Your data may include, but is not limited to, the following:
            </p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>Chatbot-generated responses and interactions.</li>
              <li>Personal preferences, interests, and user input.</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">4. GDPR Compliance</h3>

          <div className="flex flex-col">
            <p>
              If you are located in the European Economic Area (EEA), you have
              specific rights under the General Data Protection Regulation
              (GDPR) regarding the personal data stored in Pinecone:
            </p>
            <p className="my-4">User Rights Under GDPR:</p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>
                Right of Access: You may request a copy of the personal data we
                store.
              </li>
              <li>
                Right to Rectification: You may request corrections to your
                personal data if inaccurate.
              </li>
              <li>
                Right to Erasure: You can request deletion of your personal
                data, except where data retention is required by law.
              </li>
              <li>
                Right to Data Portability: You can request that your personal
                data be provided in a machine-readable format.
              </li>
              <li>
                Right to Restrict Processing: You may request restrictions on
                how your data is processed.
              </li>
              <li>
                Right to Rectification: You may request corrections to your
                personal data if inaccurate.
              </li>
              <li>
                Right to Object: You may object to how your personal data is
                processed
              </li>
            </ul>
            <p className="my-4">
              To exercise any of your GDPR rights, please contact us at
              alexmelia41@gmail.com
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            5. Account Suspension and Termination
          </h3>

          <div className="flex flex-col">
            <p className="my-4">
              MyAI.bio reserves the right to suspend or terminate any user
              account at any time if:
            </p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>You violate these Terms and Conditions.</li>
              <li>
                Your account is used in a manner that violates laws, including
                data protection regulations.
              </li>
              <li>
                You upload or generate harmful or disruptive content that
                interferes with other users or damages the platform..
              </li>
            </ul>
            <p className="my-4">
              In cases of account suspension or termination, access to your
              stored data and interactions may be restricted or permanently
              removed.
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            6. User Data and Pinecone Database
          </h3>

          <div className="flex flex-col space-y-4">
            <p>
              All chatbot interactions, personal data, and content submitted
              through the platform are stored in the Pinecone vector database.
              Pinecone stores data in a scalable and secure cloud
              infrastructure.
            </p>
            <p>
              By using MyAI.bio, you agree to the storage and retrieval of your
              data in Pinecone for the purposes of providing the Service,
              improving chatbot interactions, and personalizing your experience.
              You can request to access or delete your data at any time by
              contacting our support team.
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">7. Intellectual Property</h3>

          <div className="flex flex-col space-y-4">
            <p>
              All content on the platform, including but not limited to text,
              graphics, logos, and software, is the property of MyAI.bio or its
              licensors and is protected by copyright and trademark laws.
            </p>
            <p>
              Users retain ownership of the content they upload, including
              chatbot responses and interactions. By uploading content, you
              grant MyAI.bio a non-exclusive, worldwide, royalty-free license to
              display, distribute, and promote this content within the platform.
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">8. Privacy Policy</h3>

          <p>
            We take your privacy seriously. Our{" "}
            <Link className="text-blue-500" href="/privacy-policy">
              Privacy Policy
            </Link>{" "}
            outlines how we collect, use, and protect your personal data,
            including how data is stored in Pinecone. By using the Service, you
            agree to the practices outlined in our{" "}
            <Link className="text-blue-500" href="/privacy-policy">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">9. Limitations of Liability</h3>

          <div className="flex flex-col">
            <p className="my-4">
              MyAI.bio is provided &quot;as is&quot;, without any warranties,
              express or implied. We do not guarantee that the platform will be
              error-free, uninterrupted, or secure. We are not liable for:
            </p>
            <ul className="list-disc list-inside my-2 space-y-2">
              <li>
                Any damages resulting from the use or inability to use the
                Service.
              </li>
              <li>
                Content generated by the chatbot, or any interactions that
                occur.
              </li>
              <li>
                Data loss, breaches, or unauthorized access to Pinecone-stored
                data.
              </li>
            </ul>
            <p className="my-4">
              Our maximum liability, under any circumstances, will not exceed
              the amount you have paid for the Service.
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">
            10. Changes to Terms and Conditions
          </h3>

          <p>
            We reserve the right to update these Terms and Conditions at any
            time. Changes will be posted on this page with the updated
            &quot;Last Updated&quot; date. Continued use of the Service after
            changes constitutes your acceptance of the revised terms.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">11. Governing Law</h3>

          <p>
            These Terms and Conditions are governed by and construed in
            accordance with the laws of the United Kingdom. Any disputes arising
            from these Terms shall be resolved in the courts of the United
            Kingdom.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <h3 className="text-xl font-semibold">12. Contact Information</h3>

          <p>
            If you have any questions or concerns about these Terms and
            Conditions, please contact us at alexmelia41@gmail.com.
          </p>
        </div>
      </div>
    </div>
  )
}
