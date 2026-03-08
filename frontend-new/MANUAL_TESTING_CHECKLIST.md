# Manual Testing Checklist

This document provides comprehensive manual testing procedures for features that require hands-on validation beyond automated tests. Complete this checklist before deploying to production.

**Validates: Requirements 22.5**

---

## 1. Voice Recording and Voice Commerce

### 1.1 Browser Compatibility
- [ ] **Chrome (Desktop)**: Test voice recording functionality
  - Navigate to `/voice` page
  - Click "Start Recording" button
  - Verify microphone permission prompt appears
  - Grant permission and verify recording starts
  - Speak a product query (e.g., "Show me handmade pottery")
  - Stop recording and verify audio is processed
  - Verify search results display correctly
  
- [ ] **Firefox (Desktop)**: Repeat voice recording test
- [ ] **Safari (Desktop)**: Repeat voice recording test
- [ ] **Edge (Desktop)**: Repeat voice recording test
- [ ] **Chrome (Mobile - Android)**: Repeat voice recording test
- [ ] **Safari (Mobile - iOS)**: Repeat voice recording test

### 1.2 Microphone Permissions
- [ ] **Permission Denied**: Deny microphone access
  - Verify error message displays: "Microphone access denied"
  - Verify user is prompted to enable permissions in browser settings
  
- [ ] **Permission Granted**: Grant microphone access
  - Verify recording indicator appears
  - Verify audio waveform visualization displays (if implemented)
  - Verify recording timer shows elapsed time

### 1.3 Audio Recording Quality
- [ ] **Clear Audio**: Record in quiet environment
  - Verify transcription accuracy is high (>90%)
  - Verify product results match spoken query
  
- [ ] **Noisy Environment**: Record with background noise
  - Verify system handles noise gracefully
  - Verify error message if transcription fails
  
- [ ] **Long Recording**: Record for 30+ seconds
  - Verify recording doesn't cut off prematurely
  - Verify entire audio is processed

### 1.4 Voice Search Accuracy
- [ ] **Product Search**: "Show me ceramic bowls"
  - Verify relevant ceramic bowl products display
  
- [ ] **Artisan Search**: "Find artisans who make jewelry"
  - Verify artisan results display correctly
  
- [ ] **Category Search**: "Browse traditional textiles"
  - Verify textile category products display
  
- [ ] **Complex Query**: "I'm looking for handmade leather bags under $100"
  - Verify results are filtered by category and price

### 1.5 Error Handling
- [ ] **Unsupported Browser**: Test in older browser without MediaRecorder API
  - Verify graceful error message displays
  - Verify fallback to text search is offered
  
- [ ] **Network Error**: Disconnect network during transcription
  - Verify error message displays
  - Verify retry option is available
  
- [ ] **Backend Error**: Test with backend unavailable
  - Verify appropriate error message
  - Verify user can retry or use alternative search

### 1.6 Visual Feedback
- [ ] **Recording State**: Verify visual indicators during recording
  - Recording button changes color/state
  - Waveform animation displays (if implemented)
  - Timer shows recording duration
  
- [ ] **Processing State**: Verify loading indicator during transcription
  - Loading spinner or progress bar displays
  - Status message: "Processing your voice query..."
  
- [ ] **Results State**: Verify results display correctly
  - Transcribed query text displays
  - Product results grid displays
  - "No results" message if no matches found

---

## 2. Payment Integration (Razorpay)

### 2.1 Payment Flow - Workshop Booking
- [ ] **Select Workshop**: Navigate to workshop detail page
  - Click "Book Workshop" button
  - Select date and time slot
  - Verify booking summary displays correct price
  
- [ ] **Initiate Payment**: Click "Proceed to Payment"
  - Verify Razorpay payment modal opens
  - Verify correct amount displays in modal
  - Verify merchant name displays correctly

### 2.2 Payment Success Scenarios
- [ ] **Credit Card Payment**: Use test credit card
  - Card Number: 4111 1111 1111 1111
  - Expiry: Any future date
  - CVV: Any 3 digits
  - Verify payment processes successfully
  - Verify booking confirmation displays
  - Verify confirmation email sent (check logs)
  
- [ ] **Debit Card Payment**: Use test debit card
  - Verify payment processes successfully
  - Verify booking confirmation displays
  
