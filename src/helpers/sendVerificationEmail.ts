import { resend } from "@/lib/resend"; // Resend ka instance jo humne lib mein banaya tha
import VerificationEmail from "../../emails/verificationEmail"; // Upar wala UI template
import { ApiResponse } from "@/types/ApiResponse"; // Response ka structure define karne ke liye

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{ // Promise<ApiResponse> ka matlab hai ye function success/message wala object return karega
    try {
        // resend.emails.send: Yeh Resend ki official method hai email bhejne ke liye
        await resend.emails.send({
            from: 'onboarding@resend.dev', // Testing ke liye default domain, production mein apna domain aayega
            to: email, // User ka email address
            subject: 'GhostMSG | Verification Code',
            react: VerificationEmail({username, otp: verifyCode}), // React component ko email body ki tarah bhej rahe hain
        });

        return { success: true, message: "verification email send successfully" };
    } catch (emailError) {
        // Agar network ya API key mein issue hua toh yahan pakda jayega
        console.error("Error sending verification email", emailError);
        return { success: false, message: "failed to send verification email" }
    }
};