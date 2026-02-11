import {
  Html, Head, Font, Preview, Heading, Row, Section, Text, Button,
} from '@react-email/components';

// Interface: TypeScript ko bata rahe hain ki component ko kya data chahiye
interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    // Html: Email ka main container, lang aur direction set kar rahe hain
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        {/* Font: Google Font 'Roboto' load kar rahe hain taaki email professional lage */}
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {/* Preview: Yeh text user ko inbox mein email kholne se pehle dikhta hai */}
      <Preview>Here&apos;s your verification code: {otp}</Preview>
      
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. Please use the following verification
            code to complete your registration:
          </Text>
        </Row>
        <Row>
          {/* OTP display area: Yahan user apna 6-digit code dekhega */}
          <Text style={{ fontWeight: 'bold', fontSize: '24px' }}>{otp}</Text> 
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
    </Html>
  );
}