- [ ] **UPI Payment**: Use test UPI ID
  - Verify UPI flow works correctly
  - Verify payment confirmation
  
- [ ] **Net Banking**: Use test bank credentials
  - Verify bank selection page displays
  - Verify payment processes successfully

### 2.3 Payment Failure Scenarios
- [ ] **Insufficient Funds**: Use test card that fails
  - Card Number: 4000 0000 0000 0002
  - Verify error message displays
  - Verify user can retry payment
  - Verify booking is not confirmed
  
- [ ] **Payment Timeout**: Let payment modal timeout
  - Verify timeout error message
  - Verify user can retry
  
- [ ] **User Cancellation**: Close payment modal
  - Verify booking is not confirmed
  - Verify user returns to booking page
  - Verify can restart booking process

### 2.4 Currency and Pricing
- [ ] **INR Currency**: Test with Indian Rupees
  - Verify ₹ symbol displays correctly
  - Verify amount formatting (e.g., ₹1,234.56)
  
- [ ] **International Currency**: Test with USD (if supported)
  - Verify $ symbol displays correctly
  - Verify currency conversion is accurate
  
- [ ] **Tax Calculation**: Verify taxes are calculated correctly
  - Verify tax breakdown displays in summary
  - Verify total includes all taxes and fees

### 2.5 Payment Security
- [ ] **HTTPS Connection**: Verify payment page uses HTTPS
  - Check browser address bar for lock icon
  - Verify no mixed content warnings
  
- [ ] **PCI Compliance**: Verify card details are not stored
  - Check browser DevTools Network tab
  - Verify card data goes directly to Razorpay
  - Verify no card data in frontend logs
  
- [ ] **Session Security**: Test payment with expired session
  - Verify user is redirected to login
  - Verify booking data is preserved after login

### 2.6 Payment Confirmation
- [ ] **Confirmation Page**: After successful payment
  - Verify order/booking ID displays
  - Verify payment amount displays
  - Verify payment method displays
  - Verify date/time of transaction displays
  
- [ ] **Email Confirmation**: Check email inbox
  - Verify confirmation email received
  - Verify email contains booking details
  - Verify email contains payment receipt
  
- [ ] **Order History**: Navigate to user dashboard
  - Verify booking appears in order history
  - Verify payment status shows "Paid"
  - Verify can download receipt/invoice

---

## 3. NFT Certificate System

### 3.1 NFT Certificate Display
- [ ] **Product with NFT**: Navigate to product with NFT certificate
  - Verify "NFT Certificate Available" badge displays
  - Verify NFT icon/indicator on product card
  - Verify NFT details section on product page
  
- [ ] **Product without NFT**: Navigate to regular product
  - Verify no NFT badge displays
  - Verify no NFT section on product page

### 3.2 NFT Certificate Details
- [ ] **Certificate Information**: View NFT certificate details
  - Verify token ID displays
  - Verify contract address displays
  - Verify blockchain network displays (e.g., Ethereum, Polygon)
  - Verify certificate metadata displays
  
- [ ] **Certificate Image**: Verify certificate visual
  - Verify certificate image/artwork displays
  - Verify image loads correctly
  - Verify image is high quality

### 3.3 Blockchain Verification
- [ ] **Verify on Blockchain**: Click "Verify on Blockchain" button
  - Verify opens blockchain explorer (e.g., Etherscan)
  - Verify correct token ID in URL
  - Verify token exists on blockchain
  - Verify token metadata matches product
  
- [ ] **Ownership Verification**: Check token ownership
  - Verify owner address displays
  - Verify ownership history displays (if available)
  - Verify transfer history displays (if available)

### 3.4 NFT Certificate Purchase Flow
- [ ] **Purchase Product with NFT**: Add NFT product to cart
  - Verify NFT certificate mentioned in cart
  - Verify NFT fee included in price (if applicable)
  - Complete purchase
  - Verify NFT certificate issued after payment
  
- [ ] **Certificate Delivery**: After purchase
  - Verify certificate appears in user dashboard
  - Verify certificate download option available
  - Verify certificate can be viewed in wallet (if integrated)

