# OtoPila - User Manual & Testing Guide (AI was used for this guide)

## Table of Contents
1. [Getting Started](#getting-started)
2. [Customer Journey Testing](#customer-journey-testing)
3. [Advisor Journey Testing](#advisor-journey-testing)
4. [Feature Testing Guide](#feature-testing-guide)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Python installed on your system (for running local server)
- Internet connection (for Bootstrap CDN)

### Setup Instructions

1. **Navigate to the project folder**
   ```cmd
   cd c:\Users\jafph\Desktop\CTRL-ALT-ELITE_WST_Project-Oto-Pila-version-2\OtoPila
   ```

2. **Start a local server**
   ```cmd
   py -m http.server 5500
   ```

3. **Open your browser**
   - Navigate to: `http://localhost:5500/index.html`

4. **Clear browser data (optional but recommended for fresh start)**
   - Open browser DevTools (F12)
   - Go to Application > Local Storage
   - Clear all OtoPila data

---

## Customer Journey Testing

### Test 1: Joining the Queue

1. **Navigate to Home Page**
   - Open `http://localhost:5500/index.html`
   - Verify the hero section displays properly
   - Check that all images load correctly

2. **Click "Join Queue Now" Button**
   - Should redirect to `queue.html`

3. **Fill Out the Queue Form**
   - **Full Name Field:**
     - Try typing numbers (e.g., "John123") → Numbers should be automatically removed
     - Try typing lowercase (e.g., "john doe") → Should auto-capitalize to "John Doe"
     - Try typing "mary jane" → Should become "Mary Jane"
   
   - **Email Field (Optional):**
     - Enter any valid email: `test@example.com`
   
   - **Car Plate Field (Optional):**
     - Try typing "abc1234" → Should format to "ABC-1234"
     - Try typing "xyz567" → Should format to "XYZ-567"
     - Try invalid formats → Should show validation error

4. **Submit the Form**
   - Click "Join Queue" button
   - Button should show loading spinner briefly
   - Should redirect to `status.html?new=true`
   - A modal should pop up showing your queue number

### Test 2: Viewing Queue Status

1. **Check Your Status**
   - Verify "Your Queue Number" is displayed (e.g., "A-101")
   - Check "Now Serving" shows current customer
   - See "Customers Ahead" count
   - Status message should indicate your position

2. **Wait for Real-Time Updates**
   - Leave the page open
   - Open another browser window/tab
   - Login as advisor (see Advisor Journey)
   - Call next customer from advisor dashboard
   - Return to status page → Should update automatically (refreshes every 3 seconds)

### Test 3: Completing Service & Leaving a Review

1. **Complete Your Service**
   - Have an advisor mark your status as "Completed" (see Advisor Journey)
   - Status page should show completion message
   - Review modal should automatically pop up

2. **Test Star Rating System**
   - **Hover over stars** → Stars should fill with golden color
   - **Hover away** → Stars should return to unfilled state
   - **Click on 3rd star** → First 3 stars should stay filled (golden)
   - **Hover over 5th star** → All 5 stars should fill temporarily
   - **Mouse away** → Should return to 3 stars filled
   - **Click 5th star** → All 5 stars should stay filled

3. **Submit Review**
   - Try submitting without selecting stars → Should show alert
   - Select a rating (e.g., 5 stars)
   - Add a comment: "Great service!"
   - Click "Submit Review"
   - Modal should close
   - Review should be saved to localStorage

4. **Verify Review Display**
   - Go back to `queue.html`
   - Scroll to "What Our Customers Say" section
   - Click next/previous arrows to navigate reviews
   - Your review should appear with:
     - Your name (from queue form)
     - Star rating you selected
     - Random quote based on rating (1-5 stars have different quotes)
     - Your comment

---

## Advisor Journey Testing

### Test 4: Advisor Login

1. **Navigate to Advisor Portal**
   - Go to `http://localhost:5500/advisor-portal.html`
   - Or click "Advisor Login" in navigation

2. **Test Invalid Login**
   - Username: `wrong`
   - Password: `wrong123`
   - Click "Login" → Should show error message

3. **Test Valid Login**
   - Username: `admin`
   - Password: `password123`
   - Click "Login" → Should redirect to `advisor-dashboard.html`

### Test 5: Advisor Dashboard Overview

1. **Check Dashboard Metrics**
   - **Now Serving:** Should show current customer queue number or "---"
   - **Next In Queue:** Should show next waiting customer or "---"
   - **Waiting Count:** Number of customers with "Waiting" status
   - **In Service Count:** Number of customers with "In Service" status
   - **Completed Count:** Number in history

2. **Verify Queue Table**
   - Should list all active customers
   - Each row shows:
     - Queue Number, Name, Car Plate
     - Check-in time
     - Status badge (color-coded)
     - Status dropdown
     - Cancel button

### Test 6: Queue Management Operations

1. **Call Next Customer**
   - Click "Call Next Customer" button
   - First waiting customer should move to "In Service"
   - "Now Serving" should update
   - Previous "In Service" customer should move to "Completed"

2. **Update Customer Status Manually**
   - Find a customer with "Waiting" status
   - Change dropdown to "In Service"
   - Status badge should update immediately
   - "Now Serving" should update

3. **Complete a Service**
   - Select a customer in "In Service"
   - Change status to "Completed"
   - Customer should disappear from queue table
   - "Completed Count" should increase
   - Customer should appear in service history

4. **Cancel a Customer**
   - Click "Cancel" button on any customer
   - Confirmation dialog should appear
   - Click "OK" → Customer removed from queue
   - Dashboard metrics should update

### Test 7: Demo Data & Queue Management

1. **Load Demo Data**
   - Click "Load Demo Data" button
   - Confirmation dialog: "This will clear the current queue..."
   - Click "OK"
   - Queue should populate with sample customers:
     - John Doe (Completed)
     - Jane Smith (In Service)
     - Carlos Reyes (Waiting)
     - Maria Garcia (Waiting)
     - Siti Aminah (Waiting)

2. **Clear Queue**
   - Click "Clear Queue" button
   - Confirmation dialog: "Are you sure..."
   - Click "OK"
   - All customers removed
   - All metrics reset to 0
   - History cleared

### Test 8: Manage Bookings (Service Log)

1. **Navigate to Manage Bookings**
   - Click "Manage Bookings" in navigation
   - Should redirect to `manage-booking.html`

2. **View Service History**
   - Completed customers should appear in table
   - Shows: Queue Number, Name, Car, Finished At

3. **Search Service History**
   - Type customer name in search box
   - Results should filter in real-time
   - Try searching by queue number (e.g., "A-101")
   - Click "Clear" to reset search

4. **Export Service Log**
   - Click "Export Service Log" button
   - JSON file should download: `otopila-service-history.json`
   - Open file → Should contain all completed services

5. **Clear Service Log**
   - Click "Clear Service Log" button
   - Confirmation dialog appears
   - Click "OK" → History cleared
   - Table shows "No completed services yet."

### Test 9: Advisor Logout

1. **Click Logout**
   - Click "Logout" in navigation
   - Should redirect to `index.html`
   - Session should be cleared

2. **Test Auth Guard**
   - Try accessing `http://localhost:5500/advisor-dashboard.html` directly
   - Should redirect to `advisor-portal.html` (login required)

---

## Feature Testing Guide

### Test 10: Car Plate Auto-Formatting

1. Go to `queue.html`
2. Click on "Car plate" field
3. Test various inputs:
   - Type: `abc1234` → Should become: `ABC-1234`
   - Type: `xyz` → Shows: `XYZ`
   - Type: `123` → Shows: `123`
   - Type: `def9876` → Shows: `DEF-9876`
   - Type: `ab12cd34` → Shows: `ABC-1234` (limits to 3 letters, 4 digits)

### Test 11: Name Validation & Capitalization

1. Go to `queue.html`
2. Click on "Full name" field
3. Test various inputs:
   - Type: `john` → Should become: `John`
   - Type: `john doe` → Should become: `John Doe`
   - Type: `MARY SMITH` → Should become: `Mary Smith`
   - Type: `bob123jones` → Should become: `Bobjones` (numbers removed)
   - Type: `alice 456 brown` → Should become: `Alice Brown` (numbers removed)

### Test 12: Real-Time Updates

1. **Open Two Browser Windows:**
   - Window 1: Customer status page (`status.html`)
   - Window 2: Advisor dashboard (`advisor-dashboard.html`)

2. **Test Live Sync:**
   - In Window 2 (Advisor): Click "Call Next Customer"
   - In Window 1 (Customer): Page should update within 3 seconds
   - "Now Serving" should change
   - "Customers Ahead" count should decrease

3. **Test Storage Event:**
   - Open DevTools in Window 1
   - Go to Application > Local Storage
   - Manually edit `otoPilaQueue` data
   - Both windows should update automatically

### Test 13: Review System Complete Flow

1. **Join queue as customer** (follow Test 1)
2. **As advisor, complete the service** (follow Test 6)
3. **Review modal appears on status page**
4. **Test each star rating:**
   - Click 1 star → Submit → Check quote (should be negative)
   - Join queue again, complete service
   - Click 3 stars → Submit → Check quote (should be neutral)
   - Join queue again, complete service
   - Click 5 stars → Submit → Check quote (should be very positive)
5. **Verify reviews appear** in carousel on `queue.html`

### Test 14: Navigation & Responsive Design

1. **Test All Navigation Links:**
   - Home → `index.html`
   - Join Queue → `queue.html`
   - Status → `status.html`
   - Advisor Login → `advisor-portal.html`

2. **Test Responsive Breakpoints:**
   - Desktop view (1920px+)
   - Tablet view (768px)
   - Mobile view (375px)
   - Use browser DevTools to simulate different devices

3. **Test Mobile Navigation:**
   - Resize browser to mobile size
   - Click hamburger menu
   - All links should be accessible

### Test 15: Browser Compatibility

Test the application in multiple browsers:
- **Chrome** (latest version)
- **Firefox** (latest version)
- **Microsoft Edge** (latest version)
- **Safari** (if on Mac)

Verify:
- All features work consistently
- Styling appears correctly
- LocalStorage functions properly
- No console errors

---

## Troubleshooting

### Issue: Demo Data Not Loading

**Solution:**
- Check browser console for errors
- Verify `demodata/sample-queue.json` exists
- Make sure you're using a local server (not file://)
- Clear localStorage and refresh

### Issue: Status Page Not Updating

**Solution:**
- Check browser console for JavaScript errors
- Verify localStorage contains `otoPilaQueue` data
- Hard refresh the page (Ctrl+F5)
- Check if `scripts/status-page.js` is loading

### Issue: Review Modal Not Appearing

**Solution:**
- Ensure customer status is "Completed"
- Check that `reviewModalShownFor{id}` is not in sessionStorage
- Verify Bootstrap JS is loaded (check console)
- Check if `scripts/review-system.js` is loading

### Issue: Stars Not Changing Color

**Solution:**
- Hard refresh the page (Ctrl+Shift+R)
- Check browser console for JavaScript errors
- Verify `review-system.js` is loading correctly
- Check that Bootstrap Modal is properly initialized

### Issue: Name/Car Plate Validation Not Working

**Solution:**
- Check browser console for errors
- Verify `scripts/join-queue.js` is loading
- Make sure input fields have correct IDs: `fullName`, `carPlate`
- Test in a different browser

### Issue: Advisor Can't Login

**Solution:**
- Verify credentials:
  - Username: `admin`
  - Password: `password123`
- Check browser console for errors
- Clear sessionStorage
- Check `scripts/auth.js` is loading

### Issue: "Now Serving" Shows "---"

**Solution:**
- This is normal if no customer is in service
- Call next customer or manually set a customer to "In Service"
- Check localStorage data in DevTools

---

## Testing Checklist

Use this checklist to ensure complete testing:

### Customer Features
- [ ] Join queue with valid name (auto-capitalized)
- [ ] Name validation (no numbers allowed)
- [ ] Car plate auto-formatting
- [ ] View queue status
- [ ] Real-time status updates
- [ ] Receive review modal after completion
- [ ] Star rating hover effect
- [ ] Star rating click selection
- [ ] Submit review
- [ ] View reviews in carousel

### Advisor Features
- [ ] Login with correct credentials
- [ ] Invalid login shows error
- [ ] Dashboard shows correct metrics
- [ ] Call next customer
- [ ] Update customer status
- [ ] Complete customer service
- [ ] Cancel customer
- [ ] Load demo data
- [ ] Clear queue
- [ ] View service history
- [ ] Search service history
- [ ] Export service log
- [ ] Clear service history
- [ ] Logout

### Technical Features
- [ ] LocalStorage persistence
- [ ] Real-time updates across tabs
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Browser compatibility
- [ ] No console errors
- [ ] All navigation links work
- [ ] Forms validate correctly
- [ ] Modals open/close properly

---

## Additional Notes

### Data Persistence
- All data is stored in browser's `localStorage`
- Data persists across page refreshes
- Data is browser-specific (not shared between browsers)
- Clear localStorage to reset application state

### Demo Data Structure
The demo data includes 5 customers with different statuses:
1. Completed customer (in history)
2. In Service customer (actively being served)
3-5. Waiting customers (in queue)

### Review Quotes by Rating
- **1 Star:** Negative feedback quotes
- **2 Stars:** Below average quotes
- **3 Stars:** Neutral/average quotes
- **4 Stars:** Positive feedback quotes
- **5 Stars:** Excellent service quotes

Each rating has 3 random quote options that are selected when the review is submitted.

---

## Contact & Support

For issues or questions about this testing guide:
- Check the main `README.md` for project documentation
- Review `PROJECT_RULES.md` for technology constraints
- Inspect browser console for error messages
- Verify all file paths and CDN links are accessible

---

**End of User Manual**
