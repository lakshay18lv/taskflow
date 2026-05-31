import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '../components/LoadingButton';
import { palettes } from '../constants/colors';
import { requestOtp, verifyOtp } from '../store/slices/authSlice';

export default function AuthScreen() {
  const dispatch = useDispatch();
  const { loading, pendingEmail, devOtp, error } = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.theme.mode);
  const colors = palettes[mode];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const inputStyle = {
    backgroundColor: colors.input,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 12,
  };

  const handleOtpRequest = () => {
    dispatch(requestOtp({ name: name.trim(), email: email.trim().toLowerCase() }));
  };

  const handleVerify = () => {
    dispatch(verifyOtp({ email: pendingEmail, otp }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', padding: 22 }}>
        <Text style={{ color: colors.accent, fontWeight: '900', letterSpacing: 2, marginBottom: 10 }}>TASKFLOW</Text>
        <Text style={{ color: colors.text, fontSize: 38, fontWeight: '900', lineHeight: 44 }}>
          Plan work without the chaos.
        </Text>
        <Text style={{ color: colors.muted, marginTop: 12, marginBottom: 28, fontSize: 16, lineHeight: 23 }}>
          Sign in with a simple OTP and keep your projects, tasks, and progress in one tidy place.
        </Text>

        {!pendingEmail ? (
          <>
            <TextInput value={name} onChangeText={setName} placeholder="Your name" placeholderTextColor={colors.muted} style={inputStyle} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={inputStyle}
            />
            <LoadingButton title="Send OTP" loading={loading} onPress={handleOtpRequest} colors={colors} />
          </>
        ) : (
          <>
            <Text style={{ color: colors.muted, marginBottom: 10 }}>OTP sent to {pendingEmail}</Text>
            {!!devOtp && (
              <View style={{ padding: 12, backgroundColor: colors.primarySoft, borderRadius: 14, marginBottom: 12 }}>
                <Text style={{ color: colors.primary, fontWeight: '900' }}>Development OTP: {devOtp}</Text>
              </View>
            )}
            <TextInput
              value={otp}
              onChangeText={setOtp}
              placeholder="6 digit OTP"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              maxLength={6}
              style={inputStyle}
            />
            <LoadingButton title="Verify & Continue" loading={loading} onPress={handleVerify} colors={colors} />
          </>
        )}

        {!!error && <Text style={{ color: colors.danger, marginTop: 14, fontWeight: '700' }}>{error}</Text>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