### 3.5 Blockchain Network Connectivity
- [ ] **Network Available**: Test with blockchain network online
  - Verify verification works correctly
  - Verify data loads from blockchain
  
- [ ] **Network Unavailable**: Test with network issues
  - Verify graceful error message
  - Verify cached data displays (if available)
  - Verify retry option available
  
- [ ] **Wrong Network**: Test with wallet on wrong network
  - Verify error message prompts network switch
  - Verify correct network name displays

### 3.6 NFT Certificate Authenticity
- [ ] **Authentic Certificate**: Verify genuine NFT
  - Verify certificate validates successfully
  - Verify all metadata matches product
  - Verify issuer address is correct
  
- [ ] **Certificate Metadata**: Check certificate details
  - Verify artisan name in metadata
  - Verify product details in metadata
  - Verify creation date in metadata
  - Verify authenticity seal/signature

---

## 4. WhatsApp Integration

### 4.1 Message Sending to WhatsApp
- [ ] **Send Message from Artisan Profile**: Navigate to artisan profile
  - Click "Contact Artisan" button
  - Type message in message form
  - Click "Send via WhatsApp" option
  - Verify WhatsApp opens (web or app)
  - Verify message is pre-filled in WhatsApp
  - Verify artisan's WhatsApp number is correct
  
- [ ] **Send Message from Product Page**: Navigate to product page
  - Click "Ask Artisan" button
  - Type product inquiry
  - Send via WhatsApp
  - Verify product details included in message

### 4.2 WhatsApp Web vs App
- [ ] **WhatsApp Web (Desktop)**: Test on desktop browser
  - Verify WhatsApp Web opens in new tab
  - Verify message is pre-filled
  - Verify can send message
  
- [ ] **WhatsApp App (Mobile)**: Test on mobile device
  - Verify WhatsApp app opens
  - Verify message is pre-filled
  - Verify can send message
  
- [ ] **WhatsApp Not Installed**: Test on device without WhatsApp
  - Verify fallback message displays
  - Verify alternative contact options offered

### 4.3 Message Formatting
- [ ] **Plain Text Message**: Send simple text message
  - Verify message sends correctly
  - Verify formatting preserved
  
- [ ] **Message with Product Link**: Send message with product URL
  - Verify link is clickable in WhatsApp
  - Verify link opens correct product page
  
- [ ] **Message with Emojis**: Send message with emojis
  - Verify emojis display correctly in WhatsApp
  
- [ ] **Long Message**: Send message >500 characters
  - Verify entire message is sent
  - Verify no truncation

### 4.4 WhatsApp API Integration
- [ ] **API Connection**: Test WhatsApp API connectivity
  - Send test message via API
  - Verify message delivered successfully
  - Verify delivery status received
  
- [ ] **API Error Handling**: Test with API unavailable
  - Verify error message displays
  - Verify fallback to WhatsApp Web/App
  - Verify user can retry
  
- [ ] **Rate Limiting**: Send multiple messages quickly
  - Verify rate limiting works
  - Verify appropriate message if limit reached
  - Verify can send again after cooldown

### 4.5 Message Notifications
- [ ] **Message Sent Confirmation**: After sending message
  - Verify confirmation message displays
  - Verify "Message sent via WhatsApp" notification
  
- [ ] **Message Delivery Status**: Check message status
  - Verify delivery status updates (if API supports)
  - Verify read receipts (if API supports)
  
- [ ] **Conversation History**: Navigate to messages page
  - Verify WhatsApp conversations logged
  - Verify can view message history
  - Verify timestamps display correctly

### 4.6 Privacy and Security
- [ ] **Phone Number Privacy**: Verify artisan phone numbers
  - Verify phone numbers not exposed in frontend code
  - Verify phone numbers only revealed when user initiates contact
  
- [ ] **User Consent**: Verify consent flow
  - Verify user agrees to WhatsApp terms before sending
  - Verify privacy policy link available
  
- [ ] **Data Protection**: Verify message data handling
  - Verify messages not stored unnecessarily
  - Verify user data not shared without consent

---

## 5. Responsive Design Testing

