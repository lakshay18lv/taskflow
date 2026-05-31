import { ActivityIndicator, Pressable, Text } from 'react-native';

export default function LoadingButton({ title, loading, onPress, colors, muted }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={{
        minHeight: 52,
        borderRadius: 18,
        backgroundColor: muted ? colors.primarySoft : colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: loading ? 0.75 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={muted ? colors.primary : colors.card} />
      ) : (
        <Text style={{ color: muted ? colors.primary : colors.card, fontWeight: '800', fontSize: 16 }}>{title}</Text>
      )}
    </Pressable>
  );
}
