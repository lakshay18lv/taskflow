import { Text, View } from 'react-native';

export default function EmptyState({ title, subtitle, colors }) {
  return (
    <View style={{ padding: 24, alignItems: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 19, fontWeight: '800' }}>{title}</Text>
      <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>{subtitle}</Text>
    </View>
  );
}
