export default function TermsConditionPage() {
  const termsConditions = [
    {
      title: "Acceptance of Terms",
      description:
        "By accessing or using the CVKU platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our services.",
    },
    {
      title: "Modifications",
      description:
        "CVKU reserves the right to modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on the platform. Your continued use of the platform after any modifications constitutes your acceptance of the revised terms.",
    },
    {
      title: "Services Offered",
      description:
        "CVKU provides a Software as a Service (SaaS) platform that allows users to create and share digital portfolios. Users can customize their portfolios using templates and include personal information such as experience, education, and projects.",
    },
    {
      title: "Subscription and Payments",
      description:
        "CVKU operates on a manual payment-based subscription model. Users may subscribe to access premium features, which may include but are not limited to: ",
      sublist: [
        "Template customization options",
        "Access to exclusive features",
        "Enhanced portfolio customization options",
      ],
      subdescription: [
        "Payments are due at the time of subscription. All subscription fees are stated in Rupiah and are exclusive of applicable taxes.",
      ],
    },
    {
      title: "User Accounts",
      description:
        "To create a portfolio, users must create an account on the CVKU platform. You agree to provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.",
    },
    {
      title: "User Responsibilites",
      description:
        "You agree to use the services in compliance with all applicable laws and regulations. You may not engage in any activity that disrupts or interferes with the CVKU services or the servers and networks connected to the platform.",
    },
    {
      title: "Intellectual Property Rights",
      description:
        "All content, features, and functionality of the CVKU platform, including but not limited to text, graphics, logos, and software, are the exclusive property of CVKU or its licensors and are protected by copyright, trademark, and other intellectual property laws.",
    },
    {
      title: "Limitation of Liability",
      description:
        "CVKU will not be liable for any indirect, incidental, special, or consequential damages arising from or related to the use of or inability to use the platform, even if CVKU has been advised of the possibility of such damages.",
    },
    {
      title: "Termination",
      description:
        "CVKU reserves the right to terminate or suspend your account and access to the platform if you violate these Terms and Conditions or engage in any conduct that CVKU deems inappropriate or harmful.",
    },
    {
      title: "Governing Law",
      description:
        "These Terms and Conditions shall be governed by and construed in accordance with the laws of Indonesia. Any disputes arising under these Terms shall be resolved in accordance with the laws of Indonesia.",
    },
    {
      title: "Contact Information",
      description:
        "For inquiries related to these Terms and Conditions, please contact us at dimasgustiwork@gmail.com.",
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center py-32">
      <div className="grid grid-cols-1 w-full md:max-w-4xl px-4 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Terms and Conditions for CVKU
          </h2>
          <p className="text-lg md:text-xl">
            Last Updated: Monday 3 February, 2024
          </p>
        </div>
        <div>
          {termsConditions.map((term, index) => (
            <div key={index} className="pb-8 md:pb-16">
              <h2 className="text-xl md:text-2xl font-semibold">
                {index + 1}. {term.title}
              </h2>
              <p className="text-lg md:text-xl">{term.description}</p>
              {term.sublist && (
                <ul className="list-disc pl-6">
                  {term.sublist.map((item, subIndex) => (
                    <li key={subIndex} className="text-lg md:text-xl">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {term.subdescription && (
                <p className="text-lg md:text-xl">{term.subdescription}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
