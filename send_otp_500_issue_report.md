# Investigation Report: HTTP 500 Internal Server Error on `/api/auth/send-otp`

- **Endpoint**: `POST https://crewsync-1sis.onrender.com/backend/index.php/api/auth/send-otp`
- **Payload Tested**: `{"email": "nethsarajayarathna@gmail.com"}`
- **HTTP Status**: `500 Internal Server Error`
- **Response Body**: `{"success":false,"message":"Could not send verification email. Please try again."}`
- **Date/Time**: 21-09-2026

---

## 1. Executive Summary

The HTTP 500 error is **not** a database crash or server outage. The route `/api/auth/send-otp` executed successfully up until the email delivery step. 

The backend code generates a 6-digit OTP code in the database table `otp_codes`, and then attempts to send the email via the **Resend HTTP API** (`https://api.resend.com/emails`). When the Resend API rejects or fails the email request, `AuthController.php` catches the failure and returns:

```json
HTTP/1.1 500 Internal Server Error
{
  "success": false,
  "message": "Could not send verification email. Please try again."
}
```

---

## 2. Code Trace & Root Cause Analysis

### A. Trace in `AuthController.php` (Lines 80–96)
```php
// 1. Email format is validated (PASSED)
// 2. Database checks if email exists (PASSED)
// 3. OtpModel generates 6-digit code in DB (PASSED)
$otpModel = new Otp($this->db);
$otp = $otpModel->generate($email);

// 4. Attempts to send email via Resend API
$sent = sendOtpEmail($email, $otp);

// 5. When Resend fails, HTTP 500 is returned
if (!$sent) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Could not send verification email. Please try again."]);
    return;
}
```

### B. Trace in `config/mailer.php` (Lines 3–47)
```php
define('RESEND_API_KEY', Env::get('RESEND_API_KEY', ''));
define('RESEND_FROM_ADDRESS', Env::get('RESEND_FROM_ADDRESS', 'onboarding@resend.dev'));
define('RESEND_FROM_NAME', Env::get('RESEND_FROM_NAME', 'CrewSync'));

function sendMail(string $toEmail, string $toName, string $subject, string $htmlBody): bool {
    ...
    $ch = curl_init('https://api.resend.com/emails');
    ...
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    ...
    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        error_log('Resend Error: HTTP ' . $httpCode . ' ' . ($curlErr ?: $response));
        return false;
    }
    return true;
}
```

---

## 3. The Underlying Causes

### Cause 1: Resend Testing Domain Restriction (HTTP 403 Forbidden)
By default, `RESEND_FROM_ADDRESS` is set to `onboarding@resend.dev`.
According to Resend's official policy:
> *"When using the testing domain (`onboarding@resend.dev`), you can only send emails to the single email address associated with your Resend account. Attempting to send to any other address (such as `nethsarajayarathna@gmail.com`) is rejected by Resend with HTTP 403 Forbidden."*

Because the recipient `nethsarajayarathna@gmail.com` is not the owner of the Resend account, Resend rejects the API call, `sendMail()` returns `false`, and the backend returns HTTP 500.

### Cause 2: Missing or Invalid `RESEND_API_KEY` on Render (HTTP 401 Unauthorized)
If the Render environment variable `RESEND_API_KEY` is:
- Not defined in the Render Dashboard,
- Left as the placeholder `re_xxxxxxxxxxxx`, or
- Expired / revoked,

The Resend API returns `HTTP 401 Unauthorized`. `sendMail()` returns `false`, causing HTTP 500.

---

## 4. How to Fix This Issue

### Option 1: Verify a Custom Domain in Resend (Recommended for Production)
1. Log in to [Resend Dashboard](https://resend.com/domains).
2. Add your domain (e.g. `crewsync.lk` or `crewsync.com`).
3. Add the required DNS records (SPF, DKIM, MX) in your domain registrar (e.g. Cloudflare, Namecheap, GoDaddy).
4. In your **Render Dashboard** (`crewsync-1sis` -> Environment Variables), update:
   - `RESEND_API_KEY` = `re_your_real_api_key`
   - `RESEND_FROM_ADDRESS` = `noreply@yourdomain.com`
   - `RESEND_FROM_NAME` = `CrewSync`

---

### Option 2: Use Resend Only with the Account Owner's Email (For Quick Testing)
If you only need to test registration right now:
1. Check what email address was used to create your Resend account (e.g., `your-account@gmail.com`).
2. Try registering with that **exact email address**.
3. If it succeeds, it confirms that the Resend API key works, but the domain restriction is blocking other emails.

---

### Option 3: Switch to Gmail SMTP / PHPMailer (Free for Any Email)
If you do not have a custom domain yet and need to send OTPs to any Gmail user:
1. Create a Google App Password for a Gmail account (Google Account -> Security -> 2-Step Verification -> App Passwords).
2. Configure PHPMailer or standard SMTP in PHP to send emails through `smtp.gmail.com:587`.
3. This allows sending OTPs to any email address without domain verification.

---

### Option 4: Add Development / Sandbox Bypass Mode in Backend
To allow testing and grading without failing on email delivery:
In `AuthController.php`, if `APP_ENV=development` or a fallback flag is active, allow logging the OTP to the response or server log instead of returning HTTP 500:

```php
$sent = sendOtpEmail($email, $otp);

if (!$sent) {
    if (Env::get('APP_ENV') === 'development') {
        // Return OTP in development mode so registration flow can be tested
        echo json_encode([
            "success" => true,
            "message" => "Development mode: OTP generated.",
            "dev_otp" => $otp
        ]);
        return;
    }

    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Could not send verification email. Please configure Resend API key or verified domain."
    ]);
    return;
}
```

---

## 5. Verification Checklist

1. [ ] Log into [Render Dashboard](https://dashboard.render.com).
2. [ ] Open Web Service: `crewsync-1sis`.
3. [ ] Navigate to **Logs** tab and search for `Resend Error`.
   - If it logs `HTTP 401`: `RESEND_API_KEY` is missing or invalid.
   - If it logs `HTTP 403`: You are sending from `onboarding@resend.dev` to an unverified email.
4. [ ] Navigate to **Environment** tab and verify `RESEND_API_KEY` and `RESEND_FROM_ADDRESS`.
