import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"
import React from "react"

export default function FAQsPage() {
  return (
    <div className="container flex flex-col gap-8 items-center sm:p-24">
      <h3 className="text-3xl text-blue-500 font-light">FAQs</h3>
      <div className="max-w-[800px] w-full">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is MyAI.bio?</AccordionTrigger>
            <AccordionContent>
              MyAI.bio is a link-in-bio tool that allows users to create a
              personalized AI chatbot that interacts with visitors. The AI
              chatbot mimics the user&apos;s personality and responses based on
              the data and preferences they provide.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How does MyAI.bio use my data?</AccordionTrigger>
            <AccordionContent>
              We store your data, including AI interactions and profile details,
              in Pinecone, a secure vector database. Your data is used to
              enhance and personalize your chatbot interactions and improve the
              service.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Is MyAI.bio GDPR compliant?</AccordionTrigger>
            <AccordionContent>
              Yes, we comply with the GDPR. You have rights to access or delete
              your personal data. You can also request the limitation or
              portability of your data. For more details, please see our{" "}
              <Link
                className="text-blue-500"
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy.
              </Link>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Can I change my chatbot personality?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you can customize your chatbot personality through the
              settings. You can choose from several pre-defined personalities
              such as &quot;Bubbly&quot;, &quot;Professional&quot;,
              &quot;Quirky&quot; and more.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              Is there a free version of MyAI.bio?
            </AccordionTrigger>
            <AccordionContent>
              Yes, MyAI.bio offers a free version with basic features. For
              additional functionalities, such as advanced AI customization and
              more in-depth analytics, you can upgrade to our premium plan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>How can I delete my account?</AccordionTrigger>
            <AccordionContent>
              If you wish to delete your account, please do so on the Settings
              Page.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>
              What happens if I violate the Terms of Service?
            </AccordionTrigger>
            <AccordionContent>
              We reserve the right to suspend or terminate accounts that violate
              our Terms of Service. This includes sharing inappropriate content
              or misusing the platform. Please review our Terms and Conditions
              for more information. We reserve the right to refuse refunds.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger>
              Can I integrate MyAI.bio with my social media accounts?
            </AccordionTrigger>
            <AccordionContent>
              Yes, MyAI.bio allows you to link and display your social media
              accounts, making it easier for visitors to interact with you
              across platforms. You can manage these links in your profile
              settings.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger>
              Does MyAI.bio offer customer support?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we offer customer support through our email at
              alexmelia41@gmail.com. If you have any issues, questions, or
              feedback, feel free to reach out to us.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
