import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    // Har request se pehle DB se connect hona zaroori hai (Next.js serverless hai isliye)
    await dbConnect();

    try {
        // Frontend se bheja gaya data (Body) extract kar rahe hain
        const { username, email, password } = await request.json();

        // 1. Check karo: Kya is username se koi ALREADY VERIFIED user hai?
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "username already taken"
            }, { status: 400 });
        }

        // 2. Check karo: Kya is email se koi user pehle se register hai?
        const existingUserByEmail = await UserModel.findOne({ email });

        // OTP (Verification Code) generate karo (6-digit random number)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            // Agar email mil gaya...
            if (existingUserByEmail.isVerified) {
                // Scenario A: User already verified hai toh dubara register nahi karne denge
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, { status: 400 })
            } else {
                // Scenario B: User ne pehle try kiya tha par verify nahi kiya
                // Toh uska password aur naya OTP update kar do
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
                
                await existingUserByEmail.save();
            }

        } else {
            // 3. Scenario C: Naya User hai, pehli baar aaya hai
            const hashedPassword = await bcrypt.hash(password, 10); // Password safe rakho
            
            // Expiry date set karo (Abhi se 1 ghanta aage)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            // Naya User object create karo Mongoose model se
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            });

            await newUser.save();
        }

        // 4. Sab set hai, ab user ko verification email bhejo
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        // Agar email bhejne mein koi error aaya (Resend side se)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }

        // 5. SUCCESS! User DB mein save ho gaya aur mail bhi chali gayi
        return Response.json({
            success: true,
            message: "user registered successfully, Please verify your email."
        }, { status: 201 });

    } catch (error) {
        // Agar pure process mein kahin bhi crash hua toh yeh handle karega
        console.error("Error registering user", error);
        return Response.json(
            { success: false, message: "Error registering user!" },
            { status: 500 }
        )
    }
}