### 5.1 Mobile Devices (Portrait)
- [ ] **iPhone SE (375x667)**: Test all major pages
  - Home page renders correctly
  - Navigation menu works (hamburger menu)
  - Product grid displays 1-2 columns
  - Images scale appropriately
  - Text is readable without zooming
  - Buttons are tappable (min 44x44px)
  - Forms are usable
  - Cart displays correctly
  
- [ ] **iPhone 12/13 (390x844)**: Repeat mobile tests
- [ ] **iPhone 14 Pro Max (430x932)**: Repeat mobile tests
- [ ] **Samsung Galaxy S21 (360x800)**: Repeat mobile tests
- [ ] **Google Pixel 6 (412x915)**: Repeat mobile tests

### 5.2 Mobile Devices (Landscape)
- [ ] **iPhone (Landscape)**: Test key pages
  - Navigation adapts to landscape
  - Content doesn't overflow
  - Images maintain aspect ratio
  
- [ ] **Android (Landscape)**: Repeat landscape tests

### 5.3 Tablet Devices (Portrait)
- [ ] **iPad Mini (768x1024)**: Test all major pages
  - Home page renders correctly
  - Navigation shows full menu or adapted menu
  - Product grid displays 2-3 columns
  - Sidebar layouts work correctly
  - Dashboard displays correctly
  
- [ ] **iPad Pro 11" (834x1194)**: Repeat tablet tests
- [ ] **iPad Pro 12.9" (1024x1366)**: Repeat tablet tests

### 5.4 Tablet Devices (Landscape)
- [ ] **iPad (Landscape)**: Test key pages
  - Layout adapts to landscape orientation
  - Product grid displays 3-4 columns
  - Sidebar layouts adjust appropriately

### 5.5 Desktop Resolutions
- [ ] **1366x768 (Small Laptop)**: Test all major pages
  - Full navigation displays
  - Product grid displays 3-4 columns
  - Sidebar layouts work correctly
  - No horizontal scrolling
  
- [ ] **1920x1080 (Full HD)**: Repeat desktop tests
  - Content centered or full-width as designed
  - Images display at appropriate size
  
- [ ] **2560x1440 (2K)**: Repeat desktop tests
  - Layout scales appropriately
  - Text remains readable
  
- [ ] **3840x2160 (4K)**: Repeat desktop tests
  - High-resolution images load
  - UI elements scale correctly

### 5.6 Responsive Breakpoints
- [ ] **Breakpoint Transitions**: Resize browser window
  - Smoothly transition between mobile/tablet/desktop layouts
  - No layout breaks during resize
  - Images resize smoothly
  - Navigation adapts correctly
  
- [ ] **Edge Cases**: Test at exact breakpoint widths
  - 640px (sm breakpoint)
  - 768px (md breakpoint)
  - 1024px (lg breakpoint)
  - 1280px (xl breakpoint)

### 5.7 Touch Interactions (Mobile/Tablet)
- [ ] **Tap Targets**: Test button and link sizes
  - All interactive elements min 44x44px
  - Adequate spacing between tap targets
  - No accidental taps on adjacent elements
  
- [ ] **Swipe Gestures**: Test swipeable components
  - Image carousels swipe smoothly
  - Product galleries swipe correctly
  - No conflicts with browser swipe gestures
  
- [ ] **Pinch to Zoom**: Test zoom functionality
  - Product images can be zoomed
  - Zoom doesn't break layout
  - Can zoom out to normal view
  
- [ ] **Scroll Performance**: Test scrolling
  - Smooth scrolling on long pages
  - No janky animations
  - Sticky headers work correctly

### 5.8 Orientation Changes
- [ ] **Portrait to Landscape**: Rotate device
  - Layout adapts immediately
  - No content loss
  - No layout breaks
  
- [ ] **Landscape to Portrait**: Rotate device
  - Layout adapts immediately
  - Navigation adjusts correctly
  - Forms remain usable

---

## 6. Browser Compatibility Testing

### 6.1 Chrome (Latest Version)
- [ ] **Windows 10/11**: Test all major features
  - All pages load correctly
  - All interactive features work
  - No console errors
  - CSS renders correctly
  - JavaScript executes correctly
  
- [ ] **macOS**: Repeat Chrome tests
- [ ] **Linux**: Repeat Chrome tests

