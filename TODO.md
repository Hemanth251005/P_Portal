# TODO: Fix Login 500 Error

- [x] Update CORS origins in server/server.js to include "https://p-portal-xdac.vercel.app"
- [x] Add detailed logging to the /api/login route in server/server.js for better error diagnosis
- [x] Ensure MongoDB connection for serverless environment
- [ ] Verify MONGODB_URI is set in Vercel environment variables (user action)
- [ ] Redeploy to Vercel and test login
- [ ] Check Vercel logs if error persists
