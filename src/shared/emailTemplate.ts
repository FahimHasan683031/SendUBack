import config from '../config'
import { ICreateAccount, IResetPassword } from '../interfaces/emailTemplate'

const createAccount = (values: ICreateAccount) => {
  console.log(values, 'values')
  const data = {
    to: values.email,
    subject: `Verify your SendUBack account, ${values.name}`,
    html: `
<body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px;
                overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <tr>
      <td align="center" style="background:linear-gradient(135deg,#F5FAFF,#E6F0FF); padding:35px 20px; border-bottom:1px solid #0096FF33;">
        <img src="https://i.ibb.co.com/Hf7XccNJ/Send-you-back-Final-logo-02-3.png" alt="SendUBack"
             style="width:220px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.25));">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:45px;">
        <h1 style="color:#0096FF; font-size:26px; font-weight:700; margin-bottom:15px; text-align:center;">
          Verify Your Email ✨
        </h1>

        <p style="color:#003060; font-size:16px; line-height:1.6; margin-bottom:25px; text-align:center;">
          Hey <strong>${values.name}</strong>, welcome to <strong>SendUBack</strong>! 🎉<br>
          Please verify your email to activate your account.
        </p>

        <!-- OTP Box -->
        <div style="background:linear-gradient(145deg,#EAF4FF,#D7E9FF); border:2px solid #0096FF; 
                    border-radius:12px; padding:25px 0; text-align:center; margin:30px auto; max-width:300px;">
          <span style="font-size:40px; font-weight:700; color:#003060; letter-spacing:6px;">
            ${values.otp}
          </span>
        </div>

        <p style="color:#003060; font-size:15px; line-height:1.6; text-align:center;">
          This code will expire in <strong>5 minutes</strong>.<br>
          If you didn’t request this, you can safely ignore this email.
        </p>

        <!-- Tip -->
        <div style="margin-top:35px; background-color:#fff8e1; border-left:6px solid #ffd54f; 
                    border-radius:8px; padding:15px 18px;">
          <p style="margin:0; color:#4a4a4a; font-size:14px;">
            🔒 For security reasons, never share this code with anyone.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align:center; margin-top:45px;">
          <a href="https://goroqit.com/otp-verify" 
             style="background-color:#0096FF; color:#ffffff; padding:14px 32px; font-size:16px; 
                    font-weight:600; border-radius:10px; text-decoration:none; display:inline-block; 
                    box-shadow:0 4px 12px rgba(0,150,255,0.3); transition:all 0.3s;">
            Open SendUBack 🚀
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background:linear-gradient(135deg,#F5FAFF,#E6F0FF); padding:25px 20px; border-top:1px solid #0096FF33;">
        <p style="margin:0; color:#003060; font-size:13px;">
          © ${new Date().getFullYear()} <strong>SendUBack</strong>. All rights reserved.
        </p>
        <p style="margin:6px 0 0; color:#003060; font-size:13px;">
          Powered by <strong style="color:#0096FF;">SendUBack API</strong> ✨
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }
  return data
}


const resetPassword = (values: IResetPassword) => {
  console.log(values, 'values')
  const data = {
    to: values.email,
    subject: `Reset your SendUBack password, ${values.name}`,
    html: `
<body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px;
                overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <tr>
      <td align="center" style="background:linear-gradient(135deg,#F5FAFF,#E6F0FF); padding:35px 20px; border-bottom:1px solid #0096FF33;">
        <img src="https://i.ibb.co.com/Hf7XccNJ/Send-you-back-Final-logo-02-3.png" alt="SendUBack"
             style="width:220px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.25));">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:45px;">
        <h1 style="color:#0096FF; font-size:26px; font-weight:700; margin-bottom:15px; text-align:center;">
          Password Reset Request 🔐
        </h1>

        <p style="color:#003060; font-size:16px; line-height:1.6; margin-bottom:25px; text-align:center;">
          Hi <strong>${values.name}</strong>, 👋<br>
          We received a request to reset your password for your <strong>SendUBack</strong> account.
          <br>Enter the code below to complete the process:
        </p>

        <!-- OTP Box -->
        <div style="background:linear-gradient(145deg,#EAF4FF,#D7E9FF); border:2px solid #0096FF;
                    border-radius:12px; padding:25px 0; text-align:center; margin:30px auto; max-width:300px;">
          <span style="font-size:40px; font-weight:700; color:#003060; letter-spacing:6px;">
            ${values.otp}
          </span>
        </div>

        <p style="color:#003060; font-size:15px; line-height:1.6; text-align:center;">
          This verification code is valid for <strong>5 minutes</strong>.<br>
          If you didn’t request this, please ignore this email — your account is safe.
        </p>

        <!-- Tip -->
        <div style="margin-top:35px; background-color:#fff8e1; border-left:6px solid #ffd54f;
                    border-radius:8px; padding:15px 18px;">
          <p style="margin:0; color:#4a4a4a; font-size:14px;">
            ⚠️ <strong>Security Tip:</strong> Never share your reset code with anyone. SendUBack will never ask for it.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align:center; margin-top:45px;">
          <a href="https://goroqit.com/otp-verify" target="_blank"
             style="background-color:#0096FF; color:#ffffff; padding:14px 32px; font-size:16px;
                    font-weight:600; border-radius:10px; text-decoration:none; display:inline-block;
                    box-shadow:0 4px 12px rgba(0,150,255,0.3); transition:all 0.3s;">
            🔑 Reset Password
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background:linear-gradient(135deg,#F5FAFF,#E6F0FF); padding:25px 20px; border-top:1px solid #0096FF33;">
        <p style="margin:0; color:#003060; font-size:13px;">
          © ${new Date().getFullYear()} <strong>SendUBack</strong>. All rights reserved.
        </p>
        <p style="margin:6px 0 0; color:#003060; font-size:13px;">
          Powered by <strong style="color:#0096FF;">SendUBack API</strong> ✨
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }

  return data
}


const resendOtp = (values: {
  email: string
  name: string
  otp: string
  type: 'resetPassword' | 'createAccount'
}) => {
  console.log(values, 'values')
  const isReset = values.type === 'resetPassword'

  const data = {
    to: values.email,
    subject: `${isReset ? 'Password Reset' : 'Account Verification'} - New Code`,
    html: `
   <body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:14px;
                overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:35px 20px; border-top:1px solid #e6f4ea;">
        <img src="https://api.goroqit.com/image/1761168795060-ant6f7.png" alt="Go.Roqit"
             style="width:210px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.3));">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:45px;">
        <h1 style="color:#1b4332; font-size:26px; font-weight:700; margin-bottom:15px; text-align:center;">
          ${isReset ? 'Reset Your Password 🔐' : 'Verify Your Account 🚀'}
        </h1>

        <p style="color:#3a5a40; font-size:16px; line-height:1.6; margin-bottom:25px; text-align:center;">
          Hi <strong>${values.name}</strong>, 👋<br>
          ${
            isReset
              ? 'You requested a new verification code to reset your Go.Roqit password.'
              : 'Here is your new verification code to complete your Go.Roqit account setup.'
          }<br>
          Use the code below to continue:
        </p>

        <!-- OTP Box -->
        <div style="background:linear-gradient(145deg,#d8f3dc,#b7e4c7);
                    border:2px solid #52b788; border-radius:12px;
                    padding:25px 0; text-align:center;
                    margin:30px auto; max-width:300px;">
          <span style="font-size:40px; font-weight:700; color:#1b4332; letter-spacing:6px;">
            ${values.otp}
          </span>
        </div>

        <p style="color:#3a5a40; font-size:15px; line-height:1.6; text-align:center;">
          This code is valid for <strong>5 minutes</strong>.<br>
          If this was not you, please ignore the email.
        </p>

        <!-- Tip -->
        <div style="margin-top:35px; background-color:#fff8e1;
                    border-left:6px solid #ffd54f;
                    border-radius:8px; padding:15px 18px;">
          <p style="margin:0; color:#4a4a4a; font-size:14px;">
            🔒 <strong>Security Tip:</strong> Never share your OTP with anyone. Go.Roqit will never request it.
          </p>
        </div>

        <!-- Button -->
        <div style="text-align:center; margin-top:45px;">
          <a href="https://goroqit.com/otp-verify"
             style="background-color:#2d6a4f; color:#ffffff; padding:14px 32px;
                    font-size:16px; font-weight:600; border-radius:10px;
                    text-decoration:none; display:inline-block;
                    box-shadow:0 4px 12px rgba(45,106,79,0.3);">
            ${isReset ? 'Reset Password' : 'Verify Account'}
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:25px 20px; border-top:1px solid #e6f4ea;">
        <p style="margin:0; color:#52796f; font-size:13px;">
          © ${new Date().getFullYear()} <strong>Go.Roqit</strong>. All rights reserved.
        </p>
        <p style="margin:6px 0 0; color:#3a5a40; font-size:13px;">
          Powered by <strong style="color:#1b4332;">Go.Roqit API</strong> 🚀
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }

  return data
}


const adminContactNotificationEmail = (payload: {
  name: string
  email: string
  phone?: string
  message: string
}) => {
  return {
    to: config.super_admin.email as string,
    subject: '📩 New Contact Form Submission – Go.Roqit',
    html: `
<body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px;
                overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:35px 20px; border-top:1px solid #e6f4ea;">
        <img src="https://api.goroqit.com/image/1761168795060-ant6f7.png" alt="Go.Roqit"
             style="width:210px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.3));">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:45px;">
        <h1 style="color:#1b4332; font-size:26px; font-weight:700; margin-bottom:20px; text-align:center;">
          📬 New Contact Form Submission
        </h1>

        <p style="color:#3a5a40; font-size:16px; text-align:center; margin-bottom:30px;">
          A new message has been submitted through the Go.Roqit contact form.
        </p>

        <!-- Contact Details -->
        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <tr>
            <td style="padding:12px 0; font-size:15px; color:#3a5a40;">👤 <strong>Name:</strong></td>
            <td style="padding:12px 0; font-size:15px; color:#1b4332; text-align:right;">
              ${payload.name}
            </td>
          </tr>

          <tr style="border-top:1px solid #e6f4ea;">
            <td style="padding:12px 0; font-size:15px; color:#3a5a40;">📧 <strong>Email:</strong></td>
            <td style="padding:12px 0; font-size:15px; color:#1b4332; text-align:right;">
              ${payload.email}
            </td>
          </tr>

          <tr style="border-top:1px solid #e6f4ea;">
            <td style="padding:12px 0; font-size:15px; color:#3a5a40;">📞 <strong>Phone:</strong></td>
            <td style="padding:12px 0; font-size:15px; color:#1b4332; text-align:right;">
              ${payload.phone || 'N/A'}
            </td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="background-color:#f1f8f4; border-left:6px solid #2d6a4f;
                    border-radius:8px; padding:20px; margin-top:30px;">
          <p style="margin:0; font-size:15px; color:#1b4332; line-height:1.6;">
            "${payload.message}"
          </p>
        </div>

        <p style="color:#3a5a40; font-size:14px; margin-top:30px; text-align:center;">
          You can respond directly to <strong>${payload.email}</strong>.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:25px 20px; border-top:1px solid #e6f4ea;">
        <p style="margin:0; color:#52796f; font-size:13px;">
          © ${new Date().getFullYear()} <strong>Go.Roqit</strong>. All rights reserved.
        </p>
        <p style="margin:6px 0 0; color:#3a5a40; font-size:13px;">
          Powered by <strong style="color:#1b4332;">Go.Roqit API</strong> 🚀
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }
}


const userContactConfirmationEmail = (payload: {
  name: string
  email: string
  message: string
}) => {
  return {
    to: payload.email,
    subject: '💬 Thank You for Contacting SendUBack',
    html: `
<body style="margin:0; padding:0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:640px; margin:40px auto; background-color:#ffffff; border-radius:14px;
                overflow:hidden; box-shadow:0 5px 25px rgba(0,0,0,0.08);">

    <!-- Header -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:35px 20px; border-top:1px solid #e6f4ea;">
        <img src="https://api.goroqit.com/image/1761168795060-ant6f7.png" alt="SendUBack"
             style="width:210px; height:auto; filter:drop-shadow(0 0 6px rgba(0,0,0,0.3));">
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:45px;">
        <h1 style="color:#1b4332; font-size:26px; font-weight:700; margin-bottom:20px; text-align:center;">
          Thank You for Contacting Us 💚
        </h1>

        <p style="color:#3a5a40; font-size:16px; line-height:1.6; text-align:center;">
          Dear <strong>${payload.name}</strong>,<br>
          We’ve received your message and our team will get back to you shortly!
        </p>

        <!-- Your Message -->
        <div style="background:linear-gradient(145deg,#d8f3dc,#b7e4c7); border:2px solid #52b788; 
                    border-radius:12px; padding:25px 20px; text-align:center; margin:30px auto; max-width:500px;">
          <p style="font-size:15px; color:#1b4332; line-height:1.6; margin:0;">
            <em>“${payload.message}”</em>
          </p>
        </div>

        <p style="color:#3a5a40; font-size:15px; line-height:1.6; text-align:center;">
          We appreciate you taking the time to reach out to <strong>SendUBack</strong>.<br>
          Expect a reply from our team shortly 🚀
        </p>

        <!-- Button -->
        <div style="text-align:center; margin-top:40px;">
          <a href="https://goroqit.com"
             style="background-color:#2d6a4f; color:#ffffff; padding:14px 32px; font-size:16px; 
                    font-weight:600; border-radius:10px; text-decoration:none; display:inline-block; 
                    box-shadow:0 4px 12px rgba(45,106,79,0.3); transition:all 0.3s;">
            Visit SendUBack 🌐
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background-color:#f1f8f4; padding:25px 20px; border-top:1px solid #e6f4ea;">
        <p style="margin:0; color:#52796f; font-size:13px;">
          © ${new Date().getFullYear()} <strong>SendUBack</strong>. All rights reserved.
        </p>
        <p style="margin:6px 0 0; color:#3a5a40; font-size:13px;">
          Powered by <strong style="color:#1b4332;">SendUBack API</strong> 🚀
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }
}


const sendPaymentConfirmationEmail = (data: any) => {
  const parcelsHtml = data.parcel
    .map(
      (p: any, i: number) => `
        <tr style="border-top:1px solid #e8e8e822;">
          <td style="padding:8px 0; color:#00000099;">Parcel ${i + 1}:</td>
          <td style="padding:8px 0; color:#000000; text-align:right;">
            ${p.name}, ${p.weight}${p.mass_unit}
          </td>
        </tr>
      `,
    )
    .join('')

  return {
    to: data.address_to.email,
    subject: `✅ Payment Completed – Shipping Order`,
    html: `
<body style="margin:0; padding:0; font-family:'Inter','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:16px;
                overflow:hidden; border:1px solid #0096FF33; box-shadow:0 4px 20px rgba(0,0,0,0.06);">

    <!-- Header -->
 <td align="center" 
  style="
    background: linear-gradient(135deg, #F5FAFF, #E6F0FF);
    padding: 35px 20px; 
    border-bottom: 1px solid #0096FF33;
  "
>
  <img 
    src="https://i.ibb.co.com/Hf7XccNJ/Send-you-back-Final-logo-02-3.png"
    alt="SendUBack Logo"
    style="height:85px; width:auto; margin-bottom:10px;" 
  />
  
  <h1 style="
    color:#0096FF;  
    font-size:24px; 
    font-weight:700; 
    margin:0;
  ">
    Payment Completed Notification
  </h1>
</td>


    <!-- Body -->
    <tr>
      <td style="padding:40px;">
        <p style="color:#000000; font-size:15px; line-height:1.7; text-align:center;">
          Hello <strong style="color:#0096FF;">${data.address_from.name}</strong>,  
          your payment for your <strong>shipping order</strong> has been successfully completed. ✅
        </p>

        <!-- Shipping Summary -->
        <h2 style="color:#0096FF; font-size:19px; margin-bottom:15px; margin-top:30px;">
          📦 Shipping Details
        </h2>

        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0; color:#00000099;">Shipping Type:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">${data.shipping_type}</td>
          </tr>

          <tr style="border-top:1px solid #e8e8e822;">
            <td style="padding:8px 0; color:#00000099;">Order Status:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">${data.status}</td>
          </tr>
        </table>

        <!-- Sender Info -->
        <h3 style="color:#0096FF; font-size:17px; margin-top:30px;">📨 Sender Information</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:6px 0; color:#00000099;">Name:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">${data.address_from.name}</td></tr>
          <tr><td style="padding:6px 0; color:#00000099;">Address:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">
                ${data.address_from.street1}, ${data.address_from.city}, 
                ${data.address_from.state}, ${data.address_from.postal_code}, ${data.address_from.country}
              </td>
          </tr>
          <tr><td style="padding:6px 0; color:#00000099;">Phone:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">${data.address_from.phone}</td></tr>
          <tr><td style="padding:6px 0; color:#00000099;">Email:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">${data.address_from.email}</td></tr>
        </table>

        <!-- Receiver Info -->
        <h3 style="color:#0096FF; font-size:17px; margin-top:30px;">📬 Receiver Information</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:6px 0; color:#00000099;">Name:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">${data.address_to.name}</td></tr>
          <tr><td style="padding:6px 0; color:#00000099;">Address:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">
                ${data.address_to.street1}, ${data.address_to.city}, 
                ${data.address_to.state}, ${data.address_to.postal_code}, ${data.address_to.country}
              </td>
          </tr>
          <tr><td style="padding:6px 0; color:#00000099;">Phone:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">${data.address_to.phone}</td></tr>
          <tr><td style="padding:6px 0; color:#00000099;">Email:</td>
              <td style="padding:6px 0; color:#000000; text-align:right;">${data.address_to.email}</td></tr>
        </table>

        <!-- Parcel Details -->
        <h3 style="color:#0096FF; font-size:17px; margin-top:30px;">📦 Parcel Details</h3>
        <table style="width:100%; border-collapse:collapse;">
          ${parcelsHtml}
        </table>

        <!-- Insurance -->
        <h3 style="color:#0096FF; font-size:17px; margin-top:30px;">🛡 Insurance</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0; color:#00000099;">Insured:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">${data.insurance.isInsured ? 'Yes' : 'No'}</td>
          </tr>
          <tr style="border-top:1px solid #e8e8e822;">
            <td style="padding:8px 0; color:#00000099;">Product Value:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">£${data.insurance.productValue}</td>
          </tr>
          <tr style="border-top:1px solid #e8e8e822;">
            <td style="padding:8px 0; color:#00000099;">Insurance Cost:</td>
            <td style="padding:8px 0; color:#0096FF; font-weight:700; text-align:right;">
              £${data.insurance.insuranceCost}
            </td>
          </tr>
        </table>

        <!-- Cost -->
        <h3 style="color:#0096FF; font-size:17px; margin-top:30px;">💰 Payment Summary</h3>
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0; color:#00000099;">Shipping Cost:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">£${data.shipping_cost}</td>
          </tr>
          <tr style="border-top:1px solid #e8e8e822;">
            <td style="padding:8px 0; color:#00000099; font-weight:700;">Total Paid:</td>
            <td style="padding:8px 0; color:#0096FF; font-weight:700; text-align:right;">
              £${data.total_cost}
            </td>
          </tr>
        </table>

        <!-- Notes -->
        <div style="background:#0096FF22; padding:15px 18px; border-radius:12px; border-left:4px solid #0096FF; margin-top:25px;">
          <p style="margin:0; color:#000000; font-size:14px;">
            💬 <strong>Notes:</strong> ${data.notes || 'No additional notes'}
          </p>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background:#ffffff; padding:22px; border-top:1px solid #e8e8e22;">
        <p style="margin:0; color:#00000099; font-size:12px;">
          © ${new Date().getFullYear()} — SendUBack Services
        </p>
        <p style="margin:5px 0 0; color:#00000099; font-size:12px;">
          Built with 💙 for your comfort
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }
}

const sendAdminPaymentNotificationEmail = (data: any) => {
  return {
    to: config.super_admin.email as string,
    subject: `💡 Payment Completed by ${data.address_from.name} – ${data.shipping_type}`,
    html: `
<body style="margin:0; padding:0; font-family:'Inter','Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
    style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:16px;
           overflow:hidden; border:1px solid #0096FF55; box-shadow:0 4px 20px #00000011;">

    <!-- Header -->
   <td align="center" 
  style="
    background: linear-gradient(135deg, #F5FAFF, #E6F0FF);
    padding: 35px 20px; 
    border-bottom: 1px solid #0096FF33;
  "
>
  <img 
    src="https://i.ibb.co.com/Hf7XccNJ/Send-you-back-Final-logo-02-3.png"
    alt="SendUBack Logo"
    style="height:85px; width:auto; margin-bottom:10px;" 
  />
  
  <h1 style="
    color:#0096FF;  
    font-size:24px; 
    font-weight:700; 
    margin:0;
  ">
    Payment Completed Notification
  </h1>
</td>


    <!-- Body -->
    <tr>
      <td style="padding:40px;">
        <p style="color:#00000099; font-size:15px; line-height:1.7; text-align:center;">
          <strong style="color:#0096FF;">${data.address_from.name}</strong> has successfully completed the payment for
          <strong>${data.shipping_type}</strong>.
        </p>

        <!-- Service Summary -->
        <h2 style="color:#0096FF; font-size:19px; margin-bottom:15px; margin-top:30px;">
          🧾 Shipping Details
        </h2>

        <table style="width:100%; border-collapse:collapse;">

          <tr>
            <td style="padding:8px 0; color:#00000099;">Customer Name:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">
              ${data.address_from.name}
            </td>
          </tr>

          <tr style="border-top:1px solid #0096FF22;">
            <td style="padding:8px 0; color:#00000099;">Email:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">
              ${data.address_from.email}
            </td>
          </tr>

          <tr style="border-top:1px solid #0096FF22;">
            <td style="padding:8px 0; color:#00000099;">Phone:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">
              ${data.address_from.phone}
            </td>
          </tr>

          <tr style="border-top:1px solid #0096FF22;">
            <td style="padding:8px 0; color:#00000099;">Shipping Type:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">
              ${data.shipping_type}
            </td>
          </tr>

          <tr style="border-top:1px solid #0096FF22;">
            <td style="padding:8px 0; color:#00000099;">Address:</td>
            <td style="padding:8px 0; color:#000000; text-align:right;">
              ${data.address_from.street1}, ${data.address_from.city}, 
              ${data.address_from.state}, ${data.address_from.postal_code}, ${data.address_from.country}
            </td>
          </tr>

          <tr style="border-top:1px solid #0096FF22;">
            <td style="padding:8px 0; color:#00000099;">Total Paid:</td>
            <td style="padding:8px 0; color:#0096FF; font-weight:700; text-align:right;">
              £${data.total_cost}
            </td>
          </tr>

        </table>

        <!-- Notes -->
        <div style="background:#0096FF22; padding:15px 18px; border-radius:12px;
                    border-left:4px solid #0096FF; margin-top:25px;">
          <p style="margin:0; color:#000000; font-size:14px;">
            💬 <strong>Notes:</strong> ${data.notes || 'No additional notes'}
          </p>
        </div>

      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="background:#f9f9f9; padding:22px; border-top:1px solid #0096FF22;">
        <p style="margin:0; color:#00000099; font-size:12px;">
          © ${new Date().getFullYear()} — SendUBack Services
        </p>
        <p style="margin:5px 0 0; color:#00000099; font-size:12px;">
          Built with 💙 for your comfort
        </p>
      </td>
    </tr>

  </table>
</body>
    `,
  }
}

export const emailTemplate = {
  createAccount,
  resetPassword,
  resendOtp,
  userContactConfirmationEmail,
  adminContactNotificationEmail,
  sendPaymentConfirmationEmail,
  sendAdminPaymentNotificationEmail,
}
