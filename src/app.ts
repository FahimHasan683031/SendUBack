import cors from 'cors'
import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import router from './routes'
import { Morgan } from './shared/morgan'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middleware/globalErrorHandler'
import passport from './app/modules/auth/passport.auth/config/passport'
import handleStripeWebhook from './app/modules/payment/handleStripeWebhook'


//application
const app = express();


const allowedOrigins = [
  'https://goroqit.com',
  'https://www.goroqit.com',   // add www version
  'http://goroqit.com',        // optional if non-SSL
  'http://localhost:3000',
  'http://10.10.7.45:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.goroqit.com') || origin === 'https://goroqit.com') {
      callback(null, true);
    } else {
      console.log('🚫 Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Stripe webhook route
app.use('/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);


//morgan
app.use(Morgan.successHandler)
app.use(Morgan.errorHandler)
//body parser
app.use(express.json())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//file retrieve
app.use(express.static('uploads'))

//router
app.use('/api/v1', router)

//live response
app.get('/', (req: Request, res: Response) => {
  res.send(`
   <div style="
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #0096FF22, #00000011);
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #000000;
      margin: 0;
    ">
      <div style="
        text-align: center;
        background: #ffffffd9;
        border: 1px solid #0096FF55;
        border-radius: 16px;
        padding: 3rem 2.5rem;
        box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        max-width: 600px;
      ">
        <img src="https://i.ibb.co.com/Hf7XccNJ/Send-you-back-Final-logo-02-3.png" alt="Go Roqit" width="80" style="margin-bottom: 1rem; height: 60px; width: 180px;" />
        
        <h1 style="
          font-size: 2.4rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          color: #0096FF;
        ">
          👋 Welcome to SendUBack
        </h1>

        <p style="
          font-size: 1.15rem;
          line-height: 1.7;
          color: #000000;
        ">
          You’ve reached the <code style="color:#0096FF;">root</code> of the Go Roqit server.<br>
          Everything’s running smoothly and securely. ✅<br><br>
          Explore the API endpoints or head back to the app for takeoff. 🚀
        </p>

        <a href="https://goroqit.com" target="_blank" style="
          display: inline-block;
          margin-top: 1.8rem;
          padding: 0.8rem 1.6rem;
          border-radius: 10px;
          background: #0096FF;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.3s ease;
        " onmouseover="this.style.background='#000000'" onmouseout="this.style.background='#0096FF'">
          🌐 Visit Go Roqit App
        </a>

        <p style="
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #00000099;
        ">
          © ${new Date().getFullYear()} — Go Roqit Server<br>
          Built with 💙 and innovation
        </p>
      </div>
    </div>
  `)
})


//global error handle
app.use(globalErrorHandler)
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Endpoint not found 🚫",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "Looks like you’ve taken a wrong turn — this route doesn’t exist on the Go Roqit API.",
      },
      {
        path: "/api/v1/docs",
        message: "Need directions? Check out our API documentation for valid endpoints. 📘",
      },
    ],
    tip: "Pro Tip 💡: Always double-check your endpoint URL, HTTP method, and version prefix before sending requests.",
    roast: "It’s okay, even rockets miss their trajectory sometimes. 🚀 Adjust course and try again!",
    timestamp: new Date().toISOString(),
  });
});

export default app
