import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is StudyPilot really free?",
    answer: "Yes! You get 7 days free with full access to all features. After that, you can continue with our free tier or upgrade to Pro for advanced features like unlimited AI plans and priority support.",
  },
  {
    question: "How does the AI study plan work?",
    answer: "Simply enter your course name, exam date, weekly study hours, and preferred study style. Our AI analyzes your schedule and creates a personalized day-by-day plan optimized for retention and balanced workload.",
  },
  {
    question: "Can I sync with Google Calendar?",
    answer: "Absolutely! Export your study plan as an .ics file and import it directly into Google Calendar, Apple Calendar, or Outlook. We're also working on direct calendar integration.",
  },
  {
    question: "Is my data private?",
    answer: "100%. Your data is encrypted at rest and in transit. We're GDPR and FERPA compliant, and we never sell your data to third parties. Your study habits are your business.",
  },
  {
    question: "What devices can I use?",
    answer: "StudyPilot works on any device with a modern web browser — laptops, tablets, and smartphones. Your data syncs automatically across all your devices.",
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel anytime from your account settings. No questions asked, no hidden fees. You'll keep access until the end of your billing period.",
  },
];

export function FAQSection() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-display text-3xl font-bold md:text-4xl mb-3">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Everything you need to know about StudyPilot.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass rounded-xl px-5 border-none"
              >
                <AccordionTrigger className="text-left text-sm md:text-base font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