### 6.2 Firefox (Latest Version)
- [ ] **Windows 10/11**: Test all major features
  - All pages load correctly
  - Voice recording works (MediaRecorder API)
  - Payment integration works
  - CSS renders correctly (check Flexbox/Grid)
  - No console errors
  
- [ ] **macOS**: Repeat Firefox tests
- [ ] **Linux**: Repeat Firefox tests

### 6.3 Safari (Latest Version)
- [ ] **macOS**: Test all major features
  - All pages load correctly
  - Voice recording works (check webkit prefixes)
  - Payment integration works
  - CSS renders correctly (check webkit-specific styles)
  - localStorage works correctly
  - No console errors
  
- [ ] **iOS (iPhone)**: Repeat Safari tests on mobile
- [ ] **iOS (iPad)**: Repeat Safari tests on tablet

### 6.4 Edge (Latest Version)
- [ ] **Windows 10/11**: Test all major features
  - All pages load correctly
  - All interactive features work
  - Payment integration works
  - No console errors
  - CSS renders correctly

### 6.5 Older Browser Versions
- [ ] **Chrome (1 year old)**: Test core functionality
  - Verify graceful degradation
  - Verify polyfills work
  
- [ ] **Firefox (1 year old)**: Test core functionality
- [ ] **Safari (1 year old)**: Test core functionality

### 6.6 Browser-Specific Features
- [ ] **Chrome DevTools**: Test developer experience
  - React DevTools work correctly
  - Console logs are helpful
  - Network requests visible
  
- [ ] **Firefox DevTools**: Repeat DevTools tests
- [ ] **Safari Web Inspector**: Repeat DevTools tests

### 6.7 Browser Extensions Compatibility
- [ ] **Ad Blockers**: Test with uBlock Origin, AdBlock Plus
  - Verify site functions correctly
  - Verify no critical features blocked
  - Verify analytics still work (if needed)
  
- [ ] **Privacy Extensions**: Test with Privacy Badger, Ghostery
  - Verify site functions correctly
  - Verify third-party integrations work
  
- [ ] **Password Managers**: Test with LastPass, 1Password
  - Verify login forms work correctly
  - Verify password autofill works
  - Verify payment forms work

### 6.8 JavaScript Disabled
- [ ] **No JavaScript**: Disable JavaScript in browser
  - Verify graceful degradation message displays
  - Verify critical content still accessible
  - Verify SEO content visible

### 6.9 Cookies and Storage
- [ ] **Cookies Disabled**: Disable cookies
  - Verify appropriate message displays
  - Verify site prompts to enable cookies
  
- [ ] **localStorage Disabled**: Disable localStorage
  - Verify cart still works (fallback to memory)
  - Verify auth still works (fallback to session)
  
- [ ] **Private/Incognito Mode**: Test in private browsing
  - Verify all features work
  - Verify no persistent data after closing

### 6.10 Performance Testing
- [ ] **Slow Network (3G)**: Throttle network in DevTools
  - Verify pages load within acceptable time
  - Verify loading indicators display
  - Verify images lazy load
  
- [ ] **Offline Mode**: Disable network
  - Verify offline message displays
  - Verify cached content available (if PWA)
  - Verify graceful error handling

---

## Testing Sign-Off

### Tester Information
- **Tester Name**: ___________________________
- **Date**: ___________________________
- **Environment**: ___________________________

### Summary
- **Total Tests**: ___________________________
- **Tests Passed**: ___________________________
- **Tests Failed**: ___________________________
- **Critical Issues**: ___________________________
- **Non-Critical Issues**: ___________________________

### Critical Issues Found
1. _______________________________________________________________
2. _______________________________________________________________
3. _______________________________________________________________

### Recommendations
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

### Approval
- [ ] All critical tests passed
- [ ] All critical issues resolved or documented
- [ ] Ready for production deployment

**Approved By**: ___________________________
**Date**: ___________________________

---

## Notes

- Complete this checklist in a staging environment before production deployment
- Document all issues found with screenshots and steps to reproduce
- Retest all failed items after fixes are applied
- Some tests may require specific test accounts or test API keys
- Coordinate with backend team for API testing
- Use browser DevTools to check for console errors during all tests
- Test with real devices when possible, not just browser emulation
- Consider accessibility testing with screen readers (separate checklist recommended)
