const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/auth/signup - Handles user registration and sends OTP
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Insert user profile data (username, etc.) into a separate `profiles` table
    // This is optional but good practice to separate auth data from profile data
    const { error: profileError } = await supabase.from('profiles').insert([
      { id: data.user.id, username: username }
    ]);

    if (profileError) {
      console.error('Profile creation failed:', profileError);
      // You might want to delete the user from auth.users here
    }

    res.status(201).json({ message: 'User created. Check your email for a verification link.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup.' });
  }
});

// POST /api/auth/verify-otp - Verifies the OTP sent to the user's email
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    // For the dev phase, you can skip actual Supabase OTP verification and just send a success message.
    // In production, you would use:
    // const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' });
    
    // Using a simple check for now
    if (otp === '123456') { // Using a dummy OTP for development
      return res.status(200).json({ message: 'Email verified successfully.' });
    }

    res.status(400).json({ error: 'Invalid OTP. Please try again.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during OTP verification.' });
  }
});

// POST /api/auth/complete-profile - Updates the user's profile with bio and interests
router.post('/complete-profile', async (req, res) => {
  const { userId, bio, interests } = req.body;

  try {
    // In a real application, you would get the userId from a JWT in the request headers
    // For now, we'll assume the client sends it.
    const { error } = await supabase.from('profiles').update({ bio, interests }).eq('id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ message: 'Profile completed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during profile completion.' });
  }
});

module.exports = router;
