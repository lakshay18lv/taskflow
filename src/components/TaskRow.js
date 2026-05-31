import { Pressable, Text, View } from 'react-native';

export default function TaskRow({ task, colors, onToggle, onDelete }) {
  const done = task.status === 'completed';

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 18,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Pressable
        onPress={onToggle}
        style={{
          height: 28,
          width: 28,
          borderRadius: 14,
          backgroundColor: done ? colors.primary : 'transparent',
          borderColor: colors.primary,
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.card, fontWeight: '900' }}>{done ? '✓' : ''}</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', textDecorationLine: done ? 'line-through' : 'none' }}>
          {task.title}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>
          {task.due_date ? `Due ${String(task.due_date).slice(0, 10)}` : 'No due date'}
        </Text>
      </View>
      <Pressable onPress={onDelete} hitSlop={10}>
        <Text style={{ color: colors.danger, fontWeight: '900' }}>×</Text>
      </Pressable>
    </View>
  );
